---
title: "Taking the router out of our design system: a React Router v5 → v6 upgrade"
date: 2026-10-23
description: "Upgrading React Router across a shared design system and four apps, and why the design system ended up not knowing about the router at all."
tags: [react, react-router, typescript, design-systems, refactoring]
---

*I did this work in the first half of 2026, as part of our React 18 upgrade.*

## Why the router had to move

Like [react-dnd](/writing/react-dnd-before-react-18) before it, React Router v5 was one of the dependencies standing between us and React 18. We were on v5.3, and routing touched everything: our shared design system and four apps that consume it.

I took the same approach as with react-dnd: treat the router as its own track, ship it in reviewable merge requests, and keep the React 18 upgrade itself small.

The interesting part turned out not to be the API changes. It was a question that came up in review: why does the design system know about the router at all?

## Taking the router out of the design system

Some design system components rendered links or navigated on click. A tree view rendered `<Link>`s, and a couple of pickers and tables took a `history` prop and called `history.push()`. That meant the design system depended on `react-router` and `react-router-dom`, so upgrading the router meant upgrading it in the design system and in every app, in lockstep.

My first plan was to keep that dependency and make it work with v6: set up a router in the Storybook decorators and the test render helper, add the v6 future flags, and move on. In review, the team and I landed on a better idea. Make the design system **router-agnostic**, so it doesn't import the router at all.

The fix is plain dependency injection. Components that need to link or navigate get that ability passed in by the app:

```tsx
// Before: the design system imports the router
import { Link } from 'react-router-dom';

function TreeItem({ to, label }: { to: string; label: string }) {
  return <Link to={to}>{label}</Link>;
}

function MediaPicker({ history }: { history: History }) {
  const open = (id: string) => history.push(`/media/${id}`);
  // ...
}
```

```tsx
// After: the app hands in what the component needs
type LinkComponentType = React.ComponentType<{ to: string; children: React.ReactNode }>;

function TreeItem({ to, label, LinkComponent }: { to: string; label: string; LinkComponent: LinkComponentType }) {
  return <LinkComponent to={to}>{label}</LinkComponent>;
}

function MediaPicker({ navigate }: { navigate: (to: string) => void }) {
  const open = (id: string) => navigate(`/media/${id}`);
  // ...
}
```

```tsx
// In the app
import { Link, useNavigate } from 'react-router-dom';

function MediaPage() {
  const navigate = useNavigate();
  return <MediaPicker navigate={navigate} />;
}

<TreeItem to="/folders/42" label="Campaigns" LinkComponent={Link} />;
```

I made `LinkComponent` **required** rather than optional. An optional prop with a plain `<a>` fallback would have quietly done full page reloads in any app that forgot to pass it. Required means TypeScript catches it.

What we got out of it:

- The router packages (and their `@types`) came out of the design system entirely.
- Storybook and the test helpers no longer need a router, so the setup I'd planned to add got deleted instead.
- The design system will never block a router upgrade again. When the apps move to v7, it doesn't have to change.

## What changed between v5 and v6

With the design system out of the way, each app got its own merge request. The mechanical changes, for reference:

- `<Switch>` → `<Routes>`
- `<Route component={Page} />` → `<Route element={<Page />} />`
- `<Redirect>` → `<Navigate>`
- `exact` is gone. Routes match exactly by default, and you use `end` (or an `index` route) where you need it.
- `useHistory()` → `useNavigate()`
  - `history.push(path)` → `navigate(path)`
  - `history.replace(path)` → `navigate(path, { replace: true })`
- `useRouteMatch()` → `useMatch()`, and `matchPath` got a new argument order
- `withRouter` is gone, so any class component that used it either became a function component or got its props from a small wrapper
- `<Prompt>` is gone (more on that below)

We went from 5.3 to 6.30, the last line of v6.

## Auth guards, nested modals and typed params

**Guards.** v5 had `SecureRoute`- and `ScopedRoute`-style components. The v6-native pattern is a layout route that checks auth and renders `<Outlet />`. I used `<Outlet />` in some places, but for the guards I chose wrapper components instead:

```tsx
<Route
  path="admin/*"
  element={
    <RequireAuth>
      <AdminRoutes />
    </RequireAuth>
  }
/>
```

The reason was diff size. Wrappers kept the route tree looking much like it did in v5, which made the merge requests far easier to review. A layout route with `<Outlet />` would be the more idiomatic choice, and it's a reasonable follow-up, but it wasn't worth doubling the diff for.

**Nested modals.** Detail views that open as modals over a list became nested routes, so the list stays rendered underneath and the modal has a real URL:

```tsx
<Route path="users" element={<Users />}>
  <Route path=":userId" element={<UserModal />} />
</Route>
```

Routes with parameters also got validation, so an invalid ID renders a not-found page instead of a broken screen.

**Typed params.** `useParams()` returns `string | undefined` for everything, so I added a small typed wrapper hook. Components declare which params they expect, and TypeScript catches typos in param names.

## The prompt we couldn't fully replace

v5's `<Prompt>` warned users before they left a page with unsaved changes. v6 removed it. The replacement, `useBlocker`, only works with the newer data routers, and our apps use `<BrowserRouter>`. Moving to data routers was out of scope for this upgrade.

So I replaced it with a `beforeunload` component:

```tsx
function BeforeUnloadPrompt({ when }: { when: boolean }) {
  useEffect(() => {
    if (!when) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [when]);

  return null;
}
```

This is an honest trade-off, not a full replacement. It catches refreshes and tab closes, but not in-app navigation. We wrote that down explicitly so nobody assumes the old behaviour still exists. The full fix is moving to data routers, which also makes `useBlocker` available.

## The bug I missed: routes that live inside components

One bug got through, and it's the most useful part of this post.

In v5, the app had a top-level route for the reporting section. The reporting component itself worked out which report to show from the rest of the URL. When I audited routes, I went through the route definitions in the app's root component and converted them. I didn't account for the fact that the reporting component relied on nested paths underneath its own route.

In v6, a URL parameter only exists if some route declares it. With no nested route declaring the report parameter, it was always undefined, so the page always fell back to the default report.

The fix was to give the component its own nested routes:

```tsx
// App
<Route path="reports/*" element={<Reports />} />

// Reports
function Reports() {
  return (
    <Routes>
      <Route path=":reportId" element={<ReportView />} />
      <Route index element={<ReportView />} />
    </Routes>
  );
}

function ReportView() {
  const { reportId = DEFAULT_REPORT_ID } = useParams();
  // ...
}
```

We missed it because the environment we tested in didn't have a full build of that feature, so the path that broke never got exercised.

Two lessons I took from it:

- **Audit every place that reads the URL, not just where routes are defined.** Search for `useParams`, `useRouteMatch`, `useLocation` and `matchPath` across the codebase. Routes that live inside components are the ones a top-down audit skips.
- **A test environment that doesn't match production will hide exactly the bugs a migration causes.** If a feature isn't fully set up where you test, call it out as a risk in the merge request instead of assuming it's covered.

## What's next

There's one piece I haven't covered: Redux. Some of our apps navigated from inside sagas using `connected-react-router`, which doesn't support v6. In one app I moved that navigation into components. In the others I shipped a deliberately ugly bridge function to keep things moving. That deserves its own post, along with how I'm getting rid of the bridge.

## Takeaways

- **Shared components shouldn't depend on your router.** Inject `Link` and `navigate`, and the design system stops blocking router upgrades.
- **Optimise merge requests for review.** Wrapper guards over layout routes was a deliberate choice to keep diffs small.
- **Name your trade-offs.** `beforeunload` isn't `<Prompt>`, and saying so out loud is better than letting people find out.
- **Search for every URL read, not just route definitions.** That's where migration bugs hide.

---
title: "appNavigate_DO_NOT_USE_FOR_NEW_CODE_OR_YOU_WILL_BE_FIRED: navigating from Redux sagas after React Router v6"
date: 2026-11-01
description: "How I kept Redux sagas navigating after upgrading to React Router v6 without connected-react-router's push(), and the plan to remove the bridge."
tags: [react, react-router, redux, redux-saga, refactoring]
---

_I did this work in the first half of 2026, as part of our React 18 upgrade. It follows on from [my post on upgrading to React Router v6](/writing/react-router-v6-router-agnostic-design-system)._

For years, React exported its shared internals under the name [`__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`](https://github.com/facebook/react/blob/v18.3.1/packages/react/src/React.js#L116). The name was the documentation: this is here, and you shouldn't touch it. Libraries reached for it anyway, and in React 19 it was [renamed to `__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`](https://github.com/facebook/react/pull/28789), which tells you how well "do not use" works on its own.

When I needed a function that our sagas could call but that nobody should ever reach for in new code, I borrowed the idea:

```ts
appNavigate_DO_NOT_USE_FOR_NEW_CODE_OR_YOU_WILL_BE_FIRED("/items");
```

This post is about why that function exists, why I'm fine with it existing for now, and how it goes away.

## The problem: sagas that navigate

Our apps use Redux and redux-saga, and routing was wired into Redux through `connected-react-router`. That gave us two things:

1. **Router state in the store.** Selectors could read the current location.
2. **Navigation as actions.** A saga could `yield put(push('/items/42'))` after a save, and the router would follow.

The second one is the problem. Sagas redirecting after a create, a delete or a duplicate was a common pattern, and in v6 navigation comes from a hook, `useNavigate()`. Hooks only work inside components. Sagas aren't components.

## Option one: move navigation into components

In one app the saga layer was small, and the sagas that navigated did nothing else interesting: save, then redirect. There I deleted the redirect sagas and moved navigation into the component that starts the action:

```tsx
function ItemForm() {
  const navigate = useNavigate();

  const handleSave = async (values: ItemValues) => {
    const item = await saveItem(values);
    navigate(`/items/${item.id}`);
  };

  // ...
}
```

This is the version I'd pick every time if it were cheap. The component owns the user flow, so it decides where the user goes next. It's also easier to test and easier to follow than an action that triggers a saga that triggers a redirect.

## Option two: a bridge

In the other apps the saga layer was much bigger, and navigation was tangled into multi-step flows. Rewriting all of that inside a router upgrade would have tripled the risk and the review size. So I built a bridge: a module that holds a reference to React Router's `navigate` function, so code outside React can call it.

```ts
import type { NavigateFunction, NavigateOptions } from "react-router-dom";

let navigateRef: NavigateFunction | null = null;

export function registerNavigate(navigate: NavigateFunction) {
  navigateRef = navigate;
}

/**
 * Imperative navigation for non-React code (sagas) only.
 * Components must use `useNavigate()`.
 * @deprecated
 */
export function appNavigate_DO_NOT_USE_FOR_NEW_CODE_OR_YOU_WILL_BE_FIRED(
  to: string,
  options?: NavigateOptions,
) {
  if (!navigateRef) {
    throw new Error("appNavigate was called before the router mounted");
  }
  navigateRef(to, options);
}
```

A small component inside the router registers the real function:

```tsx
function NavigationBridge({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate]);

  return <>{children}</>;
}
```

And sagas call it where they used to `put(push(...))`:

```ts
function* duplicateItemSaga(action: DuplicateItemAction) {
  const copy: Item = yield call(api.duplicateItem, action.payload.id);
  yield call(
    appNavigate_DO_NOT_USE_FOR_NEW_CODE_OR_YOU_WILL_BE_FIRED,
    `/items/${copy.id}`,
  );
}
```

A few deliberate details:

- **It throws if the router isn't ready.** Failing loudly is better than a redirect that silently does nothing.
- **It's marked `@deprecated`.** Editors strike it through, which is a constant visual reminder.
- **The name does the rest.** It's impossible to use by accident, and it's very obvious in a code review.

For the other half of what `connected-react-router` did, a small hook listens for location changes and keeps the router state in the store up to date, so existing selectors kept working without a rewrite. In tests, the bridge is mocked, so saga tests can assert on where they tried to navigate.

## Why I'm comfortable shipping a hack

Honestly, because it's a labelled, contained, temporary one.

The alternative was a router upgrade bundled with a rewrite of the saga layer, which would have been huge, risky and hard to review. The bridge kept the upgrade the size of a router upgrade. Everything ugly lives in one small file with a name nobody can miss.

Has the name worked? So far, yes. No new code has used it. I still look for it in every merge request, which is the weak point of this approach, and I'll come back to that below.

## How it goes away

`connected-react-router` still works with React 18, so my team lead and I agreed to remove it after the React 18 work rather than during it. The plan:

1. Move each saga that navigates either into its component (the default) or keep it on the bridge if the flow is genuinely complex.
2. Replace selectors that read router state from the store with `useLocation()` and `useParams()` in components.
3. Remove the router state from the store and uninstall `connected-react-router`.
4. Delete the bridge once nothing calls it.

My rule for step one: **if a saga's only job is "do the thing, then redirect", the redirect belongs in the component.** Keep the bridge only where navigation is buried in the middle of a longer flow.

## What I'd do differently

**Enforce it with a linter, not with my eyes.** Watching every merge request works until I'm on holiday. An ESLint `no-restricted-imports` rule that bans the bridge everywhere except the saga folders would turn "please don't" into a failing build:

```js
// .eslintrc.js
module.exports = {
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "src/routing/navigation",
            importNames: [
              "appNavigate_DO_NOT_USE_FOR_NEW_CODE_OR_YOU_WILL_BE_FIRED",
            ],
            message: "Use useNavigate() in components.",
          },
        ],
      },
    ],
  },
  overrides: [
    { files: ["src/**/sagas/**"], rules: { "no-restricted-imports": "off" } },
  ],
};
```

## Takeaways

- **A clearly labelled hack beats a risky rewrite in the middle of a migration.** Contain it, name it loudly and plan its removal.
- **Navigation belongs to the component that owns the user flow.** Sagas redirecting after a save is a pattern worth moving away from.
- **Make the wrong thing hard to do.** A loud name and `@deprecated` help, and a lint rule finishes the job.
- **Separate the upgrade from the clean-up.** Agreeing to remove `connected-react-router` after React 18 kept both pieces of work reviewable.

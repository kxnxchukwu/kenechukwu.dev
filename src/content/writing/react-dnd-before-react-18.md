---
title: "Upgrade the dependencies before you upgrade React: moving off react-dnd's HOCs"
date: 2026-10-21
description: "How splitting a react-dnd v10 → v15 migration out of our React 18 upgrade kept every merge request reviewable, and what I'd do differently next time."
tags: [react, react-dnd, typescript, refactoring]
---

*I did this work in August and September 2025, ahead of our React 18 upgrade.*

*The code below is simplified to show the patterns; it isn't our production code.*

## Why react-dnd went first

When we started planning our React 18 upgrade at work, the obvious move was one big branch: bump React, fix whatever breaks, ship it. The problem was react-dnd. We were on v10, still using the old HOC API, and drag and drop was wired into our shared design system and every app that consumes it.

Doing both upgrades at once would have produced a merge request nobody could seriously review. So I split react-dnd into its own track: upgrade it, remove the deprecated APIs, and ship it in reviewable chunks before React 18 was even touched. Each chunk had its own milestone, and by the time we got to React itself, drag and drop was one less thing that could break.

## What actually changed between v10 and v15

Most of the work fell into a handful of buckets:

- **Backends became named exports.** `HTML5Backend` and `TestBackend` are no longer default exports, so every import had to change:

  ```ts
  // before
  import HTML5Backend from 'react-dnd-html5-backend';
  // after
  import { HTML5Backend } from 'react-dnd-html5-backend';
  ```

- **The HOC API is on its way out.** `DragSource`, `DropTarget`, `DragLayer` and their collector types (`DragSourceCollector`, `DropTargetCollector`) are deprecated. Their replacements are `useDrag`, `useDrop` and `useDragLayer`.
- **`begin` is deprecated.** Anything you did when a drag started belongs in `item`, which can now be a function.
- **`type` moved.** In older hook code, `type` lived inside `item`. Now it's a top-level field on the spec.
- **Monitors are generic.** Typing `DragSourceMonitor<DragItem>` instead of a bare `DragSourceMonitor` means `monitor.getItem()` returns something useful instead of `any`.

None of these is hard on its own. The work is in how many places they show up.

## Rollout: design system first, then everyone else

Our shared design system is the package every frontend app depends on, so it had to go first. The order was:

1. Upgrade react-dnd in the design system, remove the HOCs, and publish a new major version.
2. Move each consuming app onto that version, one merge request per app.

The main friction was TypeScript. While apps were moving over, you could end up with more than one copy of react-dnd's types in `node_modules`: one pulled in by the design system and one by the app. Nothing crashed at runtime, but the type checker complained that two identical-looking types weren't compatible. Running `yarn dedupe` to collapse them to a single copy fixed it each time.

Two version decisions are worth calling out:

- **Why 15 and not 16?** v16 is ESM-only, and one of our apps still runs on Create React App, whose test setup doesn't handle ESM-only packages without extra configuration. I wanted every repo on the same version, so 15 it was.
- **I pinned the exact version (`15.1.2`) everywhere.** That gave us one known version to debug against. In hindsight I'd use a caret (`^15.1.2`) so patch releases come in without someone having to bump five `package.json` files by hand.

## From HOCs to spec builders

Before, the drag logic lived inside a HOC:

```jsx
const cellSource = {
  canDrag: (props) => !props.disableDrag,
  beginDrag: (props) => ({ id: props.id, rowIndex: props.rowIndex }),
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});

class Cell extends React.Component {
  render() {
    const { connectDragSource, isDragging, children } = this.props;
    return connectDragSource(
      <div style={{ opacity: isDragging ? 0.5 : 1 }}>{children}</div>
    );
  }
}

export default DragSource(ItemTypes.CELL, cellSource, collect)(Cell);
```

After, the spec comes from a plain function, and the component just calls `useDrag`:

```tsx
type CellDragItem = { id: string; rowIndex: number };

type CellDragArgs = {
  id: string;
  rowIndex: number;
  disableDrag: boolean;
  isMobile: boolean;
  selectedCount: number;
};

export function buildCellDragSpec({ id, rowIndex, disableDrag, isMobile, selectedCount }: CellDragArgs) {
  return {
    type: ItemTypes.CELL,
    item: (): CellDragItem => ({ id, rowIndex }),
    canDrag: () => !isMobile && !disableDrag && selectedCount < 2,
    collect: (monitor: DragSourceMonitor<CellDragItem>) => ({
      isDragging: monitor.isDragging(),
    }),
  };
}

function Cell({ children, id, rowIndex, disableDrag, isMobile, selectedCount }: CellDragArgs & { children: React.ReactNode }) {
  const [{ isDragging }, drag] = useDrag(
    () => buildCellDragSpec({ id, rowIndex, disableDrag, isMobile, selectedCount }),
    [id, rowIndex, disableDrag, isMobile, selectedCount]
  );

  return <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>{children}</div>;
}
```

I'll admit I chose this partly for speed. react-dnd already ships `useDrag` and `useDrop`, so I didn't stop to design a custom hook. But it paid off in a way I didn't plan: `canDrag` is now just a function, so I can test it without rendering anything.

```ts
const base = { id: 'a', rowIndex: 0, disableDrag: false, isMobile: false, selectedCount: 0 };

it('cannot drag on mobile', () => {
  expect(buildCellDragSpec({ ...base, isMobile: true }).canDrag()).toBe(false);
});
```

## The hard part: class to function components

Typing the specs was honestly the fun part. Converting the class components was not.

The trickiest one was a virtualized table cell. It had no lifecycle methods, so on paper it was simple. But it was wrapped in Redux's `connectAdvanced` and composed with the drag and drop HOCs, so a lot of its behaviour came from outside the component. Converting it meant:

- replacing `connectAdvanced` with typed `useAppSelector` and `useAppDispatch` calls,
- replacing the drag and drop HOCs with `useDrag` and `useDrop` plus the spec builders,
- typing props that had been passed around loosely. That turned up a few props the cell relied on but its parent never actually passed down.

Here's the part I didn't expect: the file went from 196 lines to 267. Hooks are supposed to make components smaller, but `connectAdvanced` and the HOCs had been hiding a lot of wiring. Once that wiring lives in the component, typed and explicit, there's more of it on the page. I'm fine with that trade. Longer but readable beats shorter but magic.

## Testing

Most of the existing tests only needed their imports updated for the new named exports. The bigger changes were around them:

- **Spec logic got real unit tests.** Because the specs are plain functions, things like "`canDrag` returns false on mobile, when dragging is disabled, or when two or more rows or columns are selected" became quick, direct tests.
- **Storybook became the manual test bench.** The stories had to be updated so drag and drop actually works inside Storybook, which made it the fastest place to check things by hand.
- **Every regression got a test.** Things did break. The one I remember best: dragging a folder from the table into a folder in the main navigation bar stopped working. It's exactly the kind of bug isolated tests miss, because the drag starts in one component and ends in a completely different one. Each time I fixed something like that, I added a test for it so it couldn't quietly come back.

## What I'd do differently

**Use a caret on the version.** Pinning was defensible, but a caret would have saved manual bumps later.

**Wrap the spec builders in a small generic hook.** I'd keep the builders, because they're what make the logic testable, but put a thin typed hook on top so every component doesn't repeat the same `useDrag` boilerplate:

```ts
export function useTypedDrag<TItem>(
  type: string,
  getItem: () => TItem,
  canDrag: () => boolean,
  deps: unknown[]
) {
  return useDrag(
    () => ({
      type,
      item: getItem,
      canDrag,
      collect: (monitor: DragSourceMonitor<TItem>) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    deps
  );
}
```

Best of both: testable logic underneath, and less repetition on top.

## Takeaways

- **Upgrade the dependencies that block React before you upgrade React.** Smaller merge requests get real reviews.
- **Shared code goes first.** Upgrade the design system, publish it, then move each app over one at a time.
- **Pull logic out of the hook.** Spec builders as plain functions are easier to test than anything inside a component.
- **Every bug you fix during a migration deserves a test.** Migrations are when old assumptions break.

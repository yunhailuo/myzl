# Adding A New Game

This guide explains how to add a new playable game mode to `MYZL`.

It is written for both human contributors and coding agents.

## Overview

Adding a new game usually means touching these areas:

1. Create a new view component in `src/views/`
2. Register a new route in `src/router/index.ts`
3. Add a visible entry on the home page in `src/views/HomeView.vue`
4. Add a navigation link in `src/App.vue`
5. Add unit tests and E2E coverage
6. Update docs if the product surface changed

## Current Pattern

The existing game uses this structure:

- View: `src/views/AdditionSubtractionView.vue`
- Route: `/addition-subtraction`
- Home screen link: `src/views/HomeView.vue`
- App menu link: `src/App.vue`
- Unit test: `src/views/AdditionSubtractionView.spec.ts`
- E2E coverage: `e2e/vue.spec.ts`

Use that flow as the baseline for a new game.

## Step 1. Create the new view

Add a new view file in `src/views/`.

Example:

```text
src/views/MultiplicationView.vue
```

Recommended expectations:

- keep the component self-contained at first
- use TypeScript
- prefer local state unless shared state is clearly needed
- keep visible labels easy to test
- if the game has settings or controls, give them stable accessible names

If the game has meaningful logic, also consider adding a matching test file right away:

```text
src/views/MultiplicationView.spec.ts
```

## Step 2. Register the route

Open `src/router/index.ts` and add a new route entry.

Example:

```ts
{
  path: '/multiplication',
  name: 'multiplication',
  component: () => import('../views/MultiplicationView.vue'),
}
```

Notes:

- keep route names simple and stable
- prefer lazy-loaded view imports for game views
- use lowercase kebab-case for paths

## Step 3. Add the game to the home screen

Open `src/views/HomeView.vue` and add the new game to the `games` list.

Current pattern:

```ts
const games = [{ name: '加减法', route: '/addition-subtraction' }]
```

Example update:

```ts
const games = [
  { name: '加减法', route: '/addition-subtraction' },
  { name: '乘法', route: '/multiplication' },
]
```

This controls what users see on the home screen.

## Step 4. Add the game to the app menu

Open `src/App.vue` and add a new `RouterLink` inside the side menu.

Example:

```vue
<RouterLink to="/multiplication" @click="menuOpen = false">乘法</RouterLink>
```

This keeps the menu aligned with the home screen.

## Step 5. Add tests

### Unit tests

Add a unit test file for the new view:

```text
src/views/MultiplicationView.spec.ts
```

Recommended minimum coverage:

- the screen renders
- the main game prompt or UI appears
- main controls work
- any settings toggles work
- core game invariants hold

Examples of invariants:

- generated values stay inside expected bounds
- disabled controls do not trigger behavior
- history or score state updates correctly

### E2E tests

Update `e2e/vue.spec.ts` or add another E2E spec if the flow gets large.

Recommended minimum coverage:

- the new game appears on the home page
- clicking it navigates to the correct route
- the game’s main interaction works once end-to-end

Prefer Playwright queries like:

- `getByRole`
- `getByLabel`
- accessible button and link names

Use `data-testid` only when accessible queries are not enough.

## Step 6. Update documentation

Update docs when a new game changes the product surface.

At minimum, review:

- `README.md`
- `AGENTS.md`

Things to update:

- current experience or supported modes
- roadmap notes if the new game changes direction
- testing notes if the game introduces a new pattern

## Suggested Checklist

Use this before considering the work complete:

```md
- [ ] Added new view in `src/views/`
- [ ] Added route in `src/router/index.ts`
- [ ] Added home screen entry in `src/views/HomeView.vue`
- [ ] Added app menu entry in `src/App.vue`
- [ ] Added or updated unit tests
- [ ] Added or updated E2E tests
- [ ] Updated `README.md`
- [ ] Updated `AGENTS.md` if agent guidance changed
- [ ] Ran `npm run type-check`
- [ ] Ran `npm run lint`
- [ ] Ran `CI=1 npm run test:unit -- --run`
- [ ] Ran `npm run build`
```

## Recommended Next Improvement

Right now the repo repeats game metadata in:

- `src/views/HomeView.vue`
- `src/App.vue`
- `src/router/index.ts`

If you add more games, consider introducing a shared game registry so routes, menus, and home cards stay in sync more easily.

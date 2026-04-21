# AGENTS.md

This document is the agent-facing reference for `/media/yunhai-luo/Life/GitHub/myzl`.

Use it to understand the project quickly, choose the right commands, and make changes that fit the repo's current structure.

## Project Snapshot

- App name: `快问快答`
- Product type: child-friendly arithmetic practice app
- Framework: Vue 3 + TypeScript + Vite
- Routing: Vue Router history mode
- Current game: addition and subtraction practice within `1-19`
- Hosting targets: GitHub Pages and Cloudflare Pages

## What the App Does Today

- Shows a home screen with game selection
- Supports one playable mode: `加减法`
- Generates random addition and subtraction questions
- Keeps question history so users can move backward and forward
- Supports arrow-button navigation
- Supports keyboard arrow navigation
- Supports touch swipe navigation
- Includes a settings drawer for toggling arrows and keyboard/swipe controls

## Key Files

- `src/App.vue`
  Purpose: app shell, slide-out navigation menu, router outlet

- `src/views/HomeView.vue`
  Purpose: home screen with game links

- `src/views/AdditionSubtractionView.vue`
  Purpose: main practice experience, question generation, navigation behavior, settings drawer

- `src/router/index.ts`
  Purpose: application routes

- `src/assets/base.css`
  Purpose: global design tokens and base styles

- `src/assets/main.css`
  Purpose: app-wide layout foundation

- `src/App.spec.ts`
  Purpose: unit tests for app shell behavior

- `src/views/AdditionSubtractionView.spec.ts`
  Purpose: unit tests for arithmetic game behavior

- `e2e/vue.spec.ts`
  Purpose: Playwright smoke coverage for core user flows

- `docs/ADDING_GAME.md`
  Purpose: step-by-step guide for adding a new playable game

## Recommended Workflow

1. Install dependencies.

```bash
npm install
```

2. Start the development server if you need manual verification.

```bash
npm run dev
```

3. Run targeted checks while editing.

```bash
npm run type-check
npm run lint
CI=1 npm run test:unit -- --run
```

4. Run E2E coverage when changing user-visible interactions.

```bash
npm run test:e2e
```

5. Build before wrapping up changes that affect deploy behavior or asset paths.

```bash
npm run build
```

## Command Reference

### Development

- `npm run dev`
  Starts the Vite dev server.

### Builds

- `npm run build`
  Default production build using the current environment.

- `npm run build:gh`
  Production build for GitHub Pages under `/myzl/`.

- `npm run build:root`
  Production build for root-hosted sites such as Cloudflare Pages.

### Validation

- `npm run type-check`
  Runs `vue-tsc --build`.

- `npm run lint`
  Runs ESLint and oxlint.

- `npm run test:unit`
  Runs Vitest in its default mode.

- `CI=1 npm run test:unit -- --run`
  Best command for a non-watch, CI-style unit test run.

- `npm run test:e2e`
  Runs Playwright end-to-end tests.

## Editing Guidance

### When changing gameplay

- Start in `src/views/AdditionSubtractionView.vue`.
- Keep the random question generator behavior easy to test.
- Add or update tests for any behavior changes.
- Prefer small, explicit state changes over deeply nested logic.

### When changing navigation

- Update both:
  - `src/App.vue` for shell navigation
  - `src/views/HomeView.vue` for game discovery if needed

- Verify both unit tests and E2E coverage if the user flow changes.

### When changing styling

- Keep global styles small and intentional.
- Prefer component-scoped styles for view-specific UI.
- Avoid reintroducing starter-template CSS that is not used by the app.

### When adding a new game

- Follow `docs/ADDING_GAME.md` as the default workflow.
- Add the route in `src/router/index.ts`.
- Add a visible entry point in `src/views/HomeView.vue`.
- Update navigation links in `src/App.vue`.
- Add unit and E2E coverage for the new flow.
- Update `README.md` and this file if the product surface changes.

## Testing Expectations

- Behavior changes should include tests.
- Prefer assertions about user-visible behavior rather than internal implementation details.
- Use stable selectors where needed, such as `data-testid`, but favor accessible queries in Playwright.
- If a test depends on current DOM after a UI transition, re-query the DOM instead of reusing stale wrappers.

## Deployment Notes

### GitHub Pages

- Build with `npm run build:gh`.
- Deploy the generated `dist/` folder.
- The expected public base path is `/myzl/`.

### Cloudflare Pages or root-hosted sites

- Build with `npm run build:root`.
- Deploy the generated `dist/` folder.
- The expected public base path is `/`.

## Current Limitations

These are useful to know before changing behavior:

- The app currently shows questions but does not accept or grade answers.
- Settings are not persisted across reloads.
- Game logic still lives inside the main game view component.
- There is only one playable mode today.

## Good Next Improvements

- Add answer reveal or answer entry
- Track correctness and review missed questions
- Persist settings in local storage
- Extract gameplay logic into a composable
- Add configurable difficulty or operation filters

## Agent Checklist Before Finishing

- Run `npm run type-check`
- Run `npm run lint`
- Run `CI=1 npm run test:unit -- --run`
- Run `npm run build` if build behavior may be affected
- Update `README.md` and `AGENTS.md` when workflows or product behavior change

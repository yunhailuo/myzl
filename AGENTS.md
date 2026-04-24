# AGENTS.md

This document is the agent-facing reference for `/media/yunhai-luo/Life/GitHub/myzl`.

Use it to understand the project quickly, choose the right commands, and make changes that fit the repo's current structure.

## Project Snapshot

- App name: `MYZL`
- Product type: child-friendly educational practice app
- Framework: Vue 3 + TypeScript + Vite
- Routing: Vue Router history mode
- Current games: 
  - Addition and subtraction practice (1-19)
  - Chinese character learning (Hanzi recognition and stroke animation)
- Hosting targets: GitHub Pages and Cloudflare Pages

## What the App Does Today

- Shows a home screen with game selection
- Supports two playable modes:
  - **加减法**: Random addition/subtraction questions with navigation history
  - **汉字**: Character learning with pinyin, word examples, and stroke order animation
- Question/character generation with randomization
- Keeps history so users can move backward and forward
- Supports arrow-button navigation
- Supports keyboard arrow navigation
- Supports touch swipe navigation
- Includes settings drawers for toggling UI options and controls
- Settings persist across page reloads via localStorage

## Key Files

- `src/App.vue`
  Purpose: app shell, slide-out navigation menu, router outlet

- `src/views/HomeView.vue`
  Purpose: home screen with game links

- `src/views/AdditionSubtractionView.vue`
  Purpose: arithmetic practice experience, question generation, navigation behavior, settings drawer

- `src/views/HanziView.vue`
  Purpose: Chinese character learning experience, character display, pinyin/word toggles, stroke animation, settings drawer

- `src/router/index.ts`
  Purpose: application routes

- `src/data/games.ts`
  Purpose: game registry and route generation system

- `src/stores/additionSubtraction.ts`
  Purpose: Pinia store for arithmetic game state and logic

- `src/stores/hanzi.ts`
  Purpose: Pinia store for Hanzi game state, character sets, and logic

- `src/data/characters.json`
  Purpose: Chinese character dataset organized by grade levels

- `src/assets/base.css`
  Purpose: global design tokens and base styles

- `src/assets/main.css`
  Purpose: app-wide layout foundation

- `src/App.spec.ts`
  Purpose: unit tests for app shell behavior

- `src/views/AdditionSubtractionView.spec.ts`
  Purpose: unit tests for arithmetic game behavior

- `src/views/HanziView.spec.ts`
  Purpose: unit tests for Hanzi learning behavior

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

- Start in the relevant view component (`AdditionSubtractionView.vue` or `HanziView.vue`).
- Game logic is managed in corresponding Pinia stores (`additionSubtraction.ts` or `hanzi.ts`).
- Keep the random question/character generator behavior easy to test.
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
- Add the game entry to `src/data/games.ts` GAMES_REGISTRY array.
- The system automatically generates routes and adds navigation entries.
- Create the view component in `src/views/` following the naming convention.
- Create a Pinia store in `src/stores/` if the game needs shared/persistent state.
- Add unit and E2E coverage for the new flow.
- Update `README.md` and this file if the product surface changes.

## Testing Expectations

- Behavior changes should include tests.
- Prefer assertions about user-visible behavior rather than internal implementation details.
- Use stable selectors where needed, such as `data-testid`, but favor accessible queries in Playwright.
- If a test depends on current DOM after a UI transition, re-query the DOM instead of reusing stale wrappers.
- Initialize Pinia in unit tests before mounting components that use stores.

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

- The app currently shows questions/characters but does not accept or grade answers.
- There is no correctness tracking or review system for missed questions.
- Game difficulty is not configurable (fixed range for arithmetic).
- No adaptive difficulty based on user performance.

## Good Next Improvements

- Add answer reveal or answer entry for arithmetic practice
- Track correctness and review missed questions
- Add configurable difficulty or operation filters for arithmetic
- Extract reusable navigation logic into composables
- Add more character sets or learning modes for Hanzi
- Implement spaced repetition or progress tracking

## Agent Checklist Before Finishing

- Run `npm run type-check`
- Run `npm run lint`
- Run `CI=1 npm run test:unit -- --run`
- Run `npm run build` if build behavior may be affected
- Update `README.md` and `AGENTS.md` when workflows or product behavior change
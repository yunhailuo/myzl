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
  - Distributive law practice (multiplication distribution)
  - Linear equation solving (term rearrangement)
- Hosting targets: GitHub Pages and Cloudflare Pages

## What the App Does Today

- Shows a home screen with game selection
- Supports four playable modes:
  - **加减法**: Random addition/subtraction questions with navigation history
  - **汉字**: Character learning with pinyin, word examples, and stroke order animation
  - **分配律**: Multiplication distributive law practice with expand/factor problems
  - **一元一次方程**: Linear equation solving with variable term rearrangement
- Question/character generation with randomization
- Keeps history so users can move backward and forward
- Supports arrow-button navigation
- Supports keyboard arrow navigation
- Supports touch swipe navigation
- Includes settings drawers for toggling UI options and controls
- Settings persist across page reloads via localStorage

## Key Files

### Application Core
- `src/App.vue`
  Purpose: app shell, slide-out navigation menu, router outlet

- `src/views/HomeView.vue`
  Purpose: home screen with game links

- `src/router/index.ts`
  Purpose: application routes

- `src/data/games.ts`
  Purpose: game registry and route generation system

### Game Modules
Each game module consists of:
- **View Component** (`src/views/*.vue`): UI presentation and user interaction
- **Pinia Store** (`src/stores/*.ts`): State management and business logic
- **Tests** (`*.spec.ts`): Unit tests for views and stores

#### Addition & Subtraction
- `src/views/AdditionSubtractionView.vue`
- `src/stores/additionSubtraction.ts`

#### Hanzi Learning
- `src/views/HanziView.vue`
- `src/stores/hanzi.ts`
- `src/data/characters.json`: Character dataset organized by grade levels

#### Distributive Law
- `src/views/DistributiveLawView.vue`
- `src/stores/distributiveLaw.ts`

#### Linear Equation
- `src/views/LinearEquationView.vue`
- `src/stores/linearEquation.ts`

### Shared Utilities
- `src/components/GameLayout.vue`
  Purpose: Reusable game layout component with navigation buttons and config panel

- `src/composables/useGameNavigation.ts`
  Purpose: Keyboard and swipe navigation logic

- `src/composables/useQuestionHistory.ts`
  Purpose: Question history stack management

- `src/utils/math.ts`
  Purpose: Math helper functions (random selection, array shuffle, rounding)

- `src/utils/storage.ts`
  Purpose: Safe localStorage wrapper with error handling

### Styling
- `src/assets/base.css`
  Purpose: Global design tokens and base styles

- `src/assets/main.css`
  Purpose: App-wide layout foundation

- `src/assets/game-layout.css`
  Purpose: Shared game component styles

### Testing
- `src/App.spec.ts`
  Purpose: Unit tests for app shell behavior

- `src/views/*.spec.ts`
  Purpose: Unit tests for game view components

- `src/stores/*.spec.ts`
  Purpose: Unit tests for Pinia stores

- `src/utils/*.spec.ts`
  Purpose: Unit tests for utility functions

- `src/composables/*.spec.ts`
  Purpose: Unit tests for composables

- `src/data/*.spec.ts`
  Purpose: Unit tests for data utilities

- `e2e/vue.spec.ts`
  Purpose: Playwright smoke coverage for core user flows

- `docs/ADDING_GAME.md`
  Purpose: Step-by-step guide for adding a new playable game

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

- `CI=1 npm run test:unit -- --run --coverage`
  Run unit tests with coverage report. Target: >90% statement coverage.

- `npm run test:e2e`
  Runs Playwright end-to-end tests.

## Editing Guidance

### When changing gameplay

- Start in the relevant view component and Pinia store.
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
- Use `src/assets/game-layout.css` for shared game component styles.
- Avoid reintroducing starter-template CSS that is not used by the app.

### When adding a new game

- Follow `docs/ADDING_GAME.md` as the default workflow.
- Add the game entry to `src/data/games.ts` GAMES_REGISTRY array.
- The system automatically generates routes and adds navigation entries.
- Create the view component in `src/views/` following the naming convention.
- Create a Pinia store in `src/stores/` if the game needs shared/persistent state.
- Add unit tests for:
  - Store logic (state initialization, actions, getters)
  - View rendering and user interactions
  - Any new utility functions or composables
- Add E2E coverage for the new flow.
- Update `README.md` and this file if the product surface changes.

### When modifying shared utilities

- Update corresponding test files in `src/utils/*.spec.ts` or `src/composables/*.spec.ts`.
- Ensure all dependent modules still pass their tests.
- Consider backward compatibility if the utility is widely used.

## Testing Expectations

### Coverage Targets
- **Statement coverage**: >90%
- **Branch coverage**: >85%
- **Function coverage**: >90%

### Test Quality Guidelines
- Behavior changes should include tests.
- Prefer assertions about user-visible behavior rather than internal implementation details.
- Use stable selectors where needed, such as `data-testid`, but favor accessible queries in Playwright.
- If a test depends on current DOM after a UI transition, re-query the DOM instead of reusing stale wrappers.
- Initialize Pinia in unit tests before mounting components that use stores.

### Test Organization
- **Store tests**: Focus on state management, business logic, and edge cases.
- **View tests**: Focus on rendering, user interactions, and integration with stores.
- **Utility tests**: Cover both normal operation and error handling paths.
- **Composable tests**: Test pure logic without relying on Vue lifecycle hooks.
- **E2E tests**: Cover critical user journeys and cross-component workflows.

### What NOT to Test
- Pure CSS styling (visual regression is better suited for E2E).
- Third-party library internals (assume they work as documented).
- Trivial getters or passthrough functions without logic.
- Generated code or auto-generated files.

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
- Game difficulty is partially configurable (arithmetic has fixed range, others have settings).
- No adaptive difficulty based on user performance.
- No progress tracking or achievement system.

## Good Next Improvements

- Add answer reveal or answer entry for arithmetic practice
- Track correctness and review missed questions
- Add configurable difficulty or operation filters for arithmetic
- Implement spaced repetition or progress tracking
- Add more character sets or learning modes for Hanzi
- Add hints or step-by-step solutions for distributive law and equations
- Export/import progress data

## Agent Checklist Before Finishing

- Run `npm run type-check`
- Run `npm run lint`
- Run `CI=1 npm run test:unit -- --run`
- Check coverage with `CI=1 npm run test:unit -- --run --coverage` (target: >90%)
- Run `npm run build` if build behavior may be affected
- Update `README.md` and `AGENTS.md` when workflows or product behavior change
- Ensure new features have corresponding unit tests
- Verify E2E tests still pass for modified user flows

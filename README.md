# Personal App

An personal application built with Vue 3 and Vite. The current experience focuses on features with large-card presentation, touch-friendly navigation, and deployment targets that work well for static hosting.

## Current Experience

- Home screen with game selection
- Addition and subtraction flash-card style practice
- Previous and next question history
- Keyboard arrow navigation
- Swipe navigation on touch devices
- Settings drawer for arrow buttons and gesture/keyboard controls
- Static hosting support for both GitHub Pages and root-hosted sites

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Vitest
- Playwright
- ESLint, oxlint, and Prettier

## Project Structure

```text
.
├── src/
│   ├── assets/
│   │   ├── base.css
│   │   └── main.css
│   ├── composables/
│   │   ├── useGameNavigation.ts
│   │   └── useQuestionHistory.ts
│   ├── data/
│   │   ├── characters.json
│   │   └── games.ts
│   ├── router/
│   │   └── index.ts
│   ├── stores/
│   │   ├── additionSubtraction.ts
│   │   ├── distributiveLaw.ts
│   │   ├── hanzi.ts
│   │   └── linearEquation.ts
│   ├── test/
│   │   ├── factories.ts          # Test data generators
│   │   └── performance.spec.ts   # Performance benchmarks
│   ├── utils/
│   │   ├── math.ts
│   │   └── storage.ts
│   ├── views/
│   │   ├── AdditionSubtractionView.vue
│   │   ├── DistributiveLawView.vue
│   │   ├── HanziView.vue
│   │   ├── HomeView.vue
│   │   └── LinearEquationView.vue
│   ├── App.vue
│   └── main.ts
├── e2e/
│   └── vue.spec.ts
├── docs/
│   ├── ADDING_GAME.md                    # How to add new games
│   ├── REVIEW.md                         # Repository review & backlog
│   ├── TEST_OPTIMIZATION.md              # Testing optimization process
│   ├── TESTING_PATTERNS.md               # Testing best practices
│   └── TESTING_ENHANCEMENT_SUMMARY.md    # Enhancement summary
├── AGENTS.md
├── playwright.config.ts
├── vite.config.ts
└── package.json
```

## Getting Started

### Install

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

### Build commands

```bash
# Default build
npm run build

# GitHub Pages build under /myzl/
npm run build:gh

# Root-hosted build for Cloudflare Pages or custom domains
npm run build:root
```

## Quality Checks

```bash
# TypeScript and Vue SFC types
npm run type-check

# ESLint + oxlint
npm run lint

# Unit tests
npm run test:unit

# Unit tests with coverage report
npm run test:unit -- --coverage

# CI-friendly unit test run
CI=1 npm run test:unit -- --run
```

### End-to-end tests

```bash
# Install Playwright browsers the first time
npx playwright install

# Start the dev server automatically and run tests
npm run test:e2e

# Run only Chromium
npm run test:e2e -- --project=chromium
```

### Test Coverage

Current coverage targets:

- **Utils**: 100% (must cover all error paths)
- **Stores**: >85% (focus on business logic)
- **Views**: >90% (focus on user interactions)
- **Composables**: >90% (focus on core logic)
- **Overall**: >90% statement coverage

Run `npm run test:unit -- --coverage` to check current coverage. See [TESTING_PATTERNS.md](./docs/TESTING_PATTERNS.md) for testing best practices and examples.

## Deployment

### GitHub Pages

This repo includes `.github/workflows/deploy.yml`, which builds with:

```bash
npm run build:gh
```

Use this when the app is hosted at:

```text
https://<username>.github.io/myzl/
```

### Cloudflare Pages or root hosting

Build with:

```bash
npm run build:root
```

Deploy the generated `dist/` folder.

## Notes for Contributors

- `src/views/AdditionSubtractionView.vue` contains the main game behavior.
- `generateQuestion()` is the current question generator.
- Behavior changes should include tests.
- Use test data factories from `src/test/factories.ts` for consistent test data.
- Follow testing patterns documented in [docs/TESTING_PATTERNS.md](./docs/TESTING_PATTERNS.md).
- `AGENTS.md` contains agent-oriented instructions and project conventions.
- `docs/ADDING_GAME.md` explains the step-by-step workflow for adding a new playable game.
- `docs/REVIEW.md` tracks the current review findings and backlog.
- `docs/TEST_OPTIMIZATION.md` documents the testing optimization process and standards.
- `docs/TESTING_ENHANCEMENT_SUMMARY.md` provides a complete summary of testing improvements.

## Roadmap Ideas

### Gameplay Features
- Add answer reveal or answer input flow
- Track correct and incorrect responses
- Add review mode for missed questions
- Add adaptive difficulty
- Persist settings and progress locally

### Testing Enhancements
- Implement mutation testing with Stryker Mutator
- Expand E2E coverage for complete game flows
- Add integration tests for store-view interactions
- Set up performance monitoring in CI

See [docs/TESTING_ENHANCEMENT_SUMMARY.md](./docs/TESTING_ENHANCEMENT_SUMMARY.md) for detailed next steps.

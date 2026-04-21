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
│   ├── router/
│   │   └── index.ts
│   ├── views/
│   │   ├── AdditionSubtractionView.vue
│   │   ├── AdditionSubtractionView.spec.ts
│   │   ├── HomeView.vue
│   │   └── HomeView.spec.ts
│   ├── App.spec.ts
│   ├── App.vue
│   └── main.ts
├── e2e/
│   └── vue.spec.ts
├── AGENTS.md
├── docs/
│   ├── ADDING_GAME.md
│   └── REVIEW.md
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
- `AGENTS.md` contains agent-oriented instructions and project conventions.
- `docs/ADDING_GAME.md` explains the step-by-step workflow for adding a new playable game.
- `docs/REVIEW.md` tracks the current review findings and backlog.

## Roadmap Ideas

- Add answer reveal or answer input flow
- Track correct and incorrect responses
- Add review mode for missed questions
- Add adaptive difficulty
- Persist settings and progress locally

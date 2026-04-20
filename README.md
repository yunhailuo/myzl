# Personal App

An personal application built with Vue 3 and Vite.

## Features

- **Responsive Design**: Works seamlessly on PC and mobile devices
- **Intuitive Navigation**: Kindle-style sidebar navigation with arrow keys, swipe, and touch support
- **Extensible Architecture**: Easy to add new games and features
- **Modern Stack**: Vue 3 with TypeScript, Vite for fast development
- **CI/CD Ready**: GitHub Actions workflow included

## Current Games

- **Addition & Subtraction**: Practice arithmetic within 1-19 with:
  - Flash card style questions
  - Multiple navigation methods: left/right arrows, keyboard (arrow keys), swipe gestures
  - Question history tracking
  - Progress counter
  - Settings panel with options to toggle arrows and navigation methods
  - Config panel with gear icon and close button (X)

## AI Documentation

- This repo includes dedicated AI guidance in [AGENTS.md](AGENTS.md).
- The app is structured for future AI enhancements like adaptive question generation, personalized hints, and agent-driven tutoring.

## Development

### Setup

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Build for GitHub Pages

```bash
npm run build:gh
```

### Build for a root-hosted site (Cloudflare Pages or root domain)

```bash
npm run build:root
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

### Unit Tests

```bash
npm run test:unit
```

### E2E Tests (requires build)

```bash
npm run build
npm run test:e2e
```

## Deployment

### GitHub Pages

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that publishes `dist/` to GitHub Pages on every push to `main`.

The workflow uses `npm run build:gh`, so the site is built with the repository base path before deployment.

### Cloudflare Pages

Cloudflare Pages is not automatically configured by this repository yet, but the app is ready for Cloudflare deployment.

- For a root-hosted Cloudflare Pages site, use `npm run build:root`
- For a GitHub Pages-style subpath site, use `npm run build:gh`

To deploy on Cloudflare Pages:

1. Connect the repo to Cloudflare Pages
2. Set build command to `npm run build`
3. Set output directory to `dist`
4. Deploy

If you want GitHub Actions to also trigger Cloudflare Pages deployments, you can add a separate workflow with Cloudflare Pages Action and the required secrets.

## Project Structure

```
src/
├── views/              # Page components
│   ├── HomeView.vue    # Game selection screen
│   └── AdditionSubtractionView.vue # Game view
├── App.vue            # Root component with navigation
├── main.ts            # Application entry point
├── router/            # Vue Router configuration
└── assets/            # Styles and static files
```

## Technologies

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next generation build tool
- **Vue Router** - Client-side routing
- **Pinia** - State management (prepared for future use)
- **Vitest** - Unit testing framework
- **Playwright** - E2E testing framework
- **ESLint & Prettier** - Code quality and formatting

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

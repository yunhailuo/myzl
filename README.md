# 快问快答 (Quick Q&A) - Educational Games App

An educational games application designed for learning arithmetic, built with Vue 3 and Vite.

## Features

- **Responsive Design**: Works seamlessly on PC and mobile devices
- **Intuitive Navigation**: Kindle-style sidebar navigation with arrow keys, swipe, and touch support
- **Extensible Architecture**: Easy to add new games and features
- **Modern Stack**: Vue 3 with TypeScript, Vite for fast development
- **CI/CD Ready**: GitHub Actions workflow included

## Current Games

- **加减法 (Addition & Subtraction)**: Practice arithmetic within 1-19 with:
  - Flash card style questions
  - Multiple navigation methods: left/right arrows, keyboard (arrow keys), swipe gestures
  - Question history tracking
  - Progress counter

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

1. Push to GitHub repository named `myzl`
2. Go to repository settings > Pages
3. Set source to "Deploy from a branch", branch "main", folder "/ (root)"
4. Available at `https://<username>.github.io/myzl/`

### Cloudflare Pages

1. Connect repository to Cloudflare Pages
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Deploy

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

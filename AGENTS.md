# AGENTS.md

This file is for coding agents and tools. It contains build, test, deploy, and project conventions that should be easy for an AI assistant to follow.

## Project overview

- App: 快问快答
- Framework: Vue 3 + TypeScript + Vite
- Main feature: 加减法 practice game within 1-19
- Deployment targets: GitHub Pages and Cloudflare Pages

## Recommended workflow

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for GitHub Pages:
   ```bash
   npm run build:gh
   ```
4. Build for root site hosting:
   ```bash
   npm run build:root
   ```
5. Run unit tests:
   ```bash
   npm run test:unit
   ```
6. Run E2E tests:
   ```bash
   npm run build
   npm run test:e2e
   ```

## Build commands

- `npm run build:gh` — build with `VITE_BASE_URL=/myzl/` for GitHub Pages repos hosted under `/myzl/`
- `npm run build:root` — build with `VITE_BASE_URL=/` for root-hosted sites like Cloudflare Pages or root domains
- `npm run build` — default build using the current environment

## Test commands

- `npm run test:unit` — runs Vitest unit tests
- `npm run test:e2e` — runs Playwright end-to-end tests
- `npm run type-check` — validates TypeScript and Vue SFC types
- `npm run lint` — runs ESLint and oxlint checks

## Project layout

- `src/App.vue` — root layout and navigation
- `src/views/HomeView.vue` — home screen and game selection
- `src/views/AdditionSubtractionView.vue` — main addition/subtraction game view
- `src/router/index.ts` — client-side routes
- `vite.config.ts` — build configuration with dynamic base URL support

## Agent guidance

### AI-friendly entry points

- `src/views/AdditionSubtractionView.vue` contains the current gameplay and question generation logic.
- `generateQuestion()` is the main function responsible for random math questions.
- The app already supports keyboard arrows, swipe gestures, and visible navigation controls.

### Good next improvements for agents

- Add adaptive difficulty based on user answers and response time.
- Add AI-powered hints or short explanations for each question.
- Add a review mode that explains correct answers.
- Add analytics or state tracking for user progress.

### What agents should know

- The repository is intentionally small and self-contained.
- The app uses Vue Router history mode, so static hosting should serve `index.html` for client-side routes.
- `AGENTS.md` is the canonical place for commands, conventions, and instructions for coding agents.

## Code conventions

- Commit messages should follow Conventional Commits.
- Use TypeScript and strict type checking.
- Keep state minimal and prefer local view state unless adding a shared store.
- Add tests for any behavior changes.

## Deployment notes

### GitHub Pages

- Use `npm run build:gh` to compile for `https://<username>.github.io/myzl/`.
- Ensure branch `main` is selected in GitHub Pages settings with root folder `/`.

### Cloudflare Pages or root hosting

- Use `npm run build:root` if deploying to a root domain or root site.
- Deploy the `dist/` folder.

## References

- `https://agents.md/` — agent-friendly documentation format
- `AGENTS.md` is useful for any coding agent, including VS Code AI tools, GitHub Copilot assistants, and CLI agents

# AGENTS.md

This document is the **table of contents** for `/media/yunhai-luo/Life/GitHub/myzl`.

For detailed information, follow the links below. This file should remain under ~100 lines.

## Quick Start

```bash
npm install
npm run dev
```

See [Task Guides](docs/guides/index.md) for complete workflows.

## Documentation Map

### Task Guides (Start Here)

- **[Adding New Games](docs/guides/add-new-game.md)**: Complete workflow for new game modules
- **[Batch Generation](docs/guides/batch-generate.md)**: How to use batch question generation
- **[Writing Tests](docs/references/testing-patterns.md)**: Testing strategy and patterns
- **[Development Standards](docs/references/development-standards.md)**: Code style and conventions
- **[Code Quality Checklist](docs/references/code-quality.md)**: Pre-submission requirements

### Reference Documentation

- **[Architecture Details](docs/references/architecture-detailed.md)**: System architecture and patterns
- **[Testing Strategy](docs/references/testing-strategy.md)**: When and how to test
- **[Design System](docs/references/design-system.md)**: Language policy and UI guidelines
- **[Documentation Guidelines](docs/references/documentation-guidelines.md)**: How to maintain docs

### Module Specifications

- **[Module Specs Index](docs/specs/index.md)**: Individual game module documentation

### Architecture Decisions

- **[Decision Log](docs/decisions/index.md)**: Why we made key architectural choices

### Quality & Plans

- **[Quality Score](docs/quality.md)**: Current quality grades by domain
- **[Technical Debt](docs/plans/tech-debt-tracker.md)**: Known debt and remediation plans
- **[Agent Enablement](docs/references/agent-enablement.md)**: Local verification and bundle inspection workflow

## Project Snapshot

- **Framework**: Vue 3 + TypeScript + Vite
- **State Management**: Pinia with persisted state
- **Current Games**: Addition/Subtraction, Hanzi, Distributive Law, Linear Equation
- **Testing**: Vitest (unit), Playwright (E2E)
- **Coverage Target**: >90% overall

## Essential Commands

### Development

```bash
npm run dev              # Start dev server
npm run type-check       # Type checking
npm run lint             # Linting
```

### Testing

**Important**:

- Vitest runs in watch mode by default. Use `--run` flag for one-time execution.
- Playwright test runs in one-time mode by default (no watch mode).
- **For agents**: Always use `--reporter=list` with Playwright to disable HTML report server.

```bash
# Unit tests - one-time run (no watch mode)
npm run test:unit -- --run

# Unit tests with coverage
npm run test:unit -- --run --coverage

# Unit tests - CI mode (recommended for agents)
CI=1 npm run test:unit -- --run --coverage

# E2E tests (Playwright - one-time run by default)
# IMPORTANT: Use --reporter=list to disable HTML report server
npm run test:e2e -- --reporter=list

# E2E tests - specific project
npm run test:e2e -- --project=chromium --reporter=list

# E2E tests - CI mode (recommended for agents)
CI=1 npm run test:e2e -- --project=chromium --reporter=list
```

**Note**:

- For Vitest: The `--run` flag or `CI=1` environment variable ensures tests run in non-watch mode.
- For Playwright: Tests always run in one-time mode. Use `--reporter=list` to prevent HTML report server from starting. The `CI=1` environment variable is still recommended for automated testing.

### Build

```bash
npm run build            # Production build
npm run build:gh         # GitHub Pages build
npm run build:root       # Root-hosted build
```

## Key Principles

1. **Language Policy**: Chinese UI, English code/docs/commits
2. **Testing Strategy**: Incremental during dev, full before user feedback, CI before commit
3. **Code Quality**: Simplify before commit, balance pattern extraction
4. **Documentation**: Keep current, link to code for details, avoid duplication

For complete guidelines, see linked documents above.

## Repository Structure

```
src/
├── views/          # Page-level components
├── stores/         # Pinia stores
├── components/     # Reusable UI components
├── composables/    # Reusable logic
├── utils/          # Pure helper functions
├── data/           # Static data sources
└── router/         # Route configuration
```

See [Architecture Details](docs/references/architecture-detailed.md) for complete structure.

## Agent Checklist Before Finishing

See [Code Quality Checklist](docs/references/code-quality.md) for complete requirements.

- Run `npm run type-check`
- Run `npm run lint`
- Run `CI=1 npm run test:unit -- --run --coverage` (target: >90%)
- Run `npm run test:e2e`
- **Review documentation**: If code behavior changed, update relevant docs per [Documentation Guidelines](docs/references/documentation-guidelines.md)

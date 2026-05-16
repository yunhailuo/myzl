# Agent Enablement

This reference document describes the local verification workflow intended for agents and maintainers. It is not a product-facing feature; it is a development harness for reliable change validation.

## Local verification scripts

- `npm run agent:verify`
  - Runs type checking, linting, unit tests, and a targeted Playwright E2E pass on Chromium.
  - Designed for a fast, repeatable local validation flow for repository changes.

- `npm run inspect:bundle`
  - Builds the app and prints a bundle size report from `dist/`.
  - Helps agents and maintainers inspect size changes after code or dependency updates.

## Acceptance criteria

- The repository has a clear local verification command that runs multiple quality checks in one pass.
- Bundle size output is easy to inspect after a build.
- Documentation links to these commands from agent-facing guidance and the repository overview.
- The app remains free of user-facing AI runtime behavior; this workflow is for development and verification only.

## Usage

```bash
npm run agent:verify
npm run inspect:bundle
```

## Example inspect bundle output

```text
Bundle size report for dist/
------------------------------------
Files: 33
Total size: 905.44 KB
------------------------------------
Top files by size:
  631.52 KB  assets/cnchar.words.min-Buzvm5AX.js
   94.40 KB  favicon.png
   60.62 KB  assets/runtime-core.esm-bundler-BSbF-A03.js
   24.21 KB  assets/vue-router-BlZ-agay.js
   16.26 KB  assets/HanziView--Eq945r2.js
```

## Notes

- `npm run agent:verify` bundles several validation steps into one command. It is intended as a verification pass, not a speedy quick-check. The Playwright Chromium test is the longest part.
- If you need faster iteration, run `npm run type-check`, `npm run lint`, or `npm run test:unit` individually.
- Use `npm run dev` for normal local development.
- Use `npm run dev:cf` only when verifying Cloudflare-specific runtime behavior.
- The `agent:verify` script is intentionally conservative: it uses the same unit test and E2E commands already used elsewhere in the repo.
- The `inspect:bundle` report is especially useful for identifying large optional chunks (for example, `cnchar.words.min`) and confirming that heavy learning data is kept out of the initial app load via lazy-loaded route components.

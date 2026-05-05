# Plan: Agentic Learning Upgrade

**Status**: Proposed
**Created**: 2026-05-05
**Priority**: High
**Owner**: Project maintainers

## Objective

Upgrade MYZL's development harness so AI agents can safely understand, test, and improve the repository without adding user-facing AI features yet. The near-term goal is deterministic validation, clearer documentation, and stronger feedback loops. Adaptive learning and in-app AI tutoring remain long-term product options, not the current focus.

This plan follows the direction described in OpenAI's [Harness Engineering](https://openai.com/index/harness-engineering/) article: humans steer, agents execute, and the repository becomes the system of record for product intent, constraints, evaluation, and quality feedback.

## Current State

- Game modules intentionally generate fresh random prompts for learners.
- Problem generators call `Math.random()` directly, which is fine for production play but makes E2E tests, debugging, and agent validation difficult to reproduce.
- Unit tests pass, but coverage is below the project target: latest local run reported 83.2% statement coverage against a >90% goal.
- E2E tests run, but recent verification produced 56 passing tests and 4 Chromium failures caused by non-deterministic state, persisted settings, and Hanzi canvas assumptions.
- Documentation is structured for progressive disclosure, but agent-facing verification priorities and long-term product options need clearer separation.

## Target State

- Production learners continue to get real random practice by default.
- Tests, debug sessions, batch output, and shareable reproduction cases can opt into seeded generation.
- E2E tests clear persisted state and avoid assertions that depend on uncontrolled randomness.
- Agent workflows can boot the app, run deterministic journeys, inspect screenshots/DOM state, and validate changes reliably.
- Documentation distinguishes near-term agent enablement from future product ideas such as adaptive learning or in-app AI tutoring.
- Privacy and child-safety boundaries are documented before any online or user-facing AI feature is enabled.

## Review Recommendations Snapshot

These are the nine high-leverage recommendations from the 2026-05-05 repository review, preserved here so the original review signal remains visible as the plan evolves.

1. **Make problem generation deterministic and explainable.**
   Keep real randomness in production by default, but allow tests, batch/debug flows, and reproduction links to pass an optional seeded RNG. This enables reproducible validation without making learner practice feel deterministic.

2. **Modernize E2E testing.**
   Clear persisted state per test, seed randomness, avoid assertions that depend on random text changing, and make Hanzi canvas checks wait on app-level ready signals. Add ARIA snapshots and visual snapshots where they improve agent-legible validation.

3. **Separate app dev from deployment runtime.**
   Keep `vite` for pure app development and tests. Make Cloudflare runtime integration opt-in or separately verified so deployment tooling does not destabilize local unit/E2E workflows.

4. **Make docs truthful and enforceable.**
   Align README/docs with real files and CI behavior. If docs say coverage thresholds are enforced, CI should enforce them; otherwise the docs should say they are targets.

5. **Improve bundle architecture for learning-data scale.**
   Keep heavy optional learning data lazy-loaded, add bundle analysis, and use scalable module/data loading patterns as dictionaries and generated content grow.

6. **Raise accessibility incrementally.**
   Start with low-cost improvements: Chinese accessible names, route focus reset, a skip link, basic dialog semantics for settings/batch dialogs, and focus return on close. Full focus traps, reduced-motion polish, and exhaustive audits can follow later.

7. **Use a human-centered AI policy before shipping AI.**
   Future gate for product AI, not a current implementation task. Before any user-facing AI ships, define privacy, age-appropriateness, no unsupervised freeform chat by default, and local-first progress where possible.

8. **Add AI as a bounded teacher.**
   Future app/game option, not current product scope. In the near term, AI should help development workflows: documentation maintenance, test generation, question-quality review, and planning. No user-facing AI components are planned now.

9. **Turn the app from flashcards into a learning system.**
   Long-term product option, deprioritized for now. Answer entry/reveal, correctness tracking, missed-question review, adaptive difficulty, and spaced repetition could be valuable later, but they are not the next focus.

**Strongest near-term recommendation**: Start with seeded generation for tests/debugging, E2E state isolation, and an agent verification harness. This preserves production randomness while making the repository much easier for humans and agents to validate.

## Upgrade Tracks

### 1. Deterministic Validation

- [ ] Keep production problem generation random by default.
- [ ] Add RNG helper APIs that support optional seeds.
- [ ] Allow tests, batch generation, and debug/reproduction flows to pass seeded RNG.
- [ ] Add seeded generation tests for current math stores.
- [ ] Document which flows use real randomness and which may use seeded randomness.

### 2. E2E Reliability

- [ ] Clear persisted state before each E2E test.
- [ ] Avoid assertions that require two random prompts to differ.
- [ ] Add app-level ready signals for Hanzi Writer instead of depending only on raw `canvas` timing.
- [ ] Add focused ARIA snapshots for stable layout and navigation structure.
- [ ] Add visual snapshots only for high-value, low-volatility screens.

### 3. Agent Enablement

- [ ] Add a local "agent verify" script that runs type-check, lint, unit tests, and targeted E2E checks.
- [ ] Add bundle-size/performance checks that agents can inspect after changes.
- [ ] Capture acceptance criteria in docs before large feature work.
- [ ] Keep AGENTS.md as a table of contents and put detailed guidance in linked docs.
- [ ] Add doc-gardening tasks for stale links, stale coverage claims, and obsolete examples.

### 4. Low-Cost Accessibility

- [ ] Use Chinese accessible names for user-facing buttons and controls.
- [ ] Add route focus reset.
- [ ] Add a skip link to main content.
- [ ] Add basic dialog semantics to settings and batch dialogs.
- [ ] Return focus to the triggering control when panels/dialogs close.
- [ ] Defer full focus traps and broader audits until there is capacity.

### 5. Future Product Options

- [ ] Add answer entry and answer reveal flows for math games.
- [ ] Track correctness, attempts, response time, and confidence.
- [ ] Add missed-question review mode.
- [ ] Add adaptive difficulty based on recent performance.
- [ ] Add spaced repetition for Hanzi and repeatable math concepts.
- [ ] Consider AI-generated worksheets, hints, or voice tutoring only after explicit product approval.
- [ ] Document privacy, learner age assumptions, and safety boundaries before any user-facing AI feature.

## Recommended Sequence

1. Seeded generation support for tests/debugging while preserving production randomness.
2. E2E persisted-state isolation and less brittle random/canvas assertions.
3. Agent verification script for common local checks.
4. Documentation truthfulness pass for coverage, CI, and stale links.
5. Low-cost accessibility improvements.
6. Bundle/performance visibility.
7. Future learning-system or user-facing AI features only after explicit product decision.

## Execution Plans

Each plan below is written as a bounded handoff packet for a human or subagent. Subagents should keep changes scoped to the listed files unless the investigation discovers a direct dependency.

### 1. Deterministic Generation

**Goal**: Keep production randomness, but make tests, debug sessions, and batch/reproduction flows seedable.

**Scope**:
- `src/utils/`
- `src/stores/*`
- Store unit tests
- Relevant module docs/specs if generator contracts change

**Implementation Steps**:
- Add a tiny RNG utility that exposes a `RandomSource` function type and a seeded implementation.
- Update math problem generators to accept an optional RNG parameter that defaults to `Math.random`.
- Keep store runtime behavior unchanged by not passing a seed in normal production paths.
- Update batch/test helpers to allow seeded generation where useful.
- Add unit tests proving that the same seed produces the same sequence and different seeds can produce different sequences.
- Add generator invariant tests for range constraints so seeded tests catch real logic regressions.

**Acceptance Criteria**:
- Normal game screens still generate fresh random prompts without extra configuration.
- At least one math module has reproducible seeded generator tests.
- Existing unit tests pass.
- Docs explain that seeded randomness is for tests/debugging, not the default learner experience.

**Suggested Handoff Prompt**:

```text
Implement deterministic generation support without changing production randomness. Add a small RNG utility, update one math store generator to accept optional RNG with Math.random as default, and add tests proving seeded reproducibility and existing range invariants. Keep changes scoped to src/utils, the selected store, and its tests.
```

### 2. E2E Reliability

**Goal**: Make E2E tests deterministic enough for agents to trust them.

**Scope**:
- `e2e/`
- `playwright.config.ts`
- Minimal app changes only if needed for stable test hooks

**Implementation Steps**:
- Add shared E2E setup that clears local storage/session storage before each test.
- Replace assertions that require random prompts to differ with assertions based on navigation/history behavior.
- Add stable selectors or app-level readiness markers for Hanzi Writer rendering.
- Keep cross-browser projects, but reduce flake-prone expectations.
- Add one focused accessibility/structure assertion only after the baseline suite is stable.

**Acceptance Criteria**:
- `npm run test:e2e -- --project=chromium` passes locally.
- Tests no longer depend on uncontrolled random values being different.
- Hanzi tests wait for an app-level ready state rather than only waiting for a raw `canvas`.
- Persisted settings from one test cannot affect another test.

**Suggested Handoff Prompt**:

```text
Stabilize Playwright tests. Clear persisted browser state before each test, remove random-difference assumptions, and add a stable Hanzi Writer ready signal or selector. Keep app changes minimal and only for test-observable readiness.
```

### 3. App Dev vs Deployment Runtime

**Goal**: Keep local app development and tests independent from deployment-runtime tooling.

**Scope**:
- `vite.config.ts`
- `package.json`
- `playwright.config.ts`
- Deployment docs if commands change

**Implementation Steps**:
- Preserve `npm run dev` as pure Vite app development.
- Keep Cloudflare-specific dev behind an explicit command/env flag.
- Ensure unit tests do not initialize Cloudflare runtime plugins.
- Ensure Playwright web server uses the pure Vite command unless a Cloudflare-specific test is intentionally added.
- Document when to use normal dev versus Cloudflare dev/preview.

**Acceptance Criteria**:
- `npm run dev` starts without Cloudflare runtime requirements.
- `npm run test:unit -- --run` does not initialize Cloudflare plugin behavior.
- `npm run test:e2e` starts the normal Vite dev server.
- Cloudflare-specific local workflow remains available through an explicit command.

**Suggested Handoff Prompt**:

```text
Audit and finish the separation between normal Vite development and Cloudflare runtime development. Verify package scripts, Vite plugin gating, and Playwright webServer behavior. Update docs if command usage is unclear.
```

### 4. Documentation Truthfulness

**Goal**: Make docs match the current repository, especially CI, coverage, and file paths.

**Scope**:
- `README.md`
- `AGENTS.md`
- `docs/`
- `.github/workflows/`

**Implementation Steps**:
- Check all referenced docs and file paths for stale names or missing files.
- Compare documented quality gates with actual CI behavior.
- Either add enforcement where docs claim enforcement, or change docs to say "target" instead of "enforced".
- Add a short doc maintenance checklist for stale links, commands, and coverage claims.
- Avoid duplicating implementation details that should stay in code.

**Acceptance Criteria**:
- No docs link to missing files.
- Coverage docs accurately distinguish enforced gates from project goals.
- README and AGENTS.md point to the same current guide structure.
- Documentation remains progressive: short entry points, detail in linked docs.

**Suggested Handoff Prompt**:

```text
Do a documentation truthfulness pass. Verify README, AGENTS.md, docs indexes, quality docs, and CI workflow claims. Fix stale paths and align coverage/CI language with actual behavior. Do not add broad new content beyond correcting truthfulness and navigation.
```

### 5. Bundle Architecture

**Goal**: Give humans and agents visibility into bundle growth before adding more learning data or AI-related code.

**Scope**:
- `vite.config.ts`
- `package.json`
- Optional new bundle report tooling
- Performance docs

**Implementation Steps**:
- Add a repeatable bundle inspection command.
- Document current heavy chunks, especially optional Hanzi/dictionary data.
- Confirm heavy learning data remains route-lazy where practical.
- Add a lightweight bundle budget or report artifact only if it fits current CI cost.
- Avoid premature refactors until measurements show a concrete issue.

**Acceptance Criteria**:
- A developer or agent can run one command to inspect bundle output.
- Docs identify known heavy chunks and why they are acceptable or need watching.
- No user-facing behavior changes.
- Any added tooling is optional or low-cost for local development.

**Suggested Handoff Prompt**:

```text
Add bundle visibility without broad optimization. Provide a command or documented workflow to inspect Vite output, identify current heavy lazy chunks, and document when bundle growth should trigger action.
```

### 6. Incremental Accessibility

**Goal**: Improve baseline accessibility without a broad UI redesign.

**Scope**:
- `src/App.vue`
- `src/components/GameLayout.vue`
- Affected view tests
- Minimal CSS for skip link/focus states

**Implementation Steps**:
- Use Chinese accessible names for user-facing controls.
- Add a skip link to main content.
- Reset focus on route changes or provide a stable main-content focus target.
- Add basic dialog semantics for settings and batch dialogs.
- Return focus to the triggering control when closing panels/dialogs.
- Defer full focus trapping unless it is small and low-risk.

**Acceptance Criteria**:
- Keyboard users can reach main content and return from dialogs/panels predictably.
- User-facing accessible labels are Chinese where appropriate.
- Existing unit and E2E tests pass or are updated for changed accessible names.
- No major layout redesign.

**Suggested Handoff Prompt**:

```text
Implement the low-cost accessibility pass only. Add Chinese accessible names, skip link/main focus behavior, basic dialog semantics, and focus return for settings/batch UI. Avoid broad visual redesign or full accessibility audit work.
```

### 7. AI Policy Gate

**Goal**: Define the gate that must be passed before user-facing AI is added.

**Scope**:
- `docs/references/`
- `docs/plans/agentic-learning-upgrade.md`
- No app code

**Implementation Steps**:
- Create a short AI safety/privacy policy reference.
- State that no user-facing AI is currently planned.
- Define required decisions before AI ships: learner age, data retention, API-key boundary, parent/teacher review, and refusal/safety behavior.
- Link the policy from this plan and the docs index.
- Keep policy practical and short.

**Acceptance Criteria**:
- Future agents can see that AI app/game features are blocked until explicit product approval.
- The policy names minimum privacy and safety decisions.
- No runtime AI dependency or UI component is introduced.

**Suggested Handoff Prompt**:

```text
Create a concise docs-only AI policy gate. It should say user-facing AI is not current scope and list the required privacy/safety/product decisions before any AI feature can be implemented. Do not add app code or dependencies.
```

### 8. Development-Only AI Assistance

**Goal**: Use AI to help maintain and improve the repo without adding AI to the app.

**Scope**:
- `docs/guides/`
- `docs/references/`
- Optional prompt templates or checklists

**Implementation Steps**:
- Document approved AI-assisted development use cases: doc gardening, test drafting, question-quality review, module planning, and code review checklists.
- Document non-goals: no runtime AI, no learner chat, no API keys in client code.
- Add a short checklist for reviewing AI-generated code or content before merging.
- Link this from agent-facing docs.

**Acceptance Criteria**:
- Agents have clear allowed AI-development workflows.
- Human review remains required for generated code/content.
- No app/game behavior changes.

**Suggested Handoff Prompt**:

```text
Document development-only AI assistance workflows. Keep it docs-only: allowed uses, non-goals, review checklist, and links from agent-facing docs. Do not add runtime AI features or dependencies.
```

### 9. Future Learning System

**Goal**: Preserve the long-term product idea without letting it drive near-term work.

**Scope**:
- `docs/plans/`
- Optional future module specs
- No app code unless explicitly approved later

**Implementation Steps**:
- Keep learning-system work listed as future scope.
- If needed, create a separate future plan for answer entry, correctness tracking, missed review, and adaptive practice.
- Define a decision point before implementation: target learner, desired workflow, data to store, and success metric.
- Do not start implementation until the product direction changes.

**Acceptance Criteria**:
- The idea is documented but clearly deprioritized.
- Future agents do not treat adaptive learning as the current task.
- No current app/game UI changes.

**Suggested Handoff Prompt**:

```text
Create or refine a future-only learning-system plan. Keep it explicitly deprioritized and docs-only. Define product decision questions but do not implement answer tracking, adaptive learning, or spaced repetition.
```

## Research Notes

- [Harness Engineering](https://openai.com/index/harness-engineering/) emphasizes repository-local knowledge, agent legibility, mechanical enforcement, and feedback loops.
- [Vue performance guidance](https://vuejs.org/guide/best-practices/performance) recommends lazy route loading, bundle-size awareness, and measuring actual performance.
- [Vite glob imports](https://vite.dev/guide/features.html#glob-import) can support scalable module/data loading when game content grows.
- [Playwright ARIA snapshots](https://playwright.dev/docs/aria-snapshots) and [visual comparisons](https://playwright.dev/docs/test-snapshots) can make UI behavior more inspectable by agents.
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) can make AI-generated learning content type-safe and easier to validate.
- [OpenAI realtime model guidance](https://developers.openai.com/api/docs/guides/realtime-models-prompting) is relevant for future voice tutoring, not the first AI milestone.
- [UNESCO guidance on generative AI in education](https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research) emphasizes human-centered, ethical, safe, and meaningful educational use.

## Success Criteria

- Production practice remains random by default.
- The same test/debug flow can be run with a fixed seed and produces reproducible output.
- E2E tests clear persisted state and pass consistently across configured browsers.
- Agent verification is documented and runnable locally.
- Documentation clearly labels user-facing AI and adaptive learning as future options, not current scope.
- Low-cost accessibility improvements are implemented without a broad UI redesign.

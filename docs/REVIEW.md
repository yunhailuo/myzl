# Repo Review

## Scope

This review reflects the current repository state in `/media/yunhai-luo/Life/GitHub/myzl` after the recent testing, styling, and documentation cleanup.

It is meant to be a living review document: part snapshot, part prioritized backlog.

## Verification Performed

```bash
npm run type-check
npm run lint
CI=1 npm run test:unit -- --run
npm run build
```

Results:

- `type-check`: passed
- `lint`: passed
- `unit tests`: passed
- `build`: passed

Note:

- End-to-end tests were not re-run as part of this update.

---

## Executive Summary

The repo is in a noticeably stronger state than the earlier review:

- tests are more behavior-focused
- docs are more accurate and repo-specific
- starter-template CSS residue has been cleaned up
- unused Pinia setup has been removed

The main gaps are now less about baseline hygiene and more about product depth and accessibility:

- answer/check/review gameplay is still missing
- drawer accessibility is still basic
- gameplay logic is still tightly coupled to the view
- settings and progress are not persisted

---

## What Improved Since The Earlier Review

### Testing

- Unit tests now cover more realistic behavior in `AdditionSubtractionView`:
  - keyboard navigation
  - swipe navigation
  - disabled navigation behavior
  - drawer open/close behavior
  - subtraction safety invariant

- `App.vue` tests were cleaned up to avoid stale-wrapper interactions.

- Playwright smoke tests were updated to use more user-centric flows and accessible queries.

### Starter-template cleanup

- Unused Pinia runtime setup was removed from `src/main.ts`.
- Global CSS was rewritten to be app-specific rather than inherited from the Vue starter template.
- README content is now product-specific instead of mixed with scaffold leftovers.

### Documentation

- `README.md` now better matches the app’s real structure and workflow.
- `AGENTS.md` is much more useful for coding agents and future contributors.

---

## Current Strengths

### 1. Small, understandable structure

The project is still easy to navigate and easy to extend carefully.

Helpful entry points:

- `src/views/AdditionSubtractionView.vue`
- `src/views/HomeView.vue`
- `src/App.vue`
- `src/router/index.ts`

### 2. Better test confidence

The repo now has stronger coverage for actual user behavior, not just basic rendering. That is a meaningful quality jump for a project of this size.

### 3. Clear deployment model

The split between:

- `npm run build:gh`
- `npm run build:root`

is still a strong design choice for static hosting flexibility.

### 4. Better documentation hygiene

The repo now explains itself more clearly to both humans and agents, which will pay off as the project grows.

---

## Remaining Findings

## 1. Drawer and menu accessibility still need another pass

**Severity:** Medium

### What I found

The slide-out menu and settings drawer are usable, but they still behave more like custom panels than fully accessible dialogs.

Still-missing or weak areas:

- no `aria-expanded` on the toggle buttons
- no `aria-controls` relationship between toggles and panels
- no Escape-to-close behavior
- no focus management when a panel opens or closes

### Why this matters

The app is visually clear, but keyboard-only and assistive-technology users will still get a weaker experience than mouse/touch users.

### Improvement

For both the app menu and settings drawer:

- add `aria-expanded`
- add `aria-controls`
- support `Escape`
- move focus into the panel when opened
- restore focus to the trigger when closed
- consider `role="dialog"` and `aria-modal="true"` if the panel is meant to temporarily own interaction

---

## 2. Global input handling is still broad

**Severity:** Medium

### What I found

Keyboard and touch listeners in `AdditionSubtractionView.vue` are still attached to `document`.

### Why this matters

Even though tests are better now, the behavior remains broad:

- arrow keys can still affect the game from anywhere in the mounted document
- swipe handling is still page-wide rather than scoped to the question surface
- future interactive controls could conflict with these listeners

### Improvement

Prefer one of these approaches:

- scope keyboard behavior to the game container
- scope touch behavior to the question area
- disable navigation while overlays or drawers are open

---

## 3. The app still lacks an answer loop

**Severity:** Medium

### What I found

The product still presents questions without an answer interaction model.

What is missing:

- entering an answer
- revealing an answer
- checking correctness
- tracking errors
- reviewing mistakes

### Why this matters

This is still the biggest product gap. Without answer handling, the app behaves more like a question browser than a learning/practice tool.

### Improvement

Strong next steps:

- add “show answer” as the smallest useful increment
- or add a simple answer input + check flow
- track correct/incorrect outcomes
- add review mode after answer tracking exists

---

## 4. Gameplay logic is still tightly coupled to the view

**Severity:** Medium

### What I found

Question generation, history management, navigation logic, and gesture handling still live inside `AdditionSubtractionView.vue`.

### Why this matters

This will slow down future features such as:

- adaptive difficulty
- progress tracking
- persistence
- review mode
- answer checking

### Improvement

Extract the game state into a composable, for example:

```ts
useAdditionSubtractionGame()
```

Potential responsibilities:

- question generation
- question history
- next/previous movement
- answer state
- scoring or review queue
- persistence hooks

---

## 5. Question generation is correct, but still not configurable

**Severity:** Low to Medium

### What I found

The current generator correctly:

- randomizes `+` and `-`
- keeps values inside `1-19`
- avoids negative subtraction results

But it is still fixed to one behavior.

### Why this matters

Once you want any of the following, the current setup will feel limiting:

- addition-only mode
- subtraction-only mode
- smaller ranges
- difficulty presets
- reduced repetition

### Improvement

Introduce a generation config model, for example:

```ts
type GameConfig = {
  operations: Array<'+' | '-'>
  min: number
  max: number
  avoidRecent: boolean
  difficulty: 'easy' | 'medium' | 'hard'
}
```

---

## 6. Settings and progress are not persisted

**Severity:** Low to Medium

### What I found

Settings still reset on reload:

- arrow visibility
- keyboard/swipe enablement

There is also no saved session or learning progress.

### Why this matters

Persistence would make the app feel much more finished for repeated use, especially for a child-focused practice tool.

### Improvement

Save lightweight state to `localStorage`:

- settings
- recent mode
- optional streak or completion counters

---

## 7. The product architecture is still single-mode

**Severity:** Low

### What I found

The app is structured around one playable mode, and route/menu metadata is still fairly manual.

### Why this matters

This is fine today, but expansion will be easier if game definitions become centralized.

### Improvement

Create a small shared game registry and use it for:

- route metadata
- home screen cards
- app navigation links
- future descriptions or difficulty labels

---

## 8. Review notes that are now resolved

These were earlier concerns that have improved enough to remove from the active findings list:

- misleading checkbox test in `AdditionSubtractionView.spec.ts`
- brittle stale-wrapper interaction in `App.spec.ts`
- generic Vue starter CSS residue in global styles
- outdated and template-heavy README content
- weak agent-facing documentation
- unused Pinia runtime setup

---

## Prioritized Next Steps

### High value

1. Improve accessibility for both drawers.
2. Add a real answer/check/reveal loop.
3. Scope or tame global keyboard and touch listeners.

### Medium value

4. Extract gameplay logic into a composable.
5. Persist settings and simple progress locally.
6. Add configurable generation settings or difficulty presets.

### Nice to have

7. Introduce a game registry for future expansion.
8. Add richer E2E coverage once product interactions deepen.

---

## Suggested Backlog

```md
# Improvement Backlog

## Accessibility
- Add `aria-expanded` and `aria-controls` to the app menu and settings drawer triggers.
- Support closing drawers with `Escape`.
- Move focus into opened panels and restore it on close.
- Consider `role="dialog"` and `aria-modal="true"` for temporary interaction panels.

## Gameplay
- Add answer reveal or answer input flow.
- Track correct and incorrect responses.
- Add review mode for missed questions.
- Add configurable difficulty or operation filters.

## Architecture
- Extract arithmetic game state into a composable such as `useAdditionSubtractionGame`.
- Move question generation into a pure module with configuration support.
- Add local persistence for settings and progress.
- Consider a shared game registry for routes and menus.

## Testing
- Expand E2E coverage after answer interaction is added.
- Add tests for any new accessibility keyboard behaviors.
- Keep favoring behavior-level assertions over implementation-level tests.
```

---

## Final Take

The repo is in a healthier place now. The earlier “foundational cleanup” work is mostly done, and the next phase is clearly about turning a clean prototype into a stronger learning product.

If the goal is to maximize value from the next development pass, the best sequence is:

1. accessibility pass on the drawers
2. answer/check/review loop
3. gameplay-state extraction for future growth

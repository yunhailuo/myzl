# Technical Debt Tracker

Known technical debt items and remediation plans. Updated regularly as debt is addressed or new items are identified.

## Active Debt Items

### 1. Module Specification Documentation

**Severity**: Medium  
**Impact**: New developers lack detailed module-specific guidance  
**Effort**: 2-3 hours per module  

**Description**: Individual game modules need detailed specification documents in `docs/specs/`.

**Remediation Plan**:
- [ ] Create `addition-subtraction.md` spec
- [ ] Create `hanzi.md` spec
- [ ] Create `distributive-law.md` spec
- [ ] Create `linear-equation.md` spec

**Target Completion**: 2026-05-17

---

### 2. Historical Architecture Decisions

**Severity**: Low  
**Impact**: Context for past decisions not captured  
**Effort**: 1 hour per decision  

**Description**: Key architectural decisions made before ADR system was established should be documented retroactively.

**Remediation Plan**:
- [ ] Document initial project setup decision
- [ ] Document Vue 3 + Vite selection rationale
- [ ] Document Pinia over Vuex decision
- [ ] Document test framework choices

**Target Completion**: 2026-05-31

---

### 3. Performance Benchmarking

**Severity**: Medium  
**Impact**: No baseline metrics for performance regression detection  
**Effort**: 4-6 hours  

**Description**: Need to establish performance baselines and automated benchmarking.

**Remediation Plan**:
- [ ] Define key performance metrics (startup time, question generation speed, etc.)
- [ ] Create performance test suite
- [ ] Set up automated benchmarking in CI
- [ ] Document performance budgets

**Target Completion**: 2026-06-15

---

### 4. Advanced Task Guides

**Severity**: Low  
**Impact**: Complex scenarios not covered in guides  
**Effort**: 1-2 hours per guide  

**Description**: Current task guides cover basics but lack advanced scenarios.

**Remediation Plan**:
- [ ] Add "Migrating Store State" guide
- [ ] Add "Refactoring Composables" guide
- [ ] Add "Optimizing Bundle Size" guide
- [ ] Add "Debugging Production Issues" guide

**Target Completion**: 2026-06-30

---

## Completed Debt Items

### ~~5. Documentation Restructuring~~ ✅

**Completed**: 2026-05-03  
**Effort Spent**: 3 hours  

**Description**: Reorganized documentation following Harness Engineering principles for AI agent efficiency.

**Outcome**: 
- AGENTS.md reduced to ~100 lines (table of contents)
- Structured docs/ directory with progressive disclosure
- Task guides separated from reference documentation
- Added quality tracking and decision records

---

## Debt Categories

### Documentation Debt
- Missing specifications
- Outdated examples
- Broken links
- Incomplete guides

### Code Debt
- Duplicated logic
- Missing type annotations
- Inconsistent patterns
- Temporary workarounds

### Test Debt
- Low coverage areas
- Missing edge cases
- Flaky tests
- Untested error paths

### Infrastructure Debt
- Manual deployment steps
- Missing automation
- Outdated dependencies
- Inefficient CI pipelines

## How to Add New Debt Items

1. Identify the debt during development or code review
2. Assess severity and impact
3. Estimate remediation effort
4. Add to this tracker under "Active Debt Items"
5. Create remediation plan with tasks
6. Set target completion date
7. Track progress in [plans/active/](plans/active/) if complex

## Review Cadence

- **Weekly**: Review active items during team sync
- **Monthly**: Update progress and reprioritize
- **Quarterly**: Comprehensive debt audit and planning

## Related Resources

- **[Quality Score](quality.md)**: Quality metrics that reveal debt
- **[Architecture Decisions](decisions/)**: Decisions that may create debt
- **[Execution Plans](plans/)**: Detailed remediation plans

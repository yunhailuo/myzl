# Quality Requirements

This document defines the quality standards and targets for this project. For current coverage reports, check CI outputs or run tests locally.

## Coverage Targets

All coverage targets are enforced by CI. See [Testing Strategy](references/testing-strategy.md) for details.

| Scope | Target | Enforcement |
|-------|--------|-------------|
| **Utils** | 100% | CI blocks merge if below |
| **Stores** | >85% | CI warning if below |
| **Views** | >90% | CI warning if below |
| **Composables** | >90% | CI warning if below |
| **Overall** | >90% | Project goal |

## How to Check Current Coverage

### Local Development
```bash
# Run tests with coverage
npm run test:unit -- --coverage

# View HTML report
open coverage/index.html
```

### CI Reports
Coverage reports are generated on every PR:
- Check GitHub Actions workflow output
- Coverage summary appears in PR checks
- Detailed reports available as artifacts

## Code Quality Standards

### Required (Enforced by Linters)
- ✅ TypeScript strict mode
- ✅ ESLint rules pass
- ✅ No console.log in production code
- ✅ All imports use `@/` alias

### Recommended (Code Review)
- ✅ Functions < 50 lines
- ✅ Components < 300 lines
- ✅ Clear variable/function names
- ✅ Comments for complex logic

## Testing Standards

See [Testing Patterns](references/testing-patterns.md) for detailed guidelines.

### Must Have
- Unit tests for all utils (100% coverage)
- Store action/getter tests (>85% coverage)
- View component tests (>90% coverage)
- E2E tests for critical user journeys

### Should Have
- Edge case coverage
- Error path testing
- Accessibility tests
- Performance benchmarks

## Documentation Quality

### Current State
Documentation follows progressive disclosure model:
- AGENTS.md: ~100 lines (table of contents)
- Task guides in `docs/guides/`
- Reference docs in `docs/references/`
- Module specs in `docs/specs/` (TODO: create)

### Maintenance
- Docs updated when behavior changes
- Links validated quarterly
- Stale content removed promptly

See [Documentation Guidelines](references/documentation-guidelines.md) for maintenance practices.

## Technical Debt Management

Known issues tracked in [tech-debt-tracker.md](plans/tech-debt-tracker.md).

### Current Priorities
1. Create individual module specification files
2. Document historical architecture decisions as ADRs
3. Add performance benchmarking infrastructure

## Review Cadence

- **Every PR**: Coverage checked by CI
- **Monthly**: Review technical debt tracker
- **Quarterly**: Audit documentation freshness
- **Per Release**: Update quality targets if needed

## Related Resources

- **[Testing Strategy](references/testing-strategy.md)**: When and how to test
- **[Testing Patterns](references/testing-patterns.md)**: Detailed testing techniques
- **[Technical Debt Tracker](plans/tech-debt-tracker.md)**: Known issues and plans
- **[Documentation Guidelines](references/documentation-guidelines.md)**: How to maintain docs

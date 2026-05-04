# Code Quality & Review Checklist

## Pre-Submission Checklist

Before considering a task complete and ready for user feedback, ensure:

### Code Quality
- [ ] Code follows project style guidelines
- [ ] No duplicate or redundant code introduced
- [ ] Comments are in English and explain "why" not "what"
- [ ] Variable/function names are descriptive and consistent

### Testing Strategy

**During Development:**
- Run only affected unit tests for quick feedback when modifying specific functionality
- This balances development speed with immediate validation

**Before Submitting to User (AI Agent Completion):**
When the AI agent completes a modification and is ready to return to the user for feedback, run the **full test suite**:
```bash
npm run type-check
npm run lint
CI=1 npm run test:unit -- --run --coverage
npm run test:e2e
```

This ensures quality before user review.

**Before Git Commit:**
Must pass all CI checks as defined in `.github/workflows/ci.yml`:
- ✅ Lint (`npm run lint`)
- ✅ Type Check (`npm run type-check`)
- ✅ Build (`npm run build`)
- ✅ Unit Tests with Coverage (`npm run test:unit -- --coverage`)
- ✅ E2E Tests (`npm run test:e2e`)
- ✅ **Documentation Review**: Verify docs are up-to-date with code changes

See [CI Configuration](../.github/workflows/ci.yml) for details.

### Coverage Requirements
- Utils: 100%
- Stores: >85%
- Views/Composables: >90%
- Overall statement coverage: >90%

### Documentation Review

**Before completing a task and before Git commit:**

1. **Assess Impact**: Does the code change affect user-facing behavior, introduce new patterns/APIs, or modify existing functionality? If yes → update docs.

2. **Update Relevant Docs**:
   - User-facing changes → `README.md` + feature guides
   - New patterns/APIs → reference docs + examples
   - Architecture changes → architecture docs
   - See [Documentation Guidelines](./documentation-guidelines.md) for detailed workflow

3. **Verify Quality**: Examples work, links valid, no contradictions, language policy followed (English docs/code, Chinese UI).

See [Documentation Guidelines](./documentation-guidelines.md) for complete maintenance strategy and decision tree.

## Common Code Review Points

### Performance Considerations
- Avoid unnecessary re-renders in Vue components
- Use computed properties instead of methods for derived state
- Lazy load routes and heavy components

### Security Considerations
- Never expose sensitive data in client-side code
- Validate all user inputs (even from trusted sources)
- Use safe localStorage wrapper from `src/utils/storage.ts`

### Accessibility
- Ensure keyboard navigation works for all interactive elements
- Provide focus management for modals and dynamic content
- Use semantic HTML elements where possible

<!-- TODO: Add performance benchmarks if available -->
<!-- TODO: Add security checklist if handling sensitive operations -->

## Anti-Patterns to Avoid

### In Tests
- ❌ Conditional assertions (`if/else` wrapping `expect`)
- ❌ Hard-coded waits (`page.waitForTimeout()`)
- ❌ Testing implementation details instead of behavior

### In Components
- ❌ Deeply nested conditional logic
- ❌ Mixing business logic with presentation
- ❌ Ignoring TypeScript warnings with `@ts-ignore`

### In State Management
- ❌ Direct state mutation outside mutations/actions
- ❌ Storing derived/computed data in state
- ❌ Over-using global state for local component data

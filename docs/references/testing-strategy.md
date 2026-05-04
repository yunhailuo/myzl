# Testing Strategy

## Testing Workflow

### Incremental Testing (During Development)

When modifying specific functionality:
1. Run only the affected unit tests for quick feedback
2. Fix issues iteratively
3. This approach balances development speed with immediate validation

**Example:**
```bash
# Test only the modified store
npm run test:unit -- stores/additionSubtraction.spec.ts

# Test only the modified view
npm run test:unit -- views/AdditionSubtractionView.spec.ts
```

### Full Testing (Before User Feedback)

When the AI agent completes a task and is ready to return to the user for feedback, run the **complete test suite**:

```bash
npm run type-check
npm run lint
CI=1 npm run test:unit -- --run --coverage
npm run test:e2e
```

This ensures all changes work correctly together before user review.

### CI Testing (Before Git Commit)

Before committing to Git, all CI checks must pass as defined in [`.github/workflows/ci.yml`](../.github/workflows/ci.yml):

1. **Lint**: `npm run lint`
2. **Type Check**: `npm run type-check`
3. **Build**: `npm run build`
4. **Unit Tests with Coverage**: `npm run test:unit -- --coverage`
5. **E2E Tests**: `npm run test:e2e`

## When to Add or Modify Tests

Follow these guidelines to determine when tests need to be added or updated:

### Must Add Tests

**Always add tests when:**

1. **New Features**
   - New game modules
   - New utility functions
   - New composables
   - New store actions/getters

2. **Bug Fixes**
   - Write a test that reproduces the bug first (regression test)
   - Ensure the test passes after the fix
   - This prevents the bug from reappearing

3. **Behavior Changes**
   - Modified business logic
   - Changed calculation algorithms
   - Updated validation rules
   - Altered user interactions

4. **New Code Paths**
   - Added conditional branches (`if/else`, `switch`)
   - New error handling paths
   - Additional edge cases

### Should Update Tests

**Update existing tests when:**

1. **Function Signature Changes**
   - Modified parameters
   - Changed return types
   - Renamed functions

2. **Dependency Changes**
   - New dependencies added
   - Existing dependencies removed
   - Mock strategies need adjustment

3. **Configuration Updates**
   - Changed default values
   - Modified validation ranges
   - Updated constants

### May Skip Tests

**Tests may not be necessary for:**

1. **Pure Refactoring**
   - Code restructuring without behavior change
   - Variable renaming
   - Code formatting improvements
   - *Exception*: If refactoring is complex, add tests to verify behavior preservation

2. **Documentation Only**
   - Comment updates
   - README changes
   - JSDoc improvements

3. **Trivial Changes**
   - Whitespace adjustments
   - Import order changes
   - Non-functional metadata updates

### Test Efficiency Guidelines

**Avoid Redundant Testing:**

1. **Don't Test Trivial Getters/Setters**
   ```typescript
   // ❌ Unnecessary
   it('should return name', () => {
     expect(obj.name).toBe('test')
   })
   
   // ✅ Better: Test meaningful behavior
   it('should validate name format', () => {
     expect(validateName('')).toBe(false)
   })
   ```

2. **Don't Duplicate Integration Tests**
   - If store actions are tested in unit tests
   - And view integration is tested separately
   - Don't repeat the same assertions in both

3. **Use Parameterized Tests for Similar Cases**
   ```typescript
   // ❌ Repetitive
   it('adds 1 + 2', () => { /* ... */ })
   it('adds 3 + 4', () => { /* ... */ })
   
   // ✅ Efficient
   it.each([
     [1, 2, 3],
     [3, 4, 7],
     [0, 0, 0]
   ])('adds %i + %i = %i', (a, b, expected) => {
     expect(add(a, b)).toBe(expected)
   })
   ```

4. **Test at the Right Level**
   - Unit tests: Individual functions, isolated logic
   - Integration tests: Component-store interaction
   - E2E tests: Complete user flows
   - Don't test implementation details at higher levels

**Maximize Test Reuse:**

1. **Use Test Factories**
   - Centralize test data creation
   - See [Testing Patterns](./testing-patterns.md#test-data-factories)

2. **Create Shared Test Helpers**
   - Common setup functions
   - Reusable assertions
   - Helper matchers

3. **Leverage beforeEach/afterEach**
   - Shared initialization
   - Cleanup logic
   - State reset

## Testing Standards

Follow established testing best practices from:
- [Vitest Best Practices](https://vitest.dev/guide/testing-types.html)
- [Vue Test Utils Guide](https://test-utils.vuejs.org/guide/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

### Key Principles

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Use user-visible selectors when possible

2. **No Conditional Assertions**
   - Split test cases instead of using `if/else` with `expect`
   - Ensure deterministic paths through data setup

3. **Defensive Programming in Tests**
   - Use optional chaining (`?.`) when accessing potentially uninitialized objects

4. **Isolation**
   - Each test should be independent
   - Clean up state between tests

## Coverage Requirements

| Module Type | Target Coverage |
|------------|----------------|
| Utils      | 100%           |
| Stores     | >85%           |
| Views      | >90%           |
| Composables| >90%           |
| **Overall**| **>90%**       |

Run coverage check:
```bash
CI=1 npm run test:unit -- --run --coverage
```

## Test Organization

### Unit Tests (`*.spec.ts`)
- **Store tests**: State management, business logic, edge cases
- **View tests**: Rendering, user interactions, store integration
- **Utility tests**: Normal operation and error handling
- **Composable tests**: Pure logic without Vue lifecycle dependencies

### E2E Tests (`e2e/*.spec.ts`)
- Critical user journeys
- Cross-component workflows
- Mobile/touch interactions
- Keyboard navigation
- Settings persistence

See [Testing Patterns](./testing-patterns.md) for detailed examples and patterns.

<!-- TODO: Add mutation testing guidelines reference -->
<!-- TODO: Add visual regression testing guidelines if implemented -->

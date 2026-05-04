# Testing Patterns and Best Practices

This document provides practical examples and patterns for writing effective tests in the MYZL project.

## Table of Contents

- [Test Data Factories](#test-data-factories)
- [Performance Testing](#performance-testing)
- [Mutation Testing](#mutation-testing)
- [Common Test Patterns](#common-test-patterns)

---

## Test Data Factories

Use test data factories from `src/test/factories.ts` to create consistent, reusable test data.

### Why Use Factories?

- **Consistency**: Same data generation logic across all tests
- **Maintainability**: Change data structure in one place
- **Readability**: Clear intent with descriptive factory functions
- **DRY**: Avoid duplicating test data creation logic

### Examples

#### Arithmetic Questions

```typescript
import { generateArithmeticQuestion, generateUniqueQuestions } from '@/test/factories'

// Single question
const question = generateArithmeticQuestion(['+'])
expect(question.op).toBe('+')

// Multiple unique questions
const questions = generateUniqueQuestions(10, ['+', '-'])
expect(questions).toHaveLength(10)
```

#### Hanzi Characters

```typescript
import { createMockCharacter, generateMockCharacters } from '@/test/factories'

// Single character
const char = createMockCharacter('汉', 'hàn')
expect(char.char).toBe('汉')
expect(char.pinyin).toBe('hàn')

// Multiple characters
const characters = generateMockCharacters(5)
expect(characters).toHaveLength(5)
```

#### Distributive Law Problems

```typescript
import { createDistributiveProblem } from '@/test/factories'

// Expand type: a × (b ± c)
const expandProblem = createDistributiveProblem({ type: 'expand' })
expect(expandProblem).toContain('(')

// Factor type: a×b ± a×c
const factorProblem = createDistributiveProblem({ type: 'factor' })
expect(factorProblem).not.toContain('(')
```

#### Linear Equations

```typescript
import { createLinearEquation } from '@/test/factories'

const equation = createLinearEquation({ variable: 'y' })
expect(equation).toContain('y')
expect(equation).toContain('=')
```

### Creating Custom Factories

When adding new game modules, create corresponding factories:

```typescript
// src/test/factories.ts
export function createPinyinQuestion(): PinyinQuestion {
  return {
    char: '汉',
    pinyin: 'hàn',
    options: ['hàn', 'hán', 'hǎn', 'hàn'],
    correctIndex: 0,
  }
}
```

---

## Performance Testing

Performance tests ensure critical operations remain fast as the codebase grows.

### Question Generation Performance

```typescript
import { describe, it, expect } from 'vitest'
import { generateArithmeticQuestion } from '@/test/factories'

describe('Performance', () => {
  it('should generate questions quickly', () => {
    const iterations = 10000
    const start = performance.now()

    for (let i = 0; i < iterations; i++) {
      generateArithmeticQuestion()
    }

    const duration = performance.now() - start
    
    // Should complete in under 100ms
    expect(duration).toBeLessThan(100)
  })
})
```

### Memory Usage Testing

```typescript
it('should not leak memory during repeated operations', () => {
  const initialMemory = process.memoryUsage().heapUsed

  // Perform many operations
  for (let i = 0; i < 50000; i++) {
    generateArithmeticQuestion()
  }

  // Force garbage collection if available
  if (global.gc) {
    global.gc()
  }

  const finalMemory = process.memoryUsage().heapUsed
  const increase = finalMemory - initialMemory

  // Memory increase should be reasonable (< 10MB)
  expect(increase).toBeLessThan(10 * 1024 * 1024)
})
```

### Running Performance Tests

Performance tests run with regular unit tests:

```bash
npm run test:unit -- --run
```

Monitor console output for timing information.

### Performance Budgets

Set acceptable thresholds:

| Operation | Threshold | Purpose |
|-----------|-----------|---------|
| Generate 10k arithmetic questions | < 100ms | Fast question generation |
| Generate 5k distributive problems | < 100ms | Efficient complex calculations |
| Generate 5k linear equations | < 100ms | Quick equation creation |
| Memory increase (50k ops) | < 10MB | No memory leaks |

---

## Mutation Testing

Mutation testing verifies that your tests actually catch bugs by introducing small changes ("mutations") to the code.

### Setup (Future Enhancement)

Consider adding Stryker Mutator:

```bash
npm install --save-dev @stryker-mutator/core @stryker-mutator/vitest-runner
```

### Example Mutation

Original code:
```typescript
function isValidSubtraction(num1: number, num2: number): boolean {
  return num1 >= num2  // Ensures non-negative result
}
```

Mutated code (changed `>=` to `>`):
```typescript
function isValidSubtraction(num1: number, num2: number): boolean {
  return num1 > num2  // Mutation: now rejects equal values
}
```

Good test should catch this:
```typescript
it('should allow equal values in subtraction', () => {
  expect(isValidSubtraction(5, 5)).toBe(true)  // Catches the mutation
})
```

### Benefits

- Identifies weak or missing tests
- Measures test effectiveness beyond coverage
- Finds edge cases you might have missed

---

## Common Test Patterns

### AAA Pattern (Arrange-Act-Assert)

```typescript
it('should navigate to next question', () => {
  // Arrange
  const store = useAdditionSubtractionStore()
  const initialCount = store.count

  // Act
  store.nextQuestion()

  // Assert
  expect(store.count).toBe(initialCount + 1)
})
```

### Test Independence

Each test should be isolated:

```typescript
beforeEach(() => {
  setActivePinia(createPinia())  // Fresh state for each test
})

it('test 1', () => {
  // Independent of other tests
})

it('test 2', () => {
  // Also independent, starts fresh
})
```

### Edge Cases

Test boundaries and error conditions:

```typescript
describe('edge cases', () => {
  it('should handle empty input gracefully', () => {
    // Test empty/undefined/null scenarios
  })

  it('should handle maximum values', () => {
    // Test upper bounds
  })

  it('should handle minimum values', () => {
    // Test lower bounds
  })

  it('should recover from errors', () => {
    // Test error handling paths
  })
})
```

### Mocking Strategy

**Do mock:**
- External APIs (localStorage, third-party libraries)
- Complex side effects
- Network requests

**Don't mock:**
- Business logic under test
- Simple utility functions
- Pure functions

Example:
```typescript
// Good: Mock external dependency
vi.mock('hanzi-writer', () => ({
  default: {
    create: vi.fn(() => ({ /* mock methods */ }))
  }
}))

// Bad: Don't mock business logic
// The actual question generation should run
```

### Behavior Over Implementation

Test what users see, not internal details:

```typescript
// Good: Tests user-visible behavior
it('displays the next question', async () => {
  await wrapper.find('.nav-btn.right').trigger('click')
  expect(wrapper.find('.counter').text()).toContain('第 2 题')
})

// Bad: Tests implementation details
it('calls nextQuestion method', () => {
  const spy = vi.spyOn(store, 'nextQuestion')
  // This couples test to implementation
})
```

### Accessibility Testing

Include accessibility assertions:

```typescript
it('has proper ARIA labels', () => {
  const button = wrapper.find('.nav-btn')
  expect(button.attributes('aria-label')).toBe('Next')
})

it('manages focus correctly', async () => {
  await wrapper.find('.config-btn').trigger('click')
  // Verify focus moved to config panel
})
```

---

## Testing Checklist

Before submitting code:

- [ ] Unit tests added for new features
- [ ] Edge cases covered (empty, null, boundaries)
- [ ] Error paths tested
- [ ] Accessibility assertions included
- [ ] Tests use factories for test data
- [ ] No implementation-specific assertions
- [ ] Performance tests for critical paths
- [ ] All tests pass: `npm run test:unit -- --run`
- [ ] Coverage maintained: `npm run test:unit -- --run --coverage`

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Testing](https://playwright.dev/docs/intro)
- [Testing Library Principles](https://testing-library.com/docs/guiding-principles/)
- [Stryker Mutation Testing](https://stryker-mutator.io/)

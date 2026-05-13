# Deterministic Generation Guide

This document explains how to use deterministic problem generation for tests, debugging, and other programmatic reproduction cases.

## Overview

All math problem generators now support optional seeded random number generation (RNG). This allows:

- **Production**: Real randomness by default (using `Math.random()`)
- **Testing/Debugging**: Reproducible sequences using seeded RNG
- **Programmatic generation**: Reproducible problem sets when a seed is passed explicitly

## API

### RandomSource Type

```typescript
type RandomSource = () => number
```

A function that returns random numbers in the range [0, 1).

### createSeededRNG

```typescript
import { createSeededRNG } from '../utils/math'

const rng = createSeededRNG(42) // Seed can be any integer
```

Creates a deterministic RNG using a Linear Congruential Generator (LCG). The same seed always produces the same sequence.

## Usage Examples

### Production Code (Default Behavior)

No changes needed - generators use `Math.random()` by default:

```typescript
import { generateProblem } from '../stores/additionSubtraction'

// Real random problem
const problem = generateProblem(10, 50, 1, 20)
```

### Testing with Seeded RNG

```typescript
import { createSeededRNG } from '../utils/math'
import { generateProblem } from '../stores/additionSubtraction'

const rng = createSeededRNG(42)
const problem = generateProblem(10, 50, 1, 20, true, true, 0, rng)
```

### Programmatic Generation with Reproducible Results

```typescript
import { createSeededRNG } from '../utils/math'

const seed = 12345
const rng = createSeededRNG(seed)
const problems = []

for (let i = 0; i < 20; i++) {
  problems.push(generateProblem(10, 50, 1, 20, true, true, 0, rng))
}

// Store seed with problems for reproducibility
console.log(`Seed: ${seed}`)
console.log(problems)
```

The current batch UI does not expose a seed option. Seeded generation is available through the generator APIs and can support future share/export workflows.

## Module-Specific Signatures

### Addition/Subtraction

```typescript
generateProblem(
  sumMin: number = 2,
  sumMax: number = 20,
  partMin: number = 1,
  partMax: number = 10,
  enableAddition: boolean = true,
  enableSubtraction: boolean = true,
  decimalPlaces: number = 0,
  rng: RandomSource = Math.random
): string
```

### Distributive Law

```typescript
generateProblem(
  maxPower: number = 3,
  decimalPlaces: number = 1,
  enableTrap: boolean = false,
  enableSwap: boolean = false,
  rng: RandomSource = Math.random
): string
```

### Linear Equation

```typescript
generateProblem(
  maxTerms: number = 8,
  rng: RandomSource = Math.random
): string
```

## Testing Patterns

All math stores include tests for:

1. **Reproducibility**: Same seed → same sequence
2. **Variability**: Different seeds → different sequences
3. **Constraint Validation**: Generated problems respect all parameters

Example test:

```typescript
it('should produce the same sequence with the same seed', () => {
  const seed = 42
  const rng1 = createSeededRNG(seed)
  const rng2 = createSeededRNG(seed)

  const problems1 = []
  const problems2 = []

  for (let i = 0; i < 10; i++) {
    problems1.push(generateProblem(10, 50, 1, 20, true, true, 0, rng1))
    problems2.push(generateProblem(10, 50, 1, 20, true, true, 0, rng2))
  }

  expect(problems1).toEqual(problems2)
})
```

## Implementation Notes

- **LCG Algorithm**: Uses Numerical Recipes parameters for good statistical properties
- **State Management**: Each RNG instance maintains its own state
- **Thread Safety**: Not applicable (single-threaded JavaScript)
- **Performance**: Negligible overhead compared to `Math.random()`
- **Array Safety**: `pickRandom()` throws on empty arrays because production callers expect non-empty choices

## Future Enhancements

Potential improvements for future iterations:

- Export/import seed + settings as shareable URLs
- Add property-based testing for generator invariants
- Support multiple RNG algorithms for comparison
- Add metadata tracking (seed, parameters, timestamp) to batch output

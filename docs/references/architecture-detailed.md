# Architecture & Design Decisions

## Overview

MYZL is a Vue 3 SPA (Single Page Application) designed for educational practice with focus on:
- Large card-based UI for easy interaction
- Touch-friendly navigation
- Static hosting optimization (GitHub Pages, Cloudflare Pages)
- No backend dependencies (client-side only)

## Technology Stack

**Core:**
- Vue 3.5+ with Composition API
- TypeScript ~6.0
- Vite 8.0+ for building
- Pinia 3.0+ for state management

**Key Libraries:**
- `vue-router`: Client-side routing
- `pinia-plugin-persistedstate`: State persistence via localStorage
- `hanzi-writer` + `cnchar` series: Chinese character learning
- `pinyin-pro`: Pinyin processing

**Testing:**
- Vitest: Unit testing
- Playwright: E2E testing
- Stryker Mutator: Mutation testing

## Architectural Patterns

### 1. Modular Game Architecture

Each game module follows a consistent structure:

```
src/
├── views/
│   └── [GameName]View.vue      # UI presentation & user interaction
├── stores/
│   └── [gameName].ts           # State management & business logic
└── [optional] composables/
    └── use[Feature].ts         # Reusable logic extraction
```

**Benefits:**
- Clear separation of concerns
- Easy to add new games
- Independent testing per module
- Consistent development pattern

**Example Modules:**
- Addition & Subtraction (`additionSubtraction`)
- Hanzi Learning (`hanzi`)
- Distributive Law (`distributiveLaw`)
- Linear Equation (`linearEquation`)

### 2. Automatic Route Generation

Routes are automatically generated from the game registry in `src/data/games.ts`:

```typescript
// GAMES_REGISTRY array defines all games
export const GAMES_REGISTRY = [
  {
    id: 'addition-subtraction',
    name: '加减法',
    component: () => import('@/views/AdditionSubtractionView.vue'),
    // ... metadata
  },
  // ... more games
]
```

The router system (`src/router/index.ts`) dynamically creates routes from this registry, eliminating manual route configuration.

**Benefits:**
- Single source of truth for game definitions
- Automatic navigation menu generation
- Reduced boilerplate when adding new games

See [Adding New Games Guide](../guides/add-new-game.md) for implementation details.

### 3. Shared Component Reuse

**GameLayout Component** (`src/components/GameLayout.vue`):
- Provides consistent layout across all game views
- Includes navigation buttons, config panel toggle
- Handles responsive design
- Implements common UI patterns

**Usage Pattern:**
```vue
<template>
  <GameLayout>
    <!-- Game-specific content -->
  </GameLayout>
</template>
```

**Benefits:**
- DRY principle (Don't Repeat Yourself)
- Consistent UX across games
- Centralized layout updates

### 4. Composables for Logic Extraction

Common logic is extracted into composables:

- `useGameNavigation.ts`: Keyboard/swipe navigation logic
- `useQuestionHistory.ts`: Question history stack management

**When to Create Composables:**
- Logic is used in multiple components
- Logic involves reactive state
- Logic needs lifecycle hooks (onMounted, onUnmounted)

**Benefits:**
- Reusable across components
- Easier to test in isolation
- Cleaner component code

### 5. Pinia State Management Strategy

**Per-Module Stores:**
Each game has its own Pinia store managing:
- Current problem/question state
- History/navigation state
- Configuration settings
- Business logic (problem generation, validation)

**Persistence:**
- Uses `pinia-plugin-persistedstate`
- User settings persist across page reloads
- Selective persistence (not all state needs persistence)

**Store Structure Example:**
```typescript
export const useGameStore = defineStore('game', {
  state: () => ({
    currentProblem: '',
    history: [],
    config: { /* user preferences */ }
  }),
  actions: {
    generateProblem() { /* ... */ },
    navigate(direction) { /* ... */ }
  },
  persist: {
    paths: ['config'] // Only persist config
  }
})
```

**Benefits:**
- Centralized state management
- Predictable state changes
- Easy debugging with DevTools
- Automatic persistence

### 6. Dynamic Module Loading & Factory Pattern

For batch operations and dynamic imports, the project uses factory functions:

**Pattern:**
```typescript
// Helper function encapsulates import + processing
const createBatchLoader = (importFn) => {
  return async () => {
    const module = await importFn()
    return processModule(module)
  }
}
```

**Benefits:**
- Eliminates duplicate code
- Unified error handling
- Type-safe imports
- Follows Single Responsibility Principle

See memory: "Dynamic Module Loading & Factory Pattern Refactoring" for detailed examples.

## Data Flow

```
User Interaction
    ↓
View Component (UI)
    ↓
Pinia Store (State + Logic)
    ↓
Utils/Composables (Helper Functions)
    ↓
Data Layer (Static JSON / Generated Content)
```

**Key Points:**
- Views never directly manipulate data
- Stores orchestrate business logic
- Utils provide pure functions
- Composables handle side effects and lifecycle

## File Organization Principles

### By Concern
- `views/`: Page-level components (routed)
- `components/`: Reusable UI components
- `stores/`: State management
- `composables/`: Reusable logic
- `utils/`: Pure helper functions
- `data/`: Static data sources

### By Feature (within each concern)
Each feature/game maintains its own files following naming conventions:
- `[FeatureName]View.vue`
- `[featureName].ts` (store)
- `[FeatureName]View.spec.ts` (tests)

## Design Decisions Rationale

### Why Client-Side Only?
- Simplifies deployment (static hosting)
- No server maintenance required
- Works offline after initial load
- Suitable for educational practice apps

### Why Pinia over Vuex?
- Better TypeScript support
- Simpler API (no mutations)
- Built-in composition API integration
- Smaller bundle size

### Why Automatic Route Generation?
- Reduces boilerplate
- Prevents route/config mismatches
- Makes adding games trivial
- Single source of truth

### Why Per-Module Stores?
- Avoids monolithic state
- Easier to reason about
- Better code splitting potential
- Independent testing

## Future Architecture Considerations

<!-- TODO: Discuss if these should be implemented -->

Potential improvements:
- **Backend Integration**: Sync progress across devices
- **Adaptive Difficulty**: AI-driven difficulty adjustment
- **Progress Tracking**: Analytics and achievement systems
- **Plugin System**: Allow community-contributed game modules

<!-- TODO: Add performance optimization notes if available -->
<!-- TODO: Add security considerations for future backend integration -->

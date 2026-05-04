# Adding A New Game

This guide explains how to add a new playable game mode to `MYZL`.

It is written for both human contributors and coding agents.

## Overview

Adding a new game now requires modifying only **one configuration file**: [`src/data/games.ts`](../src/data/games.ts)

The system automatically:
- ✅ Generates route configurations
- ✅ Adds navigation menu entries
- ✅ Displays the game on the home page
- ✅ Enables batch generation (if configured)

## Quick Start

### Step 1. Create the View Component

Create a new Vue component in the `src/views/` directory, for example: `MyNewGameView.vue`

```vue
<script setup lang="ts">
// Your game logic here
</script>

<template>
  <div class="game">
    <h1>My New Game</h1>
  </div>
</template>

<style scoped>
/* Styles */
</style>
```

### Step 2. Register the Game

Open [`src/data/games.ts`](../src/data/games.ts) and add a new entry to the [GAMES_REGISTRY](../src/data/games.ts#L20-L45) array:

```typescript
export const GAMES_REGISTRY: GameMeta[] = [
  // ... existing games
  
  {
    path: '/my-new-game',           // Route path
    name: 'my-new-game',            // Route name (should match component name)
    title: 'My New Game',           // Display title
    description: 'Game description', // Optional: short description
    icon: '🎮',                     // Optional: Emoji icon
    component: 'MyNewGameView',     // Component filename (without .vue extension)
  },
]
```

### Step 3. Done! ✅

That's it! The system will automatically:
- Generate the route configuration
- Add it to the navigation menu
- Display it on the home page game list

**No need to modify any other files!**

## Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `path` | string | ✅ | Route path, must start with `/` |
| `name` | string | ✅ | Route name, recommended to match component name |
| `title` | string | ✅ | Game display title |
| `description` | string | ❌ | Short game description |
| `icon` | string | ❌ | Emoji or icon identifier |
| `component` | string | ✅ | Component filename (without `.vue` extension) |
| `batchStoreLoader` | function | ❌ | Dynamic import function for store (enables batch generation) |

## Examples

### Example 1: Adding a Pinyin Practice Game

```typescript
{
  path: '/pinyin',
  name: 'pinyin',
  title: 'Pinyin',
  description: 'Pinyin recognition practice',
  icon: '🔤',
  component: 'PinyinView',
}
```

Then create the `src/views/PinyinView.vue` file.

### Example 2: Adding an English Words Game

```typescript
{
  path: '/english-words',
  name: 'english-words',
  title: 'English Words',
  description: 'English vocabulary memory practice',
  icon: '🇬🇧',
  component: 'EnglishWordsView',
}
```

Then create the `src/views/EnglishWordsView.vue` file.

### Example 3: Adding Batch Generation Support

To enable batch question generation for printing:

1. **Export generateProblem from store**:
   ```typescript
   // src/stores/myGame.ts
   export function generateProblem(): string {
     // Your generation logic
     return `${num1} + ${num2} = `
   }
   ```

2. **Add batchStoreLoader to game config**:
   ```typescript
   {
     path: '/my-game',
     name: 'my-game',
     title: 'My Game',
     component: 'MyGameView',
     batchStoreLoader: () => import('../stores/myGame'),
   }
   ```

The system automatically:
- Creates `/my-game/batch` route
- Shows batch button in GameLayout header
- Opens shared configuration dialog (built into GameLayout)
- Opens dedicated print page in new tab with user's settings
- Handles question generation and auto-printing

See [Batch Generation Guide](./batch-generate.md) for detailed batch generation documentation.

## Benefits

1. **Single Source of Truth** - Only maintain one file: [games.ts](file:///media/yunhai-luo/Life/GitHub/myzl/src/data/games.ts)
2. **Automated Routing** - Route configurations are generated automatically
3. **Type Safety** - Full TypeScript support with type checking
4. **Easy to Extend** - Adding a new game requires just 3 steps: create component → register config → done

## Important Notes

1. Component filenames must exactly match the `component` field (case-sensitive)
2. Component files must be placed in the `src/views/` directory
3. Route paths should be unique to avoid conflicts
4. Use kebab-case for route paths (e.g., `/my-game`)
5. Use PascalCase for component names (e.g., `MyGameView`)

## Testing Requirements

After adding a new game, ensure you:

### Unit Tests
- Create a test file: `src/views/MyNewGameView.spec.ts`
- Test that the component renders correctly
- Test main game interactions and controls
- Verify core game logic and invariants
- Use test data factories from `src/test/factories.ts` for consistent test data

### Store Tests (if applicable)
- Create a test file: `src/stores/myNewGame.spec.ts`
- Test state initialization with correct defaults
- Test all actions and state mutations
- Test getters and computed values
- Test persistence configuration
- Cover edge cases and error paths

### E2E Tests
- Update `e2e/vue.spec.ts` to include the new game
- Test navigation from home page to the game
- Test basic game functionality end-to-end
- Consider visual regression tests for key UI states

### Performance Tests (for question generators)
- Add performance benchmarks in `src/test/performance.spec.ts`
- Ensure question generation completes within acceptable time (< 100ms for 10k iterations)
- Monitor memory usage for potential leaks

### Coverage Targets
- **Store**: >85% statement coverage
- **View**: >90% statement coverage
- **Utilities**: 100% coverage (including error paths)
- Run `npm run test:unit -- --run --coverage` to verify

## Checklist

Use this before considering the work complete:

```
- [ ] Created new view in `src/views/`
- [ ] Added game registration in `src/data/games.ts`
- [ ] Added unit tests for the new view
- [ ] Added or updated E2E tests
- [ ] Updated `README.md` if needed
- [ ] Updated `AGENTS.md` if agent guidance changed
- [ ] Ran `npm run type-check`
- [ ] Ran `npm run lint`
- [ ] Ran `CI=1 npm run test:unit -- --run`
- [ ] Ran `npm run build`
```

## Architecture

The game registry system works as follows:

1. **Central Configuration**: All game metadata is defined in [`src/data/games.ts`](../src/data/games.ts)
2. **Automatic Route Generation**: The [`generateRoutes()`](../src/data/games.ts#L60-L68) function creates Vue Router configurations dynamically
3. **Dynamic Imports**: Routes use lazy-loading via `import()` for better performance
4. **Consistent Navigation**: Both the home page and app menu pull from the same registry, ensuring consistency
5. **Batch Generation**: Games with `batchStoreLoader` automatically get batch routes and UI integration

This eliminates the need to manually synchronize routes, menus, and home page entries across multiple files.

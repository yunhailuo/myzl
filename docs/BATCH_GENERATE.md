# Batch Generate Questions Feature

## Overview
Batch generation feature allows users to generate multiple practice questions at once for printing. Uses a hybrid approach combining embedded dialog in GameLayout with dedicated print route for optimal UX and style isolation.

## Architecture

### Hybrid Pattern: Dialog + Dedicated Route

The feature uses a two-stage approach:

1. **Configuration in Game Registry** ([`games.ts`](../src/data/games.ts))
   - Games optionally define `batchStoreLoader` function
   - System automatically generates `/game-path/batch` routes
   - Route meta data auto-includes `supportsBatch` flag

2. **GameLayout Dialog** ([`GameLayout.vue`](../src/components/GameLayout.vue))
   - Embedded batch configuration dialog (shared across all games)
   - Shows batch button when `route.meta.supportsBatch === true`
   - Collects user preferences: question count (1-1000), columns per page (1-6)
   - Opens dedicated batch route in new tab with parameters

3. **BatchView Component** ([`BatchView.vue`](../src/views/BatchView.vue))
   - Independent route for clean printing environment
   - Loads game-specific store dynamically via `batchStoreLoader`
   - Generates questions based on URL parameters
   - Auto-triggers print dialog on mount
   - No navigation elements or UI chrome

### Design Rationale

**Dialog in GameLayout:**
- ✅ Reusable across all games (no duplication)
- ✅ Consistent UX for batch configuration
- ✅ Centralized maintenance (one dialog, not N copies)
- ✅ Follows "通用逻辑复用" principle from project specification

**Dedicated Print Route:**
- ✅ Style isolation (no global layout interference)
- ✅ Clean print output without nav bars/buttons
- ✅ Users can adjust print settings while keeping page open
- ✅ Follows "专用独立路由" specification for printing scenarios

This hybrid approach avoids the drawbacks of pure dialog (style conflicts, complex state management) and pure route (duplicate dialogs, inconsistent UX) solutions.

## Quick Start

### For Developers

Adding batch support to a new game requires only two steps:

1. **Export generateProblem function** from store:
   ```typescript
   // src/stores/myGame.ts
   export function generateProblem(): string {
     // Your generation logic
     return `${num1} + ${num2} = `
   }
   ```

2. **Add batchStoreLoader to game config**:
   ```typescript
   // src/data/games.ts
   {
     path: '/my-game',
     name: 'my-game',
     title: 'My Game',
     component: 'MyGameView',
     batchStoreLoader: () => import('../stores/myGame'),
   }
   ```

That's it! The system automatically handles:
- Route generation (`/my-game` and `/my-game/batch`)
- Batch button display in GameLayout header
- Dialog rendering (already built into GameLayout)
- New tab opening with parameters
- Question generation in BatchView
- Auto-triggering print dialog

No changes needed to views, layouts, or other files.

### For End Users

1. Navigate to any game that supports batch generation
2. Click the list icon button (📋) in the top-right corner
3. Configure options in dialog:
   - **题目数量**: Number of questions (1-1000, default: 20)
   - **每页栏数**: Columns per page (1-6, default: 3)
4. Click "生成并打开新页面"
5. New tab opens with generated questions
6. Browser print dialog appears automatically
7. Adjust print settings as needed (paper size, scaling)
8. Print or save as PDF

## Technical Details

### URL Parameters

BatchView accepts query parameters:

- `count`: Number of questions (1-1000, default: 20)
- `columns`: Columns per page (1-6, default: 3)

Example: `/addition-subtraction/batch?count=50&columns=4`

### Dynamic Store Loading

Uses dynamic imports to load game stores on-demand:

```typescript
const storeModule = await loadStore()
const { generateProblem } = storeModule
```

Benefits:
- Lazy loading (smaller initial bundle)
- Type safety (TypeScript checks exports)
- Flexibility (each game defines its own generator)

### Error Handling

BatchView handles errors gracefully by redirecting to home page:

- Invalid game name → Redirects to home
- Missing batchStoreLoader → Logs error, redirects to home
- Generation failure → Logs error, redirects to home

### Keyboard Support

The batch dialog supports keyboard interaction:

- **ESC key**: Closes dialog (implemented in GameLayout)
- **Focus management**: First input field auto-focused on open
- **Click outside**: Closes dialog (overlay click handler)

### Print Optimization

- Removed unnecessary titles to maximize content area
- Font size: 1.5rem (screen), 1.2rem (print)
- Grid gap: 1rem (screen), 0.5rem (print)
- Padding: 2rem (screen), 1rem (print)
- White background enforced in print media
- All non-print elements hidden via `@media print` rules in App.vue

## Related Files

- [`src/data/games.ts`](../src/data/games.ts) - Game registry with batchStoreLoader
- [`src/components/GameLayout.vue`](../src/components/GameLayout.vue) - Shared batch dialog implementation
- [`src/views/BatchView.vue`](../src/views/BatchView.vue) - Batch generation and print view
- [`src/App.vue`](../src/App.vue) - Print media styles to hide navigation
- [`src/views/BatchView.spec.ts`](../src/views/BatchView.spec.ts) - Unit tests

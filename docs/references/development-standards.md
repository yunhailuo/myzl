# Development Standards & Conventions

## Code Style

### Language Requirements
- **Code comments**: English only (no Chinese comments)
- **Documentation**: English only
- **UI text**: Chinese with allowed English abbreviations

See [Design System Guidelines](./design-system.md) for details.

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Common types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Test-related changes
- `chore`: Maintenance tasks

**Example:**
```
feat(hanzi): add stroke animation loop toggle

Add configuration option to enable/disable looping of Hanzi Writer stroke animations. Default is enabled.

Closes #45
```

## Code Quality Principles

### 1. Simplification First

Before committing changes, review all uncommitted modifications to:
- Identify and eliminate duplicate code
- Remove redundant or obsolete code introduced by new changes
- Ensure new code doesn't make existing code unnecessary

**Checklist:**
- [ ] Are there any functions doing the same thing?
- [ ] Did my changes make some code paths unreachable?
- [ ] Can this logic be simplified?

### 2. Pattern Extraction Balance

Be aware of recurring code patterns that might benefit from abstraction, but maintain balance:

**Extract when:**
- The same pattern appears in 3+ places
- The abstraction improves readability
- The pattern is stable and unlikely to change

**Avoid premature abstraction when:**
- Pattern appears only twice (might be coincidence)
- Requirements are still evolving
- Abstraction adds complexity without clear benefit

**Remember:** It's easier to extract later than to undo premature abstraction.

### 3. CSS Syntax Rules

- Use `/* */` for CSS comments (not `//`)
- Follow project's design token system in `src/assets/base.css`

<!-- TODO: Add reference to CSS naming convention if exists -->

## Module Import Convention

In Vue + Vite projects, prefer configured alias paths (`@/`) over relative paths for newly created files to ensure TypeScript compiler correctly resolves modules.

**Example:**
```typescript
// ✅ Preferred
import { useGameStore } from '@/stores/game'

// ❌ Avoid (for new files)
import { useGameStore } from '../stores/game'
```

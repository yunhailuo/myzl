# Architecture Decisions

Records of significant architectural decisions made in this project. Each decision includes context, options considered, and rationale.

## Decision Log

### Recent Decisions

**[ADR-001] Modular Game Architecture** (2024-Q4)
- **Status**: Accepted
- **Context**: Need for scalable game module system
- **Decision**: Each game as View + Store + Tests triplet
- **Rationale**: Clear separation of concerns, easy to add new games
- [Read full decision →](001-modular-game-design.md)

**[ADR-002] Automatic Route Generation** (2024-Q4)
- **Status**: Accepted
- **Context**: Manual route configuration was error-prone
- **Decision**: Generate routes from GAMES_REGISTRY in games.ts
- **Rationale**: Single source of truth, reduces boilerplate
- [Read full decision →](002-automatic-routing.md)

**[ADR-003] Pinia State Management** (2024-Q4)
- **Status**: Accepted
- **Context**: Needed reactive state management with persistence
- **Decision**: Use Pinia with pinia-plugin-persistedstate
- **Rationale**: Better TypeScript support than Vuex, simpler API
- [Read full decision →](003-pinia-state-management.md)

**[ADR-004] Factory Pattern for Dynamic Loading** (2025-Q1)
- **Status**: Accepted
- **Context**: Multiple modules had similar dynamic import patterns
- **Decision**: Extract createBatchLoader helper function
- **Rationale**: DRY principle, unified error handling
- [Read full decision →](004-factory-pattern.md)

## How to Add a New ADR

1. Create new file: `NNN-short-title.md` (next sequential number)
2. Follow the ADR template structure
3. Link from this index
4. Reference in relevant code comments if needed

## ADR Template

```markdown
# [ADR-NNN] Title

**Status**: Proposed | Accepted | Deprecated | Superseded  
**Date**: YYYY-MM-DD  
**Supersedes**: [ADR-XXX](link) (if applicable)

## Context

What problem are we solving? Why is this decision necessary?

## Decision

What did we decide? Be specific.

## Rationale

Why did we choose this option? What alternatives were considered?

## Consequences

What are the positive and negative outcomes of this decision?

## Related

- Links to related decisions
- Links to implementation
```

## Related Resources

- **[Architecture Details](../references/architecture-detailed.md)**: Current architecture overview
- **[Module Specs](../specs/)**: Individual module specifications
- **[Quality Score](../quality.md)**: Quality metrics by architectural layer

# Plans Directory

This directory contains execution plans and technical debt tracking.

## Structure

- **`active/`**: Currently in-progress plans
- **`completed/`**: Finished plans (archived)
- **`tech-debt-tracker.md`**: Known technical debt items

## Plan Lifecycle

1. **Created**: New plan added to `active/`
2. **In Progress**: Work ongoing, updates logged
3. **Completed**: Moved to `completed/` with final summary
4. **Archived**: Historical reference only

## Writing Plans

### Active Plans Template

```markdown
# Plan: [Title]

**Status**: In Progress  
**Started**: YYYY-MM-DD  
**Owner**: [Name/Team]  
**Priority**: High | Medium | Low

## Objective

What are we trying to accomplish?

## Current State

Where are we now?

## Target State

Where do we want to be?

## Tasks

- [ ] Task 1
- [ ] Task 2

## Progress Log

- YYYY-MM-DD: Update 1
- YYYY-MM-DD: Update 2

## Blockers

Any current obstacles?

## Related

- Links to related issues/PRs
- Links to relevant docs
```

## Technical Debt Tracker

See [tech-debt-tracker.md](tech-debt-tracker.md) for current technical debt items.

## Related Resources

- **[Quality Score](../quality.md)**: Quality metrics that may indicate need for plans
- **[Architecture Decisions](../decisions/)**: Decisions that may have created debt
- **[Task Guides](../guides/)**: How to execute common tasks

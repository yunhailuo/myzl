# Documentation Maintenance Guidelines

## Philosophy

Documentation should be **living, concise, and complementary** to Git history. The goal is to provide current, actionable guidance without duplicating information that's better served by version control.

## What to Document vs. What to Keep in Git

### ✅ Document in Files (Current State)

**Include:**
- **How-to guides**: Step-by-step instructions for common tasks
- **Architecture decisions**: Why we chose certain patterns (with rationale)
- **Coding standards**: Current conventions and best practices
- **API contracts**: Public interfaces and their expected behavior
- **Configuration guides**: How to set up and configure the system
- **Troubleshooting**: Common issues and their solutions

**Rationale:** These represent the "current truth" about how the project works and should be maintained as the project evolves.

### ❌ Don't Document (Keep in Git History)

**Exclude:**
- **Change history**: What changed between versions (use CHANGELOG.md if needed)
- **Deprecated features**: Old ways of doing things (remove them)
- **Historical context**: Why we moved away from approach X (Git blame tells this story)
- **Bug fixes details**: Specific bugs and their fixes (Git commits capture this)
- **Failed experiments**: Approaches that didn't work (not relevant to current users)

**Rationale:** Git provides superior tools for historical queries:
```bash
# See when a line was last modified
git blame src/stores/game.ts

# View file at a specific point in time
git show HEAD~5:docs/ARCHITECTURE.md

# Search commit messages for context
git log --grep="refactor" --oneline

# Compare two versions
git diff v1.0..v2.0 -- docs/TESTING_STRATEGY.md
```

## Documentation Update Strategy

### 1. Incremental Updates

**When to update docs:**
- Immediately after code changes that affect documented behavior
- When adding new features or modules
- When fixing documentation bugs
- When user feedback indicates confusion

**Update process:**
1. Identify affected documentation sections
2. Update content to reflect new reality
3. Remove obsolete information (don't keep "for historical reference")
4. Add examples if complexity increased
5. Review related documents for consistency

### 2. Major Revisions

**When to restructure docs:**
- Architecture significantly changes
- Technology stack updates
- Major workflow improvements
- User feedback suggests reorganization

**Revision process:**
1. Audit existing documentation for relevance
2. Identify gaps and redundancies
3. Restructure for clarity and logical flow
4. Update cross-references and links
5. Create migration guide if breaking changes

### 3. Deprecation Strategy

**When removing documentation:**
- Feature removed from codebase
- Approach superseded by better alternative
- Information no longer accurate or helpful

**Deprecation process:**
```markdown
<!-- During deprecation period (1-2 releases) -->
> **Deprecated:** This approach is deprecated as of v2.0. 
> Use [new approach](./NEW_APPROACH.md) instead.
> This section will be removed in v2.2.

<!-- After deprecation period -->
<!-- Simply remove the section entirely -->
```

## Content Control Principles

### 1. Single Source of Truth

**Rule:** Each piece of information should exist in exactly one place.

**Examples:**
- ❌ Bad: Coverage targets in both README.md and TESTING.md
- ✅ Good: Coverage targets in TESTING_STRATEGY.md, referenced from README

**Exception:** High-level summaries can appear in multiple places if they link to detailed docs.

### 2. Current State Focus

**Rule:** Documentation describes the current state, not the journey.

**Examples:**
- ❌ Bad: "We used to use Vuex but migrated to Pinia in 2023 because..."
- ✅ Good: "This project uses Pinia for state management. See [Architecture](../references/architecture-detailed.md) for details."

**Rationale:** Users care about how it works now, not how it got here.

### 3. Actionable Over Comprehensive

**Rule:** Prefer concise, actionable guidance over exhaustive reference.

**Examples:**
- ❌ Bad: 50-page API reference with every parameter documented
- ✅ Good: Common use cases with links to TypeScript definitions

**Rationale:** Developers can explore code; docs should accelerate understanding.

### 4. Link to Code for Details

**Rule:** When in doubt, link to source code rather than duplicating it.

**Examples:**
```markdown
For complete API details, see:
- [additionSubtraction store](../src/stores/additionSubtraction.ts)
- [GameLayout component](../src/components/GameLayout.vue)
- [useGameNavigation composable](../src/composables/useGameNavigation.ts)
```

**Rationale:** Code is the ultimate source of truth and always up-to-date.

## Documentation Quality Checklist

Before committing documentation changes:

- [ ] Information is current and accurate
- [ ] No references to removed/deprecated features
- [ ] Links are valid and point to correct resources
- [ ] Examples work as described
- [ ] Language is clear and concise
- [ ] No duplicate information elsewhere
- [ ] Cross-references updated if structure changed
- [ ] Spelling and grammar checked
- [ ] Follows project style (English for docs, per language policy)

## Maintenance Cadence

### Regular Reviews

**Quarterly:**
- Audit all documentation for accuracy
- Update outdated examples
- Fix broken links
- Remove deprecated sections

**Per Release:**
- Update version-specific information
- Add new feature documentation
- Review changelog (if maintained)
- Verify installation/setup instructions

### Automated Checks

Consider adding to CI:
```yaml
# .github/workflows/docs-check.yml
- name: Check for broken links
  run: npx markdown-link-check docs/*.md

- name: Validate code examples
  run: npm run test:docs  # Custom script to test doc examples
```

## Handling Historical Information

### When History Matters

**Document history only when:**
1. Understanding evolution is critical for maintenance
2. Migration path needs explanation
3. Decision rationale helps avoid repeating mistakes

**Format:**
```markdown
## Design Evolution

**Current approach:** Uses automatic route generation from game registry.

**Previous approach (removed in v1.5):** Manual route configuration.

**Why changed:** Automatic generation reduces boilerplate and prevents route/config mismatches.

For historical implementation details, see:
- Commit: `git show abc123`
- PR: [#45](https://github.com/org/myzl/pull/45)
```

### When History Doesn't Matter

**Simply remove old information:**
- Deleted features
- Superseded patterns
- Outdated dependencies
- Fixed bugs

**Trust Git:**
```bash
# Anyone can find this information if needed
git log --all --full-history -- "**/old-feature.ts"
git show <commit-hash>:path/to/file
```

## Changelog Strategy (Optional)

If maintaining a CHANGELOG.md, follow [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
## [Unreleased]

### Added
- New game module: Pattern Recognition

### Changed
- Updated Pinia to v3.0+

### Fixed
- Navigation state persistence issue (#123)

## [2.1.0] - 2026-05-03

### Added
- Batch question generation feature
- Configurable difficulty levels

### Changed
- Refactored store architecture for better modularity
```

**Benefits:**
- User-facing change summary
- Upgrade path clarity
- Release notes automation

**Maintenance:**
- Update during development (Unreleased section)
- Finalize at release time
- Link to detailed docs for complex changes

## AI Agent Documentation Responsibilities

When AI agents modify the project:

1. **Code Changes → Doc Updates:**
   - If behavior changes, update relevant docs
   - If new patterns introduced, document them
   - If APIs modified, update interface docs

2. **Doc-Only Changes:**
   - Clarify confusing sections
   - Fix inaccuracies
   - Improve examples
   - Add missing cross-references

3. **Before Completing Task:**
   - Verify all referenced docs are current
   - Check for broken links
   - Ensure examples still work
   - Confirm no contradictory information

## Resources

- [Write the Docs Guide](https://www.writethedocs.org/guide/)
- [Documentation Driven Development](https://tom.preston-werner.com/2019/05/19/the-document-driven-developer.html)
- [Keep a Changelog](https://keepachangelog.com/)
- [Diátaxis Framework](https://diataxis.fr/) - Documentation structure methodology

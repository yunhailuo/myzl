# Module Specifications

Detailed specifications for each game module. Use these when working on specific modules.

## Game Modules

### Core Games
- **[Addition & Subtraction](addition-subtraction.md)**: Arithmetic practice module
  - Numerical ranges (1-19)
  - Question generation algorithm
  - State management
  - UI components

- **[Hanzi Learning](hanzi.md)**: Chinese character learning module
  - Character dataset structure
  - Hanzi Writer integration
  - Pinyin and word examples
  - Stroke animation control

- **[Distributive Law](distributive-law.md)**: Multiplication distribution practice
  - Problem types (expand/factor/trap/swap)
  - Numerical range configuration
  - Simplification models
  - String-based problem representation

- **[Linear Equation](linear-equation.md)**: Linear equation solving
  - Term rearrangement logic
  - Variable handling
  - Step-by-step solutions
  - Configuration options

## Specification Structure

Each module specification includes:
- **Overview**: Purpose and target users
- **Architecture**: Store structure, view components, composables
- **Data Flow**: How data moves through the module
- **Configuration**: User-configurable options
- **Testing**: Module-specific test requirements
- **Known Issues**: Current limitations and planned improvements

## Adding New Specifications

When adding a new game module:
1. Create `<module-name>.md` in this directory
2. Follow the standard specification structure
3. Link from this index file
4. Update [Adding New Games Guide](../guides/add-new-game.md) if needed

## Related Resources

- **[Adding New Games Guide](../guides/add-new-game.md)**: How to create a new module
- **[Architecture Details](../references/architecture-detailed.md)**: Overall system architecture
- **[Development Standards](../references/development-standards.md)**: Coding conventions

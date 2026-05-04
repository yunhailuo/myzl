# MYZL Documentation

Welcome to the MYZL project documentation! This guide helps both humans and AI agents navigate the codebase effectively.

## 📚 Documentation Structure

Our documentation follows a **progressive disclosure** model: start simple, dive deeper as needed.

### For Quick Tasks → Start with [Task Guides](guides/)

Need to accomplish something specific? Task guides provide step-by-step workflows:
- Adding new games
- Modifying stores
- Writing tests
- Fixing bugs
- Optimizing performance

### For Deep Understanding → Consult [References](references/)

Need detailed specifications or standards? Reference docs provide comprehensive information:
- Architecture details
- Development standards
- Testing patterns
- Code quality guidelines
- Design system

### For Module-Specific Work → Check [Module Specs](specs/)

Working on a particular game module? Module specs provide focused documentation:
- Addition & Subtraction
- Hanzi Learning
- Distributive Law
- Linear Equation

### For Context → Read [Architecture Decisions](decisions/)

Want to understand why we made certain choices? ADRs capture decision rationale:
- Modular game architecture
- Automatic route generation
- Pinia state management
- Factory patterns

## 🤖 For AI Agents

If you're an AI agent working on this codebase:

1. **Start with `AGENTS.md`**: This is your table of contents (~100 lines)
2. **Follow task guides**: They provide complete workflows
3. **Consult references when needed**: For detailed specifications
4. **Update documentation**: If you change behavior, update relevant docs
5. **Keep AGENTS.md small**: Never add detailed content there

See [Documentation Guidelines](references/documentation-guidelines.md) for more details.

## 👥 For Human Developers

This documentation is designed for you too! Benefits:

- **Clear structure**: Easy to find what you need
- **Progressive disclosure**: Start simple, learn more as needed
- **Current information**: Regularly updated and validated
- **Practical examples**: Real code snippets and workflows

## 📊 Project Health

Check our current quality metrics:
- **[Quality Score](quality.md)**: Coverage, grades, known gaps
- **[Technical Debt](plans/tech-debt-tracker.md)**: What needs improvement

## 🚀 Getting Started

New to the project? Follow this path:

1. Read [Project Overview](../README.md) in the root
2. Skim [AGENTS.md](../AGENTS.md) for quick reference
3. Browse [Task Guides](guides/) to understand common workflows
4. Explore [Architecture Details](references/architecture-detailed.md) for system understanding
5. Run the app: `npm install && npm run dev`

## 🔄 Documentation Maintenance

We keep docs current through:
- **Regular reviews**: Quarterly audits
- **Automated checks**: CI validates links and structure
- **Agent assistance**: "Doc-gardening" tasks fix stale content
- **Community updates**: Everyone contributes improvements

See [Documentation Guidelines](references/documentation-guidelines.md) for maintenance practices.

## 💡 Philosophy

Our documentation philosophy (inspired by [OpenAI's Harness Engineering](https://openai.com/index/harness-engineering/)):

1. **Context is scarce**: Keep entry points small and focused
2. **Progressive disclosure**: Reveal complexity gradually
3. **Repository is source of truth**: All knowledge lives in versioned files
4. **Mechanical enforcement**: Linters and CI validate documentation quality
5. **Agent legibility**: Optimize for both human and AI readability

## 📞 Need Help?

- **Quick questions**: Check task guides first
- **Complex issues**: Consult reference documentation
- **Architectural questions**: Read relevant ADRs
- **Still stuck**: Look at actual code - it's the ultimate source of truth

---

**Last Updated**: 2026-05-03  
**Next Review**: 2026-08-03 (quarterly)

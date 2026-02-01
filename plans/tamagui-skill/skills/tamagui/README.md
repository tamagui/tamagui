# Tamagui Skill

Official Claude Code skill for [Tamagui](https://tamagui.dev) - the universal React UI framework.

## Installation

```bash
npx skills add tamagui/tamagui-skills
```

## Usage

The skill activates when working with Tamagui code. It provides:

- Core styling patterns (`styled()`, variants, tokens)
- Component usage (Button, Dialog, Sheet, etc.)
- Animation guidance
- Anti-patterns to avoid
- Compiler optimization tips

### Project-Specific Config

For your project's actual tokens, themes, and components:

```bash
npx tamagui generate-prompt
```

This generates `tamagui-prompt.md` with your specific configuration. The skill will reference this file when available.

## What's Included

```
skills/tamagui/
├── SKILL.md              # Main skill (~600 lines)
└── references/
    ├── components.md     # Component API reference
    ├── animations.md     # Animation drivers and patterns
    └── configuration.md  # Config setup guide
```

## Resources

- [Tamagui Docs](https://tamagui.dev)
- [GitHub](https://github.com/tamagui/tamagui)
- [Discord](https://discord.gg/tamagui)

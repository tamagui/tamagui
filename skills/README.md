# Tamagui agent skills

Agent skills for [Tamagui](https://tamagui.dev), the universal React UI framework.
They install into Claude Code, Codex, Cursor and the other agents the
[`skills`](https://github.com/vercel-labs/skills) CLI supports.

| Skill | What it covers |
| --- | --- |
| `tamagui` | Authoring: `styled()`, variants, flat values, tokens and themes, components, animations, compiler behavior |
| `tamagui-upgrade-v3` | Migrating an app from v2 (or v1) to v3: the flat-values codemod, the `$` sigil removal, and every breaking change the codemod cannot do |

## Install

Both skills, from the v3 branch:

```bash
npx skills add https://github.com/tamagui/tamagui/tree/v3-beta/skills
```

One of them:

```bash
npx skills add https://github.com/tamagui/tamagui/tree/v3-beta/skills/tamagui-upgrade-v3
```

Drop the `/tree/v3-beta` segment to install from `main`, which is v2.

## Project-specific config

The skills describe Tamagui itself. For your app's own tokens, themes and
components, generate a companion file and the skills will read it:

```bash
npx tamagui generate-prompt
```

That writes `tamagui-prompt.md` from your real config.

## Resources

- [Docs](https://tamagui.dev)
- [Upgrade guide](https://tamagui.dev/docs/guides/how-to-upgrade)
- [Discord](https://discord.gg/tamagui)

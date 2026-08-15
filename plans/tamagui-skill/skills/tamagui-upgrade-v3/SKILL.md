---
name: tamagui-upgrade-v3
description: |
  Migrate an app from Tamagui v2 (or v1) to v3. Use when upgrading Tamagui versions,
  removing `$` token prefixes, converting `hoverStyle`/`pressStyle`/media/theme/platform
  condition objects to flat values, running the flat-values codemod, or fixing v3
  breaking changes. Triggers: "upgrade tamagui", "migrate to v3", "flat values",
  "$ tokens", "hoverStyle", "codemod", "tamagui v3 breaking changes".
version: 1.0.0
---

# Upgrading to Tamagui v3

V3 moves every style condition into the value of the property it changes and
removes the `$` sigil. There is no compatibility setting and no legacy runtime
path: the codemod plus the manual work in this skill is the entire migration.

```tsx
// v2
<View bg="$background" hoverStyle={{ bg: '$backgroundHover' }} p="$4" $sm={{ p: '$6' }} />

// v3
<View bg="background hover:background-hover" p="4 sm:6" />
```

The rules that make v3 readable once you know them:

- Quoted values resolve config-first: `p="4"` is the space token, `p={4}` is a
  raw platform value (CSS px on web, points on native). Strings are grammar,
  numbers are raw.
- A value is `base? clause*`. Clause modifiers match Tailwind spelling:
  `hover:`, `press:`, `dark:`, `sm:`, `web:`, `group-hover/card:`, `@sm/card:`.
  The last matching clause wins; `dark:hover:x` requires both.
- Multi-word built-in names are kebab-case: `$backgroundHover` is now
  `background-hover`. User-defined token names keep their authored spelling.
- A configured name wins over a same-spelled CSS literal; anything not in the
  config is literal CSS.

## How to run this migration

Most of the mechanical work is owned by two tools you drive rather than
re-implement:

- `npx tamagui migrate --from v2` (or `--from v1`) prints the canonical
  step-by-step migration prompt: dependency updates, config and theme moves,
  the Sheet codemod, and every deprecated-API replacement with before/after.
  That prompt is the checklist of record. This skill tells you how to sequence
  it, what the codemod cannot do, and how to prove the result.
- The flat-values codemod (`code/core/codemod-flat-values` in a Tamagui
  checkout) converts `$` tokens and condition objects transactionally and
  reports everything it cannot prove safe.

Real-corpus measurement: roughly 80% of sites convert cleanly; the remaining
20% are flagged for human judgement. Budget the migration accordingly. The
flagged 20% is where apps break, and it is what most of this skill is about.

## Phase 0: inventory before touching anything

Real v2 apps measured between 5,000 and 16,000 `$token` literals and between
60 and 900 runtime-computed style values. Size the job and find the owners
before editing:

```bash
# volume of mechanical work
rg -o '"\$[a-zA-Z0-9.-]+"' -g '*.tsx' | wc -l
rg -c 'hoverStyle|pressStyle|focusStyle|enterStyle|exitStyle|\$theme-|\$platform-|\$group-' -g '*.tsx'

# the hard cases: runtime-computed style values
rg '(\bbg|color|opacity|scale|rotate|Style)=\{[^}]*\?' -g '*.tsx'       # ternaries in style props
rg '\.\.\.\(' -g '*.tsx'                                                 # conditional spreads
rg 'Style=\{\{[^}]*\?' -g '*.tsx'                                        # dynamics inside condition objects

# owners and special surfaces
rg -l 'createTamagui|TamaguiCustomConfig'                                # every config, including per-package ones
rg 'mutateThemes|addTheme|updateTheme'                                   # runtime-generated themes
rg '\.styleable\(|createStyledHOC\('                                     # wrapper factory API changes
rg 'useTheme\(\)\..*\.val|getTokenValue\(|var\(--'                       # token escape hatches
```

Write the inventory down: every config owner, every shared wrapper component
(Button, Dialog, Sheet, Popover, Menu, Input and friends), the files with
runtime-computed styles, and every escape hatch. This list is your work plan
and your review scope.

Then get a green baseline: typecheck, build, tests, and a running app on every
platform you ship. Commit. You want a diff whose only variable is the
migration.

## Phase 1: order the work by ownership

Migrate in dependency order, never leaf-first:

1. Config and themes first (the `tamagui migrate` prompt's config step,
   including renaming reserved token names and resolving palette-step names).
   Include runtime theme code: `mutateThemes` palettes and any generated theme
   sets migrate with the config, not after it.
2. The shared primitive layer second: the app's Button, Dialog, Sheet,
   Popover, Menu, Input wrappers and design-system packages. Every caller
   depends on their types and behavior.
3. App screens third.
4. Generated or duplicated corpora (templates, examples, starters) last,
   through whatever sync mechanism already owns them.

Converting leaf call sites before their shared primitives forks the app's
one-path architecture and doubles the review surface.

## Phase 2: codemod, report first

From a Tamagui checkout:

```bash
cd code/core/codemod-flat-values

# 1. report only; read it before writing anything
bun run dry-run --report /tmp/flat-report.md --json /tmp/flat-report.json path/to/app/src

# 2. after reading: apply the statically safe conversions
bun src/index.ts --write --report /tmp/flat-write-report.md path/to/app/src
```

Facts about the codemod that shape how you work with it:

- `--write` applies only conversions proven safe: Tamagui provenance proven
  through imports, ordering preserved, the emitted program re-parsed with the
  real grammar, host and platform targets checked per file name. Everything
  else stays authored and lands in the report.
- It never edits `createTamagui()` config. Config is always your job.
- A report row is a decision, not noise. Resolve every row, re-run, repeat
  until the report names no remaining legacy sites. There is no runtime
  fallback, so a skipped row is a broken style in production.
- It preserves v5 palette-step names (`blue10`) as non-blocking
  `legacy-palette-token` warnings because it cannot evaluate your config. The
  v6 defaults do not define them and missing colors drop silently, so resolve
  every one: an absolute token such as `blue-500`, or a theme's adaptive
  `colorN` ramp.

For what each flag code means and the standard fix for each, read
[references/flag-playbook.md](references/flag-playbook.md).

## Phase 3: the hard 20%, by pattern

The codemod flags these; you rewrite them. Full before/after recipes are in
[references/hard-cases.md](references/hard-cases.md). The short map:

| Pattern | What to do |
|---|---|
| Ternary over token literals: `bg={x ? '$a' : '$b'}` | Codemod rewrites literal trees in place; verify, don't touch |
| Dynamic value inside a condition object: `hoverStyle={{ bg: x ? undefined : '$a' }}` | Lift the branch outside the clause string, or make it a variant |
| Conditional spreads carrying style objects | Convert the spread object's values; never reorder the spread itself |
| Functional variants returning style objects | Keep the function, convert returned values to flat strings |
| Token in a module constant: `const R = '$6'` | Migrate the constant, then its users |
| Tokens embedded in composite strings (shadows, gradients) | Bare name for named tokens; resolved CSS value for numeric ones |
| Shadow/text-shadow/transform part conditions | Rebuild as one complete `boxShadow`, `textShadow`, or `transform` value |
| `exitStyle` in shared or web files | Keep it authored; `exit:` only evaluates on native |
| `x`/`y` offsets with a custom config | v2 `$4` used the size scale, v3 `4` uses space; review if the scales differ |
| Group size conditions: `$group-card-maxMd` | Becomes `@max-md/card:` plus `container containerName="card"` on the declaring ancestor; the container owner must be provable |

## Phase 4: preserve the escape hatches

Migrated apps carry deliberate, commented workarounds. Migrating styles is not
a license to clean these up; each one exists because something upstream did
not work, and removing it reintroduces the bug:

- `useTheme().token.val` and `getTokenValue()` feeding native modules, charts,
  or third-party APIs stay exactly as they are.
- CSS `var(--token)` usage in SVG and raw DOM stays.
- Direct DOM event listeners, class-based CSS for properties Tamagui cannot
  express, and geometry workarounds stay.
- Type-boundary casts for arbitrary user-supplied colors stay.
- Prop and spread ORDER is semantic in Tamagui. Later contributions replace
  only the base or exact clauses they restate. Do not reorder `...props`,
  conditional spreads, or wrapper defaults while migrating, and do not
  "simplify" a spread chain.

If a workaround's underlying bug is actually fixed in v3, remove it in a
separate commit with its own verification, after the migration lands.

## Phase 5: validate at runtime, on every platform

Transformed source is an intermediate artifact. Typechecking proves almost
nothing here because flat values are broad string types; the proof is resolved
runtime styles and real interaction. Minimum matrix, drawn from real apps:

1. Typecheck, build, `npx tamagui check`, and the `@tamagui/eslint-plugin`
   `valid-flat-values` rule (also loadable in oxlint via `jsPlugins`) over the
   migrated source.
2. Web: one responsive, theme-heavy screen through every breakpoint, light and
   dark, hover/press/focus on interactive elements.
3. Web: one Dialog or Popover that adapts to Sheet at a breakpoint; open,
   close, escape, outside click, and the exit animation.
4. Web: one animated component using `enterStyle`/`exitStyle` under each
   animation driver the app configures.
5. Native: one screen that consumes `useTheme().val`; one Sheet with keyboard
   open, safe-area insets, and drag dismissal; enter/exit transitions under
   the native driver. Web passing proves nothing about the native driver.
6. Re-run the codemod report: it must name zero remaining legacy sites.
7. Audit custom CSS against the v3 specificity change (ordinary base rules
   dropped from `(0,2,0)` to `(0,1,0)`, so single-class consumer rules now tie
   and stylesheet order decides). Rebaseline any snapshot pinning generated
   class names (`active:` now hashes as `press:`).

## Ongoing enforcement

After the migration, wire the same grammar engine into the toolchain so legacy
spellings cannot come back and typos in flat values are caught:

- `@tamagui/language-service` in `tsconfig.json` `compilerOptions.plugins` for
  in-editor completions and diagnostics (works in every tsserver editor:
  VS Code, Zed, Neovim, Helix).
- `@tamagui/eslint-plugin` `valid-flat-values` in ESLint or oxlint config for
  CI and agent loops.
- Keep `.tamagui/tamagui.config.json` generation in the build so both tools
  see the real config vocabulary.

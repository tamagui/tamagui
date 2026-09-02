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
  the Sheet anatomy migration, and every deprecated-API replacement with
  before/after.
  That prompt is the checklist of record. This skill tells you how to sequence
  it, what the codemod cannot do, and how to prove the result.
- `npx @tamagui/codemod-flat-values` converts `$` tokens and condition objects
  transactionally and reports everything it cannot prove safe.

Real-corpus measurement across two apps: 80% of sites converted cleanly on the
Bento corpus (1,681 of 2,113) and 67% on a mid-size control-room app (1,007 of
1,504). Budget for a third of sites needing human judgement, not a fifth.

The variance is worth predicting before you start, because one authoring habit
dominates it. In the 67% corpus, 272 of the 497 flagged sites were a single
cause: fractional space tokens (`$0.5`, `$1.5`, `$2.5`, `$3.5`), which flag as
`legacy-token-dot-path`. Count them first (`rg -o '"\$[0-9]+\.[0-9]+"'`); an app
that leans on half-steps lands near 67%, one that does not lands near 80%.

The flagged third is where apps break, and it is what most of this skill is
about. The section below on silent value drift is where they break WITHOUT
being flagged, which is worse.

## Gate 1: can this app take v3 at all?

Check this before inventory, because a yes here means the app cannot take v3 at
all yet and everything below is wasted effort:

```bash
rg "createV5Theme|subtleChildrenThemes|@tamagui/theme-builder|themes/v5-builder|v5-subtle-builder"
```

V3 keeps the v5 output packs as frozen static themes but removed the DYNAMIC
generation API that produced them. If the app generates its own v5 themes, the
upgrade guide's position is that it migrates that generation to the v6 recipe
API or stays on v2.

Three ways out, cheapest first:

1. **Freeze the generated themes.** The builder is a value generator, and most
   apps have long since stopped changing its inputs. Run it once on the CURRENT
   version, serialize the output to a static literal, and the app stops
   importing the removed API while every resolved value survives byte-identical.
   This decouples the theme question from the v3 upgrade entirely, and it is the
   right first move whenever the palette is settled or, especially, when its
   values were measured or tuned against a visual reference.
2. **`@tamagui/config-v5`**, if it is available in your version: the dynamic
   builders published as a separate opt-in package so they stay out of the
   default install.
3. **Rebuild on the v6 recipe API** (`createThemes`, `levels`, scales,
   treatments from `@tamagui/themes/builder`). The real destination, and the
   place to express what `childrenThemes` and `componentThemes` used to do.

Do not combine 3 with the flat-values migration. A theme rebuild and a syntax
rewrite in one diff leaves nothing to bisect when the app looks wrong.

If the app also reads the adaptive ramp, note that v6 has 11 steps where v5 had
12. `npx tamagui migrate --from v2` prints the approximate remap; the endpoints
are exact and `color6`/`color7` merge into `color6`, so everything from
`color8` up shifts down one. Inspect contrast in the compressed middle rather
than trusting the shift.

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
rg '<Theme[^\n>]*\b(bg|background|border|radius|padding|p=|width|height)' -g '*.tsx'
rg 'styled\(Theme' -g '*.tsx'                                            # Theme no longer takes style props
```

Write the inventory down: every config owner, every shared wrapper component
(Button, Dialog, Sheet, Popover, Menu, Input and friends), the files with
runtime-computed styles, and every escape hatch. This list is your work plan
and your review scope.

Then get a green baseline: typecheck, build, tests, and a running app on every
platform you ship. Commit. You want a diff whose only variable is the
migration.

## Gate 2: v5 or v6 config (a mature app stays on v5)

**Upgrading to v3 and moving from config v5 to v6 are two migrations. Do the
first one only.** For any mature app the recommendation is to stay on
`@tamagui/config/v5`, which v3 supports as a frozen static pack.

The reasoning is that they cost differently. The v3 upgrade is a large but
mechanical syntax change with a codemod, a report, and a finish line you can
see. The v6 config move is a design change: it buys Tailwind alignment and
costs a visible shift in spacing, sizing and color across the whole app, with no
tool that can tell you whether the result is right. Only your eyes can.

Stacking them means every visual difference has two possible causes and you
cannot bisect. Keeping v5 makes the flat-values conversion genuinely
value-neutral, so any visual change is a bug rather than a decision.

Do v3 first. There is already plenty to figure out. Decide about v6 later, on
its own, when you have budget for the visual review it deserves. The nice
property of v6 is that it can be adopted piece by piece afterwards.

If the web config uses the CSS animation driver and the app renders Sheet or
uses animated-number hooks, import `createAnimations` from
`@tamagui/animations-css/extras`. The root entry intentionally omits those
hooks, and Sheet throws when it tries to animate its position.

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

From the root of the app you are migrating, which is where its paths and its
`tsconfig.json` resolve from:

```bash
# 1. report only; read it before writing anything
npx @tamagui/codemod-flat-values --report /tmp/flat-report.md --json /tmp/flat-report.json ./src

# 2. after reading: apply the statically safe conversions
npx @tamagui/codemod-flat-values --write --report /tmp/flat-write-report.md ./src
```

Facts about the codemod that shape how you work with it:

- `--write` applies only conversions proven safe: Tamagui provenance proven
  through imports, ordering preserved, the emitted program re-parsed with the
  real grammar, host and platform targets checked per file name. Everything
  else stays authored and lands in the report.
- One element can carry two of the same condition object. A write that
  converts the first `pressStyle` can leave a later `pressStyle={cond ?
  undefined : { bg: 'color4' }}` authored. After `--write`, grep remaining
  `hoverStyle`/`pressStyle`/`enterStyle`/`exitStyle` and convert the leftovers
  (soot: `ComposerAttachmentDialog` needed a second `pressStyle` lifted to
  `bg={busyAction ? undefined : 'press:color4'}`).
- It never edits `createTamagui()` config. Config is always your job.
- A report row is a decision, not noise. Resolve every row, re-run, repeat
  until the report names no remaining legacy sites. There is no runtime
  fallback, so a skipped row is a broken style in production.
- It preserves v5 palette-step names (`blue10`) as non-blocking
  `legacy-palette-token` warnings because it cannot evaluate your config. The
  warning requires a config-aware decision. If the application stayed on the
  frozen v5 pack, verify that the token exists and record the warning as
  resolved without renaming it. If the application moved to v6, replace it
  with an absolute token such as `blue-500` or a theme's adaptive `colorN`
  ramp because missing colors drop silently.

For what each flag code means and the standard fix for each, read
[references/flag-playbook.md](references/flag-playbook.md).

## Phase 2.5: the silent value drift, if you moved to v6 anyway

Skip this if you took the Gate 2 recommendation and stayed on v5. It is the
whole reason that recommendation exists.

The codemod converts spelling. It never edits `createTamagui()`. So if you also
move the config from v5 to v6 in the same pass, every token keeps its name and
changes its value, and the report calls all of it clean.

The v5 space scale is a hand-tuned curve. The v6 scale is Tailwind's 4px grid.
They agree almost nowhere, and they diverge more the larger the token:

| token | v5 | v6 | delta |
|---|---|---|---|
| 1 | 2 | 4 | +2 |
| 2 | 7 | 8 | +1 |
| 3 | 13 | 12 | -1 |
| 4 | 18 | 16 | -2 |
| 6 | 32 | 24 | -8 |
| 8 | 46 | 32 | -14 |
| 10 | 60 | 40 | -20 |
| 12 | 88 | 48 | -40 |
| 16 | 144 | 64 | -80 |
| 20 | 186 | 80 | -106 |

15 of 16 integer space tokens change. `$20` loses 57% of its value. In the
corpus measured above that is 490 sites, every one of them auto-applied by
`--write` and reported clean.

The asymmetry is the tell that spelling and value are different problems:
`gap="$2"` converts to `gap="2"` as clean while its value moves 7px to 8px,
and `p="$2.5"` is flagged for review while its value does not move at all
(10px in both). The flag tracks naming, and the naming is the safe half.

### Do not migrate these tokens by name

The default reading, `$5` becomes `5`, is the worst of the available options.
It preserves the label and discards the design. Map by VALUE instead and most
tokens land exactly:

| v5 | value | by name | by nearest value |
|---|---|---|---|
| `$1` | 2 | `1` = 4 | `0.5` = 2, exact |
| `$1.5` | 4 | `1.5` = 6 | `1` = 4, exact |
| `$2.5` | 10 | `2.5` = 10, exact | `2.5` = 10, exact |
| `$3.5` | 16 | `3.5` = 14 | `4` = 16, exact |
| `$5` | 24 | `5` = 20 | `6` = 24, exact |
| `$6` | 32 | `6` = 24 | `8` = 32, exact |
| `$16` | 144 | `16` = 64 | `36` = 144, exact |
| `$20` | 186 | `20` = 80 | `48` = 192, ±6 |

Name-matching hits one exact value out of seventeen. Nearest-value hits seven,
and its worst case is 6px rather than 106px.

### Four options, pick one per scale and write it down

| Option | What it does | Costs |
|---|---|---|
| **Stay on v5** | Keep the frozen static pack | Nothing. No Tailwind alignment. The Gate 2 recommendation |
| **Nearest value** | `$5` becomes `6`, mapped by resolved px | Token names stop reading semantically; `$16` becoming `36` looks wrong in a diff |
| **Raw pixels** | `$5` becomes `{24}`, no token at all | Exact fidelity; those sites leave the token system and stop responding to future scale changes. Reasonable for half-steps and one-off values, bad as a blanket policy |
| **Augment v6** | Add the missing values back as extra tokens on the v6 config | Keeps names and values; you now own a scale that is neither v5 nor stock v6, so say so in the config |

Half-steps and quarter-steps are where raw pixels earn their place: `$0.75` has
no v6 equivalent at any spelling, and three sites of `{3}` beat inventing a
token nobody else uses.

Whichever you choose, treat spacing as its own reviewed migration with its own
visual diff, separate from the flat-values commit. Do not let one commit carry
both a syntax rewrite and a layout change.

The same drift applies to `size` and `radius`. Generate the comparison for
  your own scales rather than trusting the table above, which is the v5 default:

  ```sh
  # run from the app, against whichever config you are leaving.
  # tokens are raw numbers on a pre-createTamagui config and Variables after it,
  # so read through both shapes.
  bun -e 'const raw=v=>v?.val ?? v;
    const v5=(await import("@tamagui/config/v5")).defaultConfig.tokens.space;
    const v6=(await import("@tamagui/config/v6-base")).tokens.space;
    for (const k of Object.keys(v6)) {
      const a=raw(v5["$"+k]), b=raw(v6[k]);
      if (a !== undefined && a !== b) console.log(k, a, "->", b);
    }'
  ```
- `$0.75` and `$0.25` have no v6 equivalent at all. v6 carries only the Tailwind
  half-steps (`0.5`, `1.5`, `2.5`, `3.5`), so quarter-steps need a real decision
  rather than a rename.

Note the v6 spelling: the token is `2.5`, same as Tailwind. Hyphenated names
(`2-5`) still resolve as aliases. `$2.5` becomes `2.5`.

## Phase 3: the flagged third, by pattern

The codemod flags these; you rewrite them. Full before/after recipes are in
[references/hard-cases.md](references/hard-cases.md). The short map:

| Pattern | What to do |
|---|---|
| Ternary over token literals: `bg={x ? '$a' : '$b'}` | Codemod rewrites literal trees in place; verify, don't touch |
| Dynamic value inside a condition object: `hoverStyle={{ bg: x ? undefined : '$a' }}` | Lift the branch outside the clause string, or make it a variant |
| Conditional spreads carrying style objects | Convert the spread object's values; never reorder the spread itself |
| Functional variants | Codemod brands spread and type keys; resolve its catch-all, mixed-branch, body-shape, and sibling-prop flags |
| Token in a module constant: `const R = '$6'` | Migrate the constant, then its users |
| Tokens embedded in composite strings (shadows, gradients) | Bare name for named tokens; resolved CSS value for numeric ones |
| Shadow/text-shadow/transform part conditions | Rebuild as one complete `boxShadow`, `textShadow`, or `transform` value |
| `exitStyle` in shared or web files | Keep it authored; `exit:` only evaluates on native |
| `x`/`y` offsets with a custom config | v2 `$4` used the size scale, v3 `4` uses space; review if the scales differ |
| Group size conditions: `$group-card-maxMd` | Becomes `@max-md/card:` plus `container="card"` on the declaring ancestor; the container owner must be provable |

### Manual playbook for functional variants

The codemod rewrites the six spread token categories and the
`':number'` / `':string'` / `':boolean'` keys. It adds token type imports, unions
type keys, and emits `typeof` branches when different bodies each return one
object literal. Keep the surrounding `as const`.

Resolve the functional-variant report flags:

- **`extras.props` to `.resolve`:** Use the generated draft. Declare the consumed prop with `styled.dynamic<T>()`, then move sibling-prop styles to `.resolve((props, env) => ({ ... }))`.
- **Mixed variants:** Replace exact keys plus a function key with one dynamic or separate exact variants.
- **Catch-all variants (`'...'`):** Choose the real value type, then use `styled.dynamic<YourValue>((value, env) => ...)`.
- **Different non-literal bodies:** Combine the callbacks by hand. Automatic `typeof` branches require one object-literal return per body.
- **Static shape rule:** Return static keys and use `undefined` for inactive values. Dynamic spreads and computed keys deopt compiler extraction.

### Remove runtime prop-resolution hooks

Remove `useProps`, `useStyle`, and `usePropsAndStyle`. V2 could spread one style
across its base prop, pseudo-style objects, media objects, and platform objects,
so these hooks gathered multiple objects into resolved props and styles. V3
keeps every base and conditional clause for a style on that style's single
property, such as `opacity="1 hover:0.7 sm:0.8"`.

Keep that property on a styled Tamagui component. Behavior wrappers should read
or forward only the authored property they need. When a wrapper must partition
authored props, `splitStyleProps(props)` returns `[styleProps, regularProps]` in
one pass. Pass `{ expandShorthands: true }` to canonicalize selected keys. A
filter map selects only its canonical keys and leaves rejected style props in
the second object. A filter callback receives
`(key, value, originalKey, isStyleProp)` for dynamic selection.

If a configured shorthand is allowed for one property, use
`getExpandedShorthand(key, props)` from `@tamagui/core`. Neither helper resolves
tokens or selects an active conditional clause. Use `useMedia()` or `useTheme()`
when behavior itself needs active responsive or theme state.

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
7. If the running app logs
   `<Theme ${key}=...> no longer accepts inline values. Wrap the subtree in
   <ThemeUpdate ${key}=...> instead.`, do not patch `node_modules`. `<Theme>`
   only owns the reserved keys in `@tamagui/helpers` `reservedThemeProps`
   (`name`, `className`, `disable`, ...). Style values belong on
   `<ThemeUpdate>`. The flat-values codemod and `tamagui check --styles-only`
   only see authored JSX; a green report does not prove the warning is gone.
   Search `styled(Theme`, `<Theme {...`, and compiler/bundler output for the
   key. If there is no source owner, record it as a transformed-prop gap and
   keep going; do not invent a `ThemeUpdate` wrapper around a guessed parent.
8. Audit custom CSS against the v3 specificity change (ordinary base rules
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

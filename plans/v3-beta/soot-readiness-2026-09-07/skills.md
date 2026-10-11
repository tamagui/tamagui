# v3 LLM-facing material: accuracy audit

Scope: `skills/tamagui/` (SKILL.md + 3 references), `skills/tamagui-upgrade-v3/`
(SKILL.md + 2 references), and the CLI prompt generators in `code/core/cli/src`
(`generate-prompt.ts`, `setup-prompt.ts`, `migrate.ts`, `upgrade.ts`).
Repo `/Users/n8/tamagui`, branch `v3-beta` at `7fb616872a`. Read-only; nothing
edited, nothing committed.

Audience assumption: this material is fed to **smaller models** inside the Soot
factory, which copy example code far more literally than they reason about it.
Every finding below is weighted by "will a small model emit this verbatim".

---

## Verdict

**`skills/tamagui/SKILL.md` is not safe to ship to a code-generation factory as
written.** It is broadly right about architecture and wrong in exactly the places
a small model copies: media-key spelling, longhand vs shorthand props, control
sizes, the color ramp, `ThemeUpdate`, and the entire `transition` object grammar
in its animations reference. Five of those are silent failures at runtime, not
type errors.

`skills/tamagui-upgrade-v3/` is much better: the process framing is sound, the
flag playbook is accurate against the codemod source, and the v5-vs-v6 value
drift section is genuinely load-bearing. It has one wrong recipe (`exitStyle`)
and six uncovered flag codes.

`tamagui migrate --from v2` is accurate but incomplete against the docs it claims
to supersede. `tamagui setup` is the best-written artifact of the whole set and
contains one type error against the config it tells you to create.
`tamagui generate-prompt` is 40% color-token dump and ships three broken examples.

The single highest-leverage fix is not in the skill at all: **`code/tamagui.dev/data/docs/guides/flat-values.mdx`
(8,188 chars, ~2,050 tok) is already the correct, complete, compact statement of
the v3 grammar.** The skill should link to it or inline it and delete its own
worse version.

---

## 1. Blocking defects — wrong code a small model will copy

### 1.1 `gtMd:` media keys, and a false ordering rule (`skills/tamagui/SKILL.md:435-443`)

```tsx
### ❌ Wrong media query order
// bad - base value overrides responsive
<View padding="gtMd:8 4" />
// good - base first, then responsive overrides
<View padding="4 gtMd:8" />
```

Three defects in six lines, and the *"good"* line is the one that ships.

**(a) `gtMd` is not a media key anywhere in v3.** RAN
`grep -rn "gtSm\|gtMd" code/core/config/src` — zero hits. The only occurrence in
the repo is `code/core/style-grammar/src/tooling/toolingRegistry.ts:44-46`, a
legacy-recognition list for tooling. Both `@tamagui/config/v6` **and**
`@tamagui/config/v5` import the same `media` object
(`code/core/config/src/v5-base.ts:7` → `./media`), which defines
`sm/md/lg/max-sm/...`, never `gt*`.

**(b) An unregistered modifier drops the whole clause, silently.** TESTED with a
vitest probe against `code/core/style-grammar/src/tooling` `parseValue`, run twice
with different registries plus a control:

| input | registry | result |
|---|---|---|
| `4 gtMd:8` | v6-shaped (no `gt*`) | `ok:false`, `{base:"4", clauses:[]}`, error `unregistered-modifier` |
| `4 md:8` | v6-shaped | `ok:true`, `{base:"4", clauses:[{md → "8"}]}` (control) |
| `gtMd:8 4` | `gtMd` registered | `{base:null, clauses:[{gtMd → "8 4"}]}` |
| `4 gtMd:8` | `gtMd` registered | `{base:"4", clauses:[{gtMd → "8"}]}` |

So the skill's *recommended* form renders `padding: 4` at every width, with no
runtime error. Only `tamagui check` / the LSP would catch it.

**(c) The stated reason is false.** `padding="gtMd:8 4"` does not mean "base
overrides responsive" — row 3 above shows the trailing `4` is swallowed into the
`gtMd` payload (`"8 4"`) and there is no base at all. This matches
`code/core/style-grammar/src/__tests__/valueParser.test.ts:161-165` ("a clause
payload runs to the next clause"). And the base can never override a matching
clause anyway: `evaluateProgram.ts:85` returns `value.base` only when no clause
matched.

The section teaches a mental model ("source order decides") that the runtime does
not implement. See §5.1.

### 1.2 Every longhand style prop in the skill is a type error under stock v6

RAN, against the built config:

```
$ node -e "const c=require('code/core/config/dist/cjs/v6.cjs'); ..."
onlyAllowShorthands = true
sizes = [ 'default', 'xs', 'sm', 'md', 'lg', 'xl' ]
media sample = { minWidth: 640 } { maxWidth: 639.98 }
```

`code/core/web/src/types.tsx:2196` — `OnlyAllowShorthands extends true ?
WithThemeValues<MaybeOmitLonghands<Omit<A, Longhands>>> ...`. With
`onlyAllowShorthands: true` the 35 longhands that have a v6 shorthand are
**removed from the accepted prop type**:

```
alignContent alignItems alignSelf background borderRadius bottom flexGrow
flexShrink height justifyContent left margin margin{Bottom,Horizontal,Left,
Right,Top,Vertical} max{Height,Width} min{Height,Width} padding padding{Bottom,
Horizontal,Left,Right,Top,Vertical} right textAlign top userSelect width zIndex
```

Counted longhand uses in the skill bundle: **SKILL.md 40, components.md 10,
configuration.md 22, animations.md 3 — 75 total.** `padding: '4'` in the very
first `styled()` example (SKILL.md:45), `<YStack gap="4" padding="4">` (:157),
`justifyContent="space-between" alignItems="center"` (:158), `borderRadius: '4'`
(:47).

`code/core/cli/src/setup-prompt.ts` has the same bug in the config it just wrote:
line 48-51 creates `createTamagui(defaultConfig)` from `@tamagui/config/v6`, then
line 72 emits `<View width={200} height={200} bg="background" />` — `width` and
`height` are both omitted.

The repo's own v6 starter gets this right
(`code/starters/remix/app/routes/_index.tsx:45-46,95`: `p=` `bg=` `minH=`
`justify=` `mt=` `pt=`), so the constraint is real and observed, not theoretical.
`generate-prompt.ts:60-64` also handles it correctly via `getPropName`.

This is a type error, not a silent failure, so it is loud — but it means a factory
model's first output fails typecheck on every component.

### 1.3 `skills/tamagui/references/animations.md:119-140, 236-243` teaches the removed v2 transition grammar

`code/core/web/src/types.tsx:1665` — *"`transition` accepts a string or an object,
and nothing else."* `TransitionConfig` keys (:1639-1662): `preset duration bounce
easing delay behavior properties spring enter exit`, plus per-property keys.

The reference teaches, as current v3:

```tsx
transition={['fast', { opacity: { type: 'timing', duration: 500 },
                       scale: { overshootClamping: true } }]}   // array form: removed
transition={{ default: 'fast', enter: 'medium', exit: 'quick', delay: 100 }}  // `default`: removed
transition={['medium', { opacity: { overshootClamping: true } }]}  // line 238, again
```

`how-to-upgrade.mdx:1088-1105` lists every one of these as a v2→v3 removal:
"The v2 array form, the `default` key, the per-property `type` key, inline spring
physics, and the `animateOnly` prop are all gone." Correct v3 spellings from the
same table: `transition={{ preset: 'quick', opacity: 'lazy' }}`,
`transition="quick"`, `transition={{ x: 'bouncy' }}`,
`transition={{ x: { preset: 'bouncy', spring: { overshootClamping: true } } }}`.

This is the single most-copied file in the bundle for animated UI, and it is
teaching v2.

### 1.4 `ThemeUpdate` example is semantically wrong, in two files

`skills/tamagui/SKILL.md:188` and `skills/tamagui-upgrade-v3/references/hard-cases.md:290`:

```tsx
<ThemeUpdate borderTopLeftRadius={8}>{children}</ThemeUpdate>
<ThemeUpdate borderTopLeftRadius={8} background="background">{children}</ThemeUpdate>
```

`code/core/web/src/views/ThemeUpdate.tsx:26-32` — `ThemeUpdateProps` is keyed by
`Exclude<ThemeKeys, ReservedThemePropName>`, i.e. **theme value names**, not style
props. Under the v6 theme pack the key set is
`color1..color11` + `background background-{hover,press,focus} border-color{,-hover,-press,-focus}
color{,-hover,-press,-focus} placeholder-color outline-color shadow-color
accent-background accent-color` (RAN: `code/core/themes/src/generated.ts:101-130`).
`borderTopLeftRadius` is not among them.

`getInlineValuesFromProps` (`code/core/web/src/helpers/variables.ts:627-641`)
accepts any non-reserved key, so this compiles into a CSS variable nothing reads.
INFERRED (read the type + the impl; did not render it): the example is a no-op
plus a type error.

Real usage, RAN `grep -rn "<ThemeUpdate" code/kitchen-sink/src`:
`ThemeUpdateCase.tsx:20` → `<ThemeUpdate caseAccent="rgb(1, 2, 3)">`. A theme key,
a color value. The dist also shows ThemeUpdate values accept flat clauses limited
to theme and platform modifiers ("only theme (`dark:`) and platform (`ios:`)
modifiers work") — not documented anywhere in the skills.

### 1.5 `color12` does not exist; the "12-step scale" is v5

`skills/tamagui/SKILL.md:196-201` teaches a "12-step color scale convention" with
`color11-12: text`. RAN `grep -c "color12" code/core/themes/src/generated.ts` → 0.
The v6 pack has `color1`..`color11` (`generated.ts:3-13`, `ks[]` at :101-112).
`how-to-upgrade.mdx:333-345` and the CLI migrate prompt both say the v2 12-step
ramp compresses to 11 in v6, with `color12 → color11`.

`skills/tamagui/references/configuration.md:103` gets this right (`color1`-`color11`),
so the two files in the same skill disagree.

### 1.6 `<Button size="large">` — not a valid control size

`skills/tamagui/SKILL.md:578` (Quick Reference) and
`skills/tamagui/references/components.md:273` (`<Spinner size="large">` is fine —
Spinner really does take `'small' | 'large'`, `code/ui/spinner/src/Spinner.tsx:8`
— but Button does not).

Control sizes are `xs sm md lg xl`, default `md` (RAN, runtime:
`sizes = [default, xs, sm, md, lg, xl]`). `code/core/size/src/index.ts:144-152`:
an unknown name logs `Unknown size "large": not a named size (...)` in dev and
**silently falls back to the default**. So `size="large"` renders a plausible
button that is not the size the model asked for.

Related: `components.md:38,51,252` use `<Button size="4">`, `<Input size="4">`,
`<Avatar size="6">`. `how-to-upgrade.mdx:781-800` calls this out explicitly —
under v6, `size="4"` on a control is "an honest 16px minHeight, almost certainly
not what you meant". The named sizes never appear anywhere in `skills/tamagui/`.

### 1.7 `exitStyle` recipe is wrong and produces dead code

`skills/tamagui-upgrade-v3/SKILL.md:345` and `references/hard-cases.md:235-243`:

> `exitStyle` in shared or web files → Keep it authored; `exit:` only evaluates on native
> ```tsx
> <View opacity="0.5 enter:0" exitStyle={{ opacity: 0 }} />
> ```

Contradicted by the codemod's own tests,
`code/core/style-grammar/src/__tests__/clauseCapability.test.ts`:
- :19-23 "exit is native-evaluable and **web-lowerable**", `capability.web === true`
- :49 `expect(clauseCapability('exit','state').web).toBe(true)`
- :67-73 "exit is supported in **shared** files when the host is known" → verdict `clean`

The web lowering selector is `.t_exiting`
(`code/core/style-grammar/src/runtime/stateModifiers.ts:42`).

And the advice is actively harmful: RAN
`grep -rn "exitStyle" code/core/web/src code/ui/animate-presence/src` → **zero
matches**. v3 has no `exitStyle` handling at all. `how-to-upgrade.mdx:1449`
confirms the behavior: "v3 forwards an unrecognized `hoverStyle` prop". So
following this recipe leaves an inert prop and a permanently broken exit
animation, with nothing to catch it.

---

## 2. API claim verification (the requested checklist)

RAN greps; file:line is the proof.

| Claim in `skills/tamagui/SKILL.md` | Verdict | Evidence |
|---|---|---|
| `style()` exists, exported from `tamagui` | ✅ | `code/core/web/src/style.ts:76`; re-export `web/src/index.ts:78`; `tamagui` barrel `code/ui/tamagui/src/index.ts:301` (in the `@tamagui/core` value block) |
| `styled.dynamic` | ✅ | `code/core/web/src/styled.tsx:199-202`; types `web/src/types.tsx:3270-3284` |
| `.resolve()` on a styled component | ✅ | `code/core/web/src/createComponent.tsx:2259-2274`; `StyledResolver` `types.tsx:3291-3294` |
| Precedence `0 base < 1 variants < 2 resolvers < 3 callsite props < 4 style` | ✅ exact | `code/core/web/src/helpers/getSplitStyles.tsx:450-457` (`sourceLayerBase..sourceLayerStyle` = 0..4) |
| `StylePiece` on `activeStyle` (Checkbox, ToggleGroup.Item, Tabs.Tab) | ✅ | `code/ui/checkbox/src/Checkbox.tsx:60,65`; `code/ui/toggle-group/src/Toggle.tsx:59`; `code/ui/tabs/src/Tabs.tsx:98` |
| `contentContainerStyle: StylePiece` on ScrollView | ✅ | `code/ui/scroll-view/src/ScrollView.tsx:23`, `.native.tsx:10` |
| `ThemeUpdate` exported from `tamagui` | ✅ (usage wrong, see §1.4) | `code/ui/tamagui/src/index.ts:149` |
| `<Theme>` reserved-keys warning text | ✅ verbatim | `code/core/web/src/views/Theme.tsx:38-41`; `reservedThemeProps` in `code/core/helpers/src/reservedThemeProps.ts:10` |
| `createStyledHOC` replaces `.styleable` | ✅ | `code/core/web/src/createStyledHOC.tsx:14`; `grep -rn "\.styleable" code/core/web/src code/ui/tamagui/src` → 0 |
| `html.*` is a Tamagui component surface | ✅ (but absent from the skill, §3.1) | `code/core/web/src/index.ts:296`; `tamagui` barrel `code/ui/tamagui/src/index.ts:275-277` |
| `transition` prop | ✅ | `code/core/web/src/types.tsx:2706`, `TransitionProp` :1679 |
| "`transition` is the v2+ name, `animation` was v1" | ✅ | `how-to-upgrade.mdx:1098` shows v2 already using `transition={[...]}` |
| `Sheet.Container` / `Sheet.Background` | ✅ | `code/ui/tamagui/src/components/Sheet.tsx:54,63,79-84,104` |
| `Adapt when="max-sm" platform="touch"` | ✅ | `code/ui/adapt/src/Adapt.tsx:126-127,635`; `max-sm` in `code/core/config/src/media.ts:39` |
| Named sizes sm/md/lg | ✅ exist (skill never mentions them, §1.6) | `code/core/config/src/v6-base.ts:228-235`; runtime `[default,xs,sm,md,lg,xl]` |
| v6 media keys `sm:` `max-sm:` `touchable` `hoverable` | ✅ | `code/core/config/src/media.ts:21-33,39,53`; runtime `sm={minWidth:640}`, `max-sm={maxWidth:639.98}` |
| Bare tokens (`'4'`), kebab theme keys (`background-hover`) | ✅ | `code/core/themes/src/builder.ts:25-42`; `generated.ts:113-129` |
| `@tamagui/tailwind` exports `View Text html styled` + vite plugin | ✅ | `code/core/tailwind/src/index.tsx:23,25,32,34`; `vite.ts:195 tamaguiPlugin` |
| `styled(View, 'p-4 rounded', { variants })` | ✅ | `code/core/tailwind/src/styled.tsx:23-33` |
| `animationsCSS` from `@tamagui/config/animations-css` | ✅ | `code/core/config/src/animations-css.ts:4` |
| `animatedBy` prop | ✅ | `code/core/web/src/types.tsx:386` |
| `Slider.TrackActive` | ✅ | `code/ui/tamagui/src/components/Slider.tsx:55` |
| 12-step ramp / `color12` | ❌ | §1.5 |
| `gtMd:` media key | ❌ | §1.1 |
| `<Button size="large">` | ❌ | §1.6 |
| `transition={[...]}` / `{ default: ... }` | ❌ | §1.3 |
| `<ThemeUpdate borderTopLeftRadius={8}>` | ❌ | §1.4 |
| `<Select.Item index={0}>` (`components.md:216,219`) | ❌ stale | `code/ui/select/src/SelectItem.tsx:60-67` destructures `value, disabled, textValue` only; `index` falls through to `restProps`. `how-to-upgrade.mdx:1015-1022` shows v3 Select.Item with no `index`, and `:520` greps for `Select\.Item.*index` as a removal. INFERRED (read the destructure; did not render) |

---

## 3. What the skill omits that a generating model needs

Ranked by how often a factory will hit it.

### 3.1 `html.*` — zero mentions in the entire skill

RAN: `grep -c "html\." skills/tamagui/**` → 0 in all four files. `grep -rn "unstyled\|@tamagui/ui" skills/` → 0 across both skills.

Meanwhile `flat-values.mdx` writes **every single example** as `<html.div>`, and
`skills/tamagui-upgrade-v3/SKILL.md:77` warns against "wholesale `html.*`
conversion" without ever saying what `html.*` is. A model that reads the upgrade
skill and then the docs sees an undefined symbol in every example.

Missing with it: the three-surface distinction that decides what a generated file
imports —
- `tamagui` = styled v2-look skins (`code/ui/tamagui/src/index.ts:55-60`)
- `tamagui/unstyled` = `@tamagui/ui`, behavior + structural styles only, **no size scale at all** (`code/ui/ui/src/index.ts:1-11`; `how-to-upgrade.mdx:833`)
- `@tamagui/tailwind` = className authoring
- `html.*` = DOM contract elements on the Tamagui runtime
- per-component subpaths (`tamagui/button`, `tamagui/toast`) — `how-to-upgrade.mdx:120-130`

### 3.2 The precedence rules — stated, but wrong (§1.1c, §5.1)

The correct rule, RAN `code/core/style-grammar/src/runtime/clausePrecedence.ts:24-40, 50-56`:
packed key = **platform rank**, then **number of conditions in the clause**, then
**category rank** (media 1 < container 65 < theme 129 < group 161 < state 225),
with authored order breaking exact ties only (`evaluateProgram.ts:28-31, 79-84`).
Within media, the config's declaration order decides, which is why min-width beats
max-width and height queries beat width queries (`media.ts:49, 59-61`).

`setup-prompt.ts:107-111` already states this correctly and completely. The skill
contradicts it.

### 3.3 Escaping a literal that collides with a token name

Nowhere in either skill. The rules, RAN `code/core/style-grammar/src/ast/resolvePayload.ts:9-22, 341-347`
and `ast/valueTypes.ts:115-124`:
- config wins over a same-spelled CSS literal, always
- **a unit or `%` makes it literal**: `4px`, `50%` never look up
- a bare number resolves only as a *whole* component value, and only when the
  property binds a numeric token category — `4 8` resolves both, `0 2px` resolves
  neither
- never inside a string, an unquoted `url()`, a function *name*, or a `--custom-property`
- exactly 8 idents always bypass lookup: `inherit initial unset revert none auto transparent currentColor`
- **qualified form to pick a scale**: `width="size.4"`, `color="color.blue-500"`
  (`flat-values.mdx:62-66`) — the closest thing to an escape hatch, and the single
  most useful missing line

### 3.4 Numeric vs string

`flat-values.mdx:68-73`: `p="4"` is the space token; `p={4}` is 4 CSS px on web /
4 points on native. The skill says "tokens are bare" and its anti-pattern section
(:374-382) says hardcoded numbers are bad, but never states the rule, so a model
has no way to write a deliberate raw pixel value.

### 3.5 Custom media keys, group and container clauses

The skill's only mention of groups/containers is a prohibition (SKILL.md:75).
Missing entirely:
- `group` and `container` are now **separate** props: `<View group="card" container="card">` (`how-to-upgrade.mdx:69-92`)
- `group-hover/card:` (state) vs `@sm/card:` (size) — `flat-values.mdx:120-137`
- "Plain `sm:` is a viewport query. `@sm:` measures the nearest query container."
- `webContainerType` removed from `createTamagui`

### 3.6 Other real omissions

- **Merging semantics** (`flat-values.mdx:104-115`): `<View p="4 sm:6" px="2" />` → left/right base 2, `sm` clause survives. A model reasoning about prop order needs this.
- **Empty payload is invalid**; clear with `none`/`transparent`/`initial`/`unset` (`flat-values.mdx:41-43`).
- **Never put clauses in raw `transform`**; use the flattened family (`flat-values.mdx:45-49`).
- **`tamagui setup` exists.** RAN `node dist/index.cjs --help` → commands include `setup`. Neither skill mentions it; SKILL.md sends you to `generate-prompt` instead.
- **`render` prop** for element tag (`code/starters/remix/app/routes/_index.tsx:46`: `<View render="header">`).
- **`tamagui check`** — mentioned in the upgrade skill and setup prompt, absent from `skills/tamagui/SKILL.md`, which is the one a code-gen loop would load.

---

## 4. `tamagui generate-prompt` — assessment

RAN in two projects (dist is current: `dist/generate-prompt.cjs` Aug 28 vs
`src/generate-prompt.ts` Aug 27; `dist/migrate.cjs` Sep 6 vs `src/migrate.ts` Sep 6).

| project | chars | ~tokens | notes |
|---|---|---|---|
| `code/kitchen-sink` | 16,285 | ~4,070 | v6-ish config |
| `code/tamagui.dev` | 8,424 | ~2,110 | v5-style config |

Accurate to the config: **yes**, for the vocabulary it dumps. Kitchen-sink's media
list, token values, shorthands and themes all match. The tamagui.dev run is the
useful one: it correctly reports `sm: {maxWidth: 800}` and `gtSm: {minWidth: 801}`
— i.e. on that project `sm:` means the **opposite polarity** from v6. This is the
strongest argument for the per-project prompt existing, and for the skill never
hard-coding a breakpoint claim.

### Defects

**(a) `generate-prompt.ts:462` — hardcoded example that contradicts the document
it is in.**

```tsx
<View backgroundColor="blue5" color="gray12" />
```

Kitchen-sink lists `blue-500` and `gray-950` (lines 302-370 of the output);
`blue5`/`gray12` are v5 spellings and appear nowhere in the token list. On
**tamagui.dev the Color Tokens section is entirely empty** and the example still
prints. A small model reading "here are your color tokens: `blue-500`…" followed
by "usage: `backgroundColor="blue5"`" will copy the example.
Also `backgroundColor` itself is type-rejected under stock v6 (§1.2) — the
generator applies `getPropName` to the other three examples but this line escapes
it for the *values*, and `backgroundColor` has no v6 shorthand so it survives.

**(b) `generate-prompt.ts:497` — emits invalid JavaScript.**

```tsx
const media = useMedia()
if (media.height-lg) {      // parses as (media.height) - lg
```

It picks `mediaEntries[0]` after an alphabetical sort, so for v6 configs the
example key is `height-lg`. Needs `media['height-lg']`, and should pick a
representative key (`sm`/`md`) rather than the alphabetically first.

**(c) Empty sections print anyway.** Kitchen-sink emits `### Z-Index Tokens`
followed by nothing; tamagui.dev emits an empty `### Color Tokens`. A model reads
that as "this project has no color tokens" and then sees an example using two.

**(d) The Components list is the compiler's discovered-`styled()` list, not an
import surface.** Kitchen-sink output lists `View` **twice** (lines 863-864),
includes internals nobody should import (`SelectScrollButtonFrame`,
`PopperArrowFrame`, `DialogPortalFrame`, `AvatarFallback.Frame`), and RAN
`grep -n "^- Dialog$\|^- Sheet$\|^- Popover$\|^- Select$\|^- Adapt$\|^- Theme$"`
→ **zero hits**. The compound roots people actually import are all absent while
their private frames are listed. That is worse than omitting the section.

**(e) ~40% of the budget is the color dump.** Lines 288-599 of 871. For a factory
this is the wrong tradeoff: 11 palettes × 11 shades is derivable from "Tailwind
palette, `<name>-<50..950>`" in one line, and the space/size tokens print both
`2.5` and `2-5` aliases for every half-step.

**(f) No grammar at all.** The document lists vocabulary and never states
`value := base? clause*`, never shows `hover:`/`dark:`/`enter:`, never mentions
`transition`. A model given only `tamagui-prompt.md` writes v2 syntax with v3
token names. That is fine *if* the skill carries the grammar — but the skill's
grammar is the part that is wrong (§1.1).

**(g) Does it contradict the skill?** Yes, on the one thing that matters:
kitchen-sink reports `Only Allow Shorthands: false` and prints longhand examples;
a stock-v6 project reports `true` and prints `**You MUST use shorthand
properties**` with `<View w="10" />` — while the skill uses longhands throughout.

---

## 5. `tamagui migrate --from v2` — assessment

RAN in `code/kitchen-sink`: exit 0, 15,247 chars / 326 lines, ~3,810 tokens.

**Accuracy: good.** Every API replacement I spot-checked is real —
`Component.styleable(fn)` → `createStyledHOC(Component, fn)` (verified §2),
`Sheet.Frame` → `Sheet.Container` + `Sheet.Background` (verified §2),
`onDidAnimate` → `onTransition` with the `{phase, cause}` shape
(`code/core/web/src/types.tsx:1694-1700`), `useProps`/`useStyle`/`usePropsAndStyle`
removal and the `splitStyleProps` / `getExpandedShorthand` replacements
(`code/core/web/src/index.ts:41-48, 15`).

**No contradictions with `how-to-upgrade.mdx`** — the prompt is a strict subset,
worded from the same source. The one place they read differently in a way that
matters to a model: the guide's opening Notice says v3 "**defaults to Config v6**"
while the prompt's step 0 and the skill both say "stay on v5". Those are
consistent in intent (new apps vs migrating apps) but a small model will read the
first sentence and switch configs.

**Incompleteness is the real problem**, because
`skills/tamagui-upgrade-v3/SKILL.md:48` calls this prompt "the checklist of
record". It has 15 steps against the guide's 20 sections. RAN `grep -c` over the
captured output — the following are **absent from the CLI prompt entirely**:

| missing | docs section | why it matters |
|---|---|---|
| `transition` value grammar (array form, `default` key, per-property `type`, `animateOnly`, `bounciness`/`speed`, preset renames) | §13, `:1088-1155` | 0 hits for "transition" (lowercase) in the output; only `onTransition`. This is the largest single omission — every animated component in a v2 app hits it |
| `group` / `container` split, `webContainerType` removal | "Declare query containers separately", `:69-105` | 0 hits for "container" |
| named control sizes `xs..xl`, `size="$4"` meaning change under v6 | §5, `:755-836` | 0 hits for "named size" |
| `createTamagui({ defaultProps })` deprecation | §17, `:1266` | 0 hits for "defaultProps" |
| imperative Toast migration | §18 | 0 hits for "Toast" |
| `ThemeableStack` / `SizableStack` | §19 | 0 hits |
| active-state background colors | §15 | 0 hits for "backgroundActive" |

Also: `code/core/cli/src/upgrade.ts:590-598` — after bumping every `@tamagui/*`
package across a major, "Next steps" says *install, review the changelog, test
your application*. It never mentions `tamagui migrate --from v2` or the codemod.
An agent driving `tamagui upgrade` lands on v3 with v2 source and no pointer.

`tamagui setup` (4,398 chars, ~1,100 tok) is the best-written artifact here:
correct precedence ladder, correct grammar, honest about the compiler being
optional, honest that typecheck is not proof. Its one bug is §1.2.

---

## 6. Consistency matrix across the four artifacts

| topic | `skills/tamagui` | `skills/tamagui-upgrade-v3` | CLI prompts | docs |
|---|---|---|---|---|
| **media key naming** | ❌ `gtMd:` in the anti-pattern; `sm:`/`max-sm:` elsewhere | ✅ `sm:` `max-md:` | ✅ generated per-project (correctly shows `gtSm` on v5 projects) | ✅ `sm:` `md:` `max-md:` |
| **clause resolution** | ❌ "later props override earlier"; order-based anti-pattern | ⚠️ "More-specific wins; authored order breaks ties" (right, one line) | ✅ full ladder, `setup-prompt.ts:107-111` | ⚠️ `flat-values.mdx:26` says "**the last matching clause wins**" — contradicts the specificity model |
| **`$` sigil** | ✅ bare everywhere | ✅ removal is the premise | ✅ "No `$` sigils" | ✅ |
| **`hoverStyle` removal** | ✅ "do not author pseudo… style objects" | ✅ codemod + grep-back | ✅ "there is no `hoverStyle={{...}}`" | ✅ + the fact nobody else states: **v3 silently forwards it** (`:1449`) |
| **Theme style props** | ⚠️ right rule, wrong example (§1.4) | ⚠️ same wrong example | — (not covered by migrate prompt) | ✅ |
| **`defaultProps`** | ❌ absent (uses `defaultVariants`, which is correct and different) | ❌ absent | ❌ absent | ✅ §17: `createTamagui({defaultProps})` deprecated |
| **`styleable`** | ❌ absent | ✅ in the Phase-0 inventory grep | ✅ `→ createStyledHOC` | ✅ |
| **color ramp** | ❌ "12-step", `color12` | ✅ "v6 has 11 steps where v5 had 12" | ✅ full remap table | ✅ |
| **`onlyAllowShorthands`** | ❌ 75 longhand uses | ❌ absent | ✅ generate-prompt handles it; ❌ setup-prompt violates it | — |
| **linting/LSP tool** | ❌ absent | `@tamagui/language-service` (tsserver plugin) | — | `@tamagui/lsp` (stdio LSP binary) |

Both LSP packages are real (`code/core/language-service/package.json:2`,
`code/lsp/npm/tamagui-lsp` → `@tamagui/lsp`), so this is a "which one do I
install" ambiguity, not an error.

### Flag-playbook parity

`skills/tamagui-upgrade-v3/references/flag-playbook.md` is **accurate** — RAN a
parity check of all 26 codes it names against `code/core/codemod-flat-values/src`;
every one exists. But six codes exist in the codemod and are **not** in the table:

```
ambiguous-legacy-group   legacy-condition-object   legacy-transform-part
sheet-frame-spread       sheet-frame-styled        unsupported-legacy-value
```

`unsupported-legacy-value` appears in 4 source files. The playbook's exit
condition is "zero unresolved flags", so a model hitting one of these has no
action and no way to close the loop.

---

## 7. Verbosity and the ideal shape

### Measured

| artifact | chars | ~tokens |
|---|---|---|
| `skills/tamagui/SKILL.md` | 17,351 | 4,340 |
| + its 3 references | 17,501 | 4,375 |
| **tamagui skill total** | **34,852** | **8,713** |
| `skills/tamagui-upgrade-v3/SKILL.md` | 23,753 | 5,938 |
| + its 2 references | 14,381 | 3,595 |
| **upgrade skill total** | **38,134** | **9,533** |
| `tamagui generate-prompt` (kitchen-sink) | 16,285 | 4,070 |
| `tamagui migrate --from v2` | 15,247 | 3,810 |
| `tamagui setup` | 4,398 | 1,100 |
| `flat-values.mdx` | 8,188 | 2,047 |
| `how-to-upgrade.mdx` | 57,815 | 14,454 |

`skills/tamagui/SKILL.md` by section:

```
Core Concepts        6029 ~1507   Anti-Patterns      3307 ~826
Working in Existing  1622  ~405   Common Patterns    1459  ~364
Compound Components  1015  ~253   Compiler Opt       1007  ~251
Migrating Existing    915  ~228   Getting Config      494  ~123
Quick Reference       477  ~119   TypeScript          376   ~94
```

### What to cut from `skills/tamagui/SKILL.md`

- **Anti-Patterns (826 tok) — cut to ~150.** Six of eight are generic advice
  ("use tokens", "add `as const`") that a model already does. The `gtMd` one is
  actively wrong (§1.1). The two worth keeping (`styled.dynamic` sibling props,
  `style()` in render) belong in a `styled-dynamic.md` reference, since a model
  writing screens never touches either.
- **Dynamic Variants and Component Resolvers (~450 tok) → reference.**
  `styled.dynamic` + `.resolve` are design-system-author APIs. A factory
  generating screens will never write one and can be actively harmed by trying.
- **Compound Components (253 tok) → reference.** Same reasoning.
- **Compiler Optimization (251 tok) → delete.** "Look for `data-tamagui`
  attributes" is not something a generator can act on.
- **TypeScript (94 tok) → reference.** `GetProps` is four lines nobody needs inline.
- **Working in an Existing App (405 tok) — keep, move to the top.** This is the
  best-calibrated section in the file, and rule 1 ("use the project's wrapper
  layer, not raw Tamagui imports") is the single most valuable sentence for Soot
  specifically, where the factory should be emitting against Soot's own
  `interface/` wrappers, not `tamagui` directly.

That is ~1,500 tokens out of ~4,340, before adding the missing grammar.

### Where a small model most likely produces wrong v3 syntax

Ranked, from the defects above:

1. **Longhand props** — 75 examples to copy, type-fails immediately (§1.2)
2. **`gtMd:` / order-based media reasoning** — silent, renders wrong (§1.1)
3. **`transition={[...]}` object grammar** — silent, animations do nothing (§1.3)
4. **`size="large"` / `size="4"` on controls** — silent, wrong size (§1.6)
5. **`color12`** — silent, falls through to literal CSS (§1.5)
6. **`ThemeUpdate` with style props** — silent no-op (§1.4)
7. **`exitStyle` retained on web** — silent, exit animation never runs (§1.7)

Six of seven fail silently. Typecheck catches only #1 and partially #6. This is
exactly the case for the `valid-flat-values` lint rule / LSP in the factory loop,
which `skills/tamagui/SKILL.md` never mentions (only the upgrade skill does,
`:445-447`).

### Proposed shape

**`SKILL.md` (target ~1,200 tok, down from 4,340) — only what is true for every
project and needed on every file:**
1. Get the project prompt first: `npx tamagui generate-prompt` → `tamagui-prompt.md`. Never guess a breakpoint or token name.
2. The grammar in ~15 lines, lifted from `flat-values.mdx:19-49`: `value := base? clause*`; string = config lookup, number = raw platform value; a unit/`%`/quote/`--var` forces literal; qualified `size.4` picks a scale; kebab built-in names; empty payload invalid.
3. The **real** precedence rule (platform → condition count → category), lifted verbatim from `setup-prompt.ts:107-111`. Delete "later props override earlier".
4. Modifier table (`flat-values.mdx:88-99`) — 8 rows, ~80 tokens, complete.
5. Which package to import from: `tamagui` / `tamagui/unstyled` / `@tamagui/tailwind` / `html.*`, three lines each — **or, in an existing app, the project's own wrapper layer first.**
6. Shorthand-vs-longhand: check `onlyAllowShorthands` in `tamagui-prompt.md`; under stock v6 it is `true` and longhands are type-rejected.
7. Named control sizes `xs sm md lg xl`, default `md`; `size={number}` is a dev error on controls, pixels on shapes.
8. `transition` + `enter:`/`exit:` + `AnimatePresence` requires `key`.
9. Verify with `npx tamagui check` and the `valid-flat-values` rule; flat values are strings, so typecheck proves little.

**Generated per-project prompt** — everything config-specific, and it should
*shrink*: media keys with polarity spelled out in words, token scale summarized
rather than enumerated (keep the exact list only for non-derivable scales), theme
key list, named-size table, `onlyAllowShorthands` verdict, the **import surface**
(the barrel's public exports) rather than the compiler's discovered-component
list. Fix the three broken examples (§4a-c) and derive them from the config.

**References (loaded on demand):**
- `styled-dynamic.md` — `styled.dynamic`, `.resolve`, precedence tiers, `createStyledContext`, `createStyledHOC`, `GetProps`, `style()` pieces
- `components.md` — rewritten with named sizes, no `index={0}`, no `size="4"`
- `animations.md` — **rewrite against `types.tsx:1639-1700`**; delete the array form, `default`, per-property `type`, bare `overshootClamping`
- `configuration.md` — keep, it is the most accurate file in the bundle
- `grammar.md` — or simply link `flat-values.mdx`, which is already correct

**For the upgrade skill:** it is close to right. Fix the `exitStyle` recipe
(§1.7), fix the `ThemeUpdate` example (§1.4), add the six missing flag codes
(§6), and either stop calling `tamagui migrate --from v2` "the checklist of
record" or close the seven gaps in §5. Phase 2.5 (1,058 tok on v5→v6 value drift)
reads long but earns it — it is the only place in the whole corpus that explains
why a clean codemod report can still ship a visually broken app.

---

## Appendix: commands run

```
node code/core/cli/dist/index.cjs migrate --from v2        # in code/kitchen-sink, exit 0, 15247 chars
node code/core/cli/dist/index.cjs generate-prompt --output …  # kitchen-sink (16285) and tamagui.dev (8424)
node code/core/cli/dist/index.cjs setup                    # 4398 chars
node -e "require('code/core/config/dist/cjs/v6.cjs')"      # onlyAllowShorthands=true, sizes, media
npx vitest run probe-parse.test.ts                         # in code/core/style-grammar, parseValue probe ×2 registries
```

Outputs saved beside this report:
`migrate-v2.txt`, `ks-prompt.md`, `site-prompt.md`, `setup-prompt.txt`,
`parse-out.json`, `parse-out2.json`. The vitest probe file was written into
`code/core/style-grammar/` and deleted in the same command; `git status` is clean.

# Opus review: V3 web-first master spec

Reviewed 2026-09-14 against `v3-beta` at `c8134836fa`. Inputs:
`v3-web-first-master-spec.md`, `style-props-architecture-report.md`,
`web-alignment-steps.md`, `web-core-split.md`, plus the engine source they
describe. Probe scripts and raw output are in `opus-web-first-review-evidence/`
(they use absolute paths to a local playwright install and to a built v3
worktree; adjust before rerunning).

Labels: **RAN** (ran it, output quoted), **INFERRED** (from named things read or
ran), **GUESSED** (fits the shape, not run here).

## Verdict

| Question | Verdict |
| --- | --- |
| 1. Dynamic CSSOM discovery for style routing | **Reject.** Browser-dependent routing, false positives, no speed win, no byte win in the current engine. Use generated per-tag DOM prop tables instead (already proposed in `web-core-split.md`). CSSOM is fine as a dev-only diagnostic. |
| 2. Resets from JS `defaultProps` to `:where(...)` CSS | **Approve the direction, reject the proposed selector.** Bare tag selectors leak into every non-Tamagui element. Scope the rule to a class html.* hosts carry. The probe also found a bigger shipped bug: `html.p`, `html.h1`..`h6` and `html.pre` render `display: inline` on web, because html.* hosts carry `is_Text` / `is_View`. Fix that in the same change. |
| 3. Package split web -> core -> ui -> tamagui | **Approve with corrections.** No package cycle exists today. The spec diagram is wrong that `@tamagui/ui` avoids `@tamagui/core`, and the split as written would create a web -> core cycle unless html.* stops borrowing `viewStaticConfig` / `textStaticConfig`. |
| 4. Function children on html.* | **Reject as specified.** The DOM contract already recorded this as a deliberate non-goal, and the existing `render` function prop covers the use case. Fix the prop shape `render` hands to a non-primitive on native instead of adding a second API. |

The master spec should not be treated as final. Several of its numbers and
claims are contradicted by the code or by probes; each is listed below.

---

## 1. Dynamic CSSOM discovery

### What the spec claims

`key in document.createElement('div').style`, cached in a `Map`, replaces the
static `validStyleProps` table on web: "0 KB", "2.28x faster", 685 properties,
SSR gets a static W3C dictionary via a `node` export condition, and "any
standard CSS property evaluates to true on both server and client".

### Findings

**1a. CSSOM misroutes a fifth of Tamagui's own style keys (RAN).**
`cssom-probe.mjs` checked all 281 keys from `validStyleProps.ts` +
`webOnlyStyleProps.ts` against a live `CSSStyleDeclaration`:

- Chromium 145.0.7632.6: 54 of 281 keys are not `in div.style`.
- WebKit 26.0: 48 of 281.
- Missing in both: every RN alias (`marginHorizontal`, `paddingStart`,
  `borderTopStartRadius`, `shadowOffset`, `shadowColor`, `borderCurve`,
  `writingDirection`, `start`, `end`), every transform shorthand (`scaleX`,
  `rotateY`, `skewX`, `matrix`), `textShadowOffset`, `lineClamp`,
  `experimental_backgroundImage`, `placeholderTextColor`.

The sketch in the report adds "~20 fixed shorthands" to cover this; the real
gap is ~50 keys and they are not shorthands, so a static table stays.

**1b. Routing depends on the user's browser, so SSR output cannot match (RAN).**

- `userSelect` is a style in Chromium and an attribute in WebKit 26.
- `WebkitBackdropFilter` and the six `maskBorder*` keys are styles in WebKit
  and attributes in Chromium.
- Chromium exposes 61 property names WebKit lacks (`cornerShape`,
  `interpolateSize`, `d`, ...). WebKit exposes 863 Chromium lacks (prefixed
  aliases plus `marginTrim`, `transformOriginX`, `hangingPunctuation`, ...).

Consequence: a server table cannot agree with every client. When they disagree,
the server emits an atomic class and the client emits a DOM attribute (or the
reverse). That is a hydration mismatch on `className` and on the attribute, and
on the client the property silently stops styling and becomes
`<div userselect="none">` plus a React unknown-prop warning. The report's claim
"any standard CSS property evaluates to true on both" is false for
`userSelect` in Safari today.

**1c. `in` has false positives that collide with Tamagui and HTML props (RAN).**
All of these return `true` in both engines:

- Object and CSSOM members: `toString`, `constructor`, `hasOwnProperty`,
  `cssText`, `length`, `parentRule`, `item`, `setProperty`,
  `getPropertyValue`, `cssFloat`.
- Tamagui non-style props: `transition` (the animation prop), `animation`,
  `size` (the most common variant name).
- HTML attributes: `translate` (a global attribute), `width` / `height` / `src`
  (all three are in the `@tamagui/dom` attribute tables), `content`.
- SVG and other names that are CSS properties but routinely used as props:
  `color`, `direction`, `order`, `filter`, `zoom`, `x`, `y`, `r`, `fill`,
  `stroke`, `all`.

`size` matters most: in `getSplitStyles.tsx:965` a key is only a variant when it
is not a valid style key, so a CSSOM predicate would make every `size` variant
dead on web unless variants are checked first. That ordering change is not in
the plan.

**1d. The speed claim does not reproduce (RAN).** Same 700k-lookup loop, 80
realistic keys including non-style props, three warmup passes:

| ns/op | static `key in table` | uncached `key in style` | cached `Map` probe | static `Map.get` |
| --- | --- | --- | --- | --- |
| Chromium 145 | 7.14 | 82.00 | 7.29 | 7.71 |
| WebKit 26 | 2.86 | 30.00 | 8.57 | 10.00 |

Cached CSSOM ties the static object in Chromium and is 3x slower in WebKit.
Lookup speed is not a reason to change.

**1e. The byte claim does not hold for the current engine (INFERRED from
`rg` over `code/core/web/src`).** The same tables carry more than validity:

- `stylePropsUnitless` decides whether a number gets `px`
  (`internal-runtime.ts:93`, `normalizeValueWithProperty.ts:15`).
- `stylePropsAll` feeds `splitStyleProps.ts:151` and the px key set.
- `stylePropsTransform` drives transform merging (`normalizeStyle.ts:37`).
- `stylePropsText` / `stylePropsInput` pick per-component validity
  (`getSplitStyles.tsx:1214`, `styleStaticConfigCore.ts:39`).
- All of them are public exports of `@tamagui/web` (`index.ts:335-353`).

Swapping only the `isValidStyleKey` predicate removes close to zero bytes. The
1,060 B figure in `web-core-split.md` prices deleting the whole module and is
explicitly conditioned on "a generated DOM predicate replacing it"; the master
spec reattributes it to CSSOM discovery. `validStyleProps.ts` is 5,515 bytes of
source (RAN `wc -c`), not ~7.2 KB. The spec's savings table rows sum to 4,300 B
while its 26.88 -> 19.46 kB total is 7,420 B; the difference is the
createComponent and useThemeState regions from `web-core-split.md` that the
table omits.

**1f. SSR, hydration and fallback.**

- The sketched fallback (`styleElement === null -> false`) turns every
  non-shorthand style into an attribute when no DOM exists. Any server bundle
  that resolves the `browser` condition renders unstyled HTML. Edge and worker
  bundlers commonly include `browser` in their condition list (GUESSED from
  their documented defaults, not run here), and every Tamagui package already
  ships a `browser` export pointing at the same file as `import`
  (RAN `jq .exports` on web, core, helpers).
- A module-level `document` read also caches wrong answers in test DOMs such
  as jsdom, whose `CSSStyleDeclaration` implements a different property list
  (GUESSED).
- A cached `false` is permanent for the module lifetime, so evaluation order
  matters in embeds and workers.
- None of this is fixable by a better cache: 1b is a property of the browsers.

### Recommendation

Adopt the inverted predicate from `web-core-split.md`, which is deterministic on
server, client and every browser:

1. Shorthand and alias expansion runs first (unchanged).
2. For html.* static configs: known Tamagui non-style prop, known DOM prop for
   this tag from the generated `@tamagui/dom` tables, `on*`, `data-*`, `aria-*`
   -> prop. Everything else -> style.
3. Resolve the overlaps explicitly in the generated table: `width` / `height`
   on `img`, `input`, `video`-like tags are attributes only when the tag row
   says so; `translate` is an attribute; `size` / `transition` stay Tamagui
   props.
4. Variants are checked before the style predicate for html.*.
5. View / Text in `@tamagui/core` keep the RN tables (they need the aliases).
6. Dev only: warn when an html.* prop routes to style and
   `CSS.supports(kebab, 'inherit')` is false. Browser-dependence is harmless in
   a warning.

Keep `stylePropsUnitless` / transform / text tables regardless; they are value
semantics, and CSSOM cannot answer "does this number need px".

---

## 2. CSS reset architecture

### What ships today (RAN: SSR render + computed style)

`html-ssr-render.tsx` rendered html.* through the built engine
(`tamagui-v3-sync` worktree; its `html.tsx` is byte-identical to `v3-beta` and
its `is_Text`/`is_View` class line matches) and `html-computed-layout.mjs`
measured the result in Chromium and WebKit:

```
<h1 id="h1a" class="is_Text _m-2017216831 _p-1943363302 _fs-... _fw-...">
<p id="p1" class="is_Text _m-2017216831 _p-1943363302">
<div id="d" hidden="" class="is_View _m-2017216831 _p-1943363302">
<button id="btn" class="is_View _m-... _p-... _b-...">

chromium h1a {display:"inline", top:26, left:8}   h1b {display:"inline", top:26, left:117}
chromium p1  {display:"inline", top:34, left:225} p2  {display:"inline", top:34, left:265}
chromium hiddenDiv {display:"flex"}  (visible)
chromium div padding=10 width=100 -> boxSizing "border-box", w 100
chromium btn {display:"flex"}
```

WebKit is identical. Three shipped defects:

- **2a. Block text tags are inline on web.** Text-backed tags (`p`, `h1`..`h6`,
  `pre`, `option`) get `textStaticConfig`, so `getSplitStyles.tsx:1752` emits
  `is_Text`, and `:where(.is_Text) { display: inline }` beats the browser's
  `p { display: block }` because any author rule beats the user-agent origin
  regardless of specificity. Two `html.h1` sit on one line. No test catches it
  because `conformance.test.ts` compares the tag tables, not the injected CSS.
- **2b. `hidden` does nothing on html.*.** Same mechanism: `:where(.is_View)`
  sets `display: flex` over the UA `[hidden] { display: none }`. `rg` finds no
  `hidden` handling on the web path (INFERRED).
- **2c. Web and native disagree on box sizing.** Web html.div is `border-box`
  from `is_View`; native uses `NATIVE_ELEMENT_DEFAULTS.boxSizing =
  'content-box'`. `width={100} padding={10}` is 100px wide on web and 120 on
  native (web RAN, native INFERRED from `nativeBacking.ts:107`). html.button is
  also a flex column on web.

The optional `reset.css` has the same class of bug (RAN
`reset-css-probe.mjs`): `:where(p, input, textarea, button, ul, ol, li, pre,
dialog) { all: unset }` makes a closed `<dialog>` render visibly
(`display: block`, 18px tall) and makes `<p hidden>` visible, for every element
on the page including non-Tamagui ones.

### The proposed rule

```css
:where(div, p, span, h1, ..., a, button) { margin: 0; padding: 0; border-width: 0; ... }
```

`where-cascade-probe.mjs` (RAN, both engines):

- **It overrides UA styles:** yes. Author origin beats UA origin before
  specificity is considered, so `:where()` is enough. The only exceptions are
  UA `!important` rules, which none of these tags rely on.
- **It leaks:** yes. A third-party `<button>` got `padding: 0px`,
  `border-width: 0px`; a third-party `<ul>` lost its list padding. Changing
  `border-*` on a button also drops native button appearance in Chromium.
  Any `:where(tag)` reset is global by construction.
- **Author CSS now wins over the reset:** a host rule `p { margin: 16px }`
  gives a `:where` reset element `16px`, while today's atomic default class
  holds `0px`. Markdown styles, Bootstrap-like element rules and CMS CSS will
  change html.* spacing on web only. This drops the contract stated in the
  generated `html.tsx` header ("a page renders the same whether or not a css
  reset ran").

### Recommendation

1. Stop giving html.* hosts `is_View` / `is_Text` on web. Emit one host class,
   e.g. `is_DOM`, and put the reset on it:
   `:where(.is_DOM) { margin: 0; padding: 0 }`,
   `:where(a.is_DOM, ...inline tags) { text-decoration: none }`,
   `:where(button.is_DOM, input.is_DOM, ...) { border-style: solid }`.
   Generate the selector lists from `TAGS[tag].display` in `@tamagui/dom` so the
   table stays the only source. `:where()` of a compound selector is still zero
   specificity.
2. Do **not** set `display` in the base rule. Leaving display to the UA fixes
   2a and 2b at once (`[hidden]` keeps working because nothing authored sets
   `display`). Only emit `display` when authored.
3. Decide box sizing once and make both platforms agree (2c). RSD's snapshot
   and the native table say `content-box`; web currently says `border-box`.
4. Keep semantic defaults (`b` bold, `h1` 1.5rem, `em` italic, `mark` colors,
   `code` monospace) as atomic defaults, as today. At zero specificity a
   Tailwind-style preflight (`h1 { font-size: inherit; font-weight: inherit }`)
   would flatten headings on web and not on native, which is exactly the RSD
   asymmetry the spec criticizes. Only the undo-the-browser reset
   (`DISPLAY_WEB_RESET`) moves to CSS.
5. Accept, and document, that page-level element CSS now beats the margin and
   padding reset on web. This is a product decision; see the note at the end.
6. Update every consumer of `DISPLAY_WEB_RESET` together: `generate-html.ts:59`,
   `compilerHost.ts:1210` (flattened output inlines it), the
   `conformance.test.ts:193` web model, and the tailwind frontend rebinding in
   `createFrontendHTML`.
7. Keep text-only base behavior for text-backed tags explicit
   (`overflow-wrap: break-word` matches the RSD snapshot); drop
   `white-space: pre-wrap` for html.*, which is Text semantics.
8. Fix `reset.css`: scope `all: unset` away from `dialog` and add
   `:where([hidden]) { display: none }` after it, or delete the `all: unset`
   line.
9. Add a web test that renders html.* through SSR and asserts computed
   `display` for `p`, `h1`, `span`, `button`, `div[hidden]`. The probe in the
   evidence folder is the shape.

Cost check: the move removes two to three atomic classes per html.* element
from SSR HTML (~14 bytes each in the probe output) and two to three prop
iterations per uncompiled render. The CPU part only applies to unflattened
components (INFERRED; not benchmarked).

---

## 3. Package split

### Current graph (RAN `jq` on package.json, `rg` on imports)

- `@tamagui/web` deps: animation-helpers, compose-refs, constants, dom,
  helpers, native, normalize-css-color, react-native-types, style-grammar,
  types, use-did-finish-ssr, use-event, use-force-update. None of these depend
  on `@tamagui/web` or `@tamagui/core`. **No package cycle today.**
- `@tamagui/web -> @tamagui/dom` is type-only in `src/dom/*` (the generator
  inlines the tables). `@tamagui/dom` is `sideEffects: false`.
- `@tamagui/core` does `export * from '@tamagui/web'` and then locally
  re-exports `View` / `Text` with RN types. Local exports shadow star exports,
  so this is spec-correct in ESM.
- `@tamagui/ui` exists already and depends on `@tamagui/core`. The spec's
  "Does NOT force `@tamagui/core` down consumers' throats" is false today and
  will stay false: ui components use `styled` with variants and `View` / `Text`.
- `tamagui` lists the same component packages as `@tamagui/ui` directly instead
  of depending on `@tamagui/ui`, and its `./web` export is identical to `.`.
  Two ways to reach the same thing.
- `@tamagui/web` is not RN-free: `createComponent.tsx:11` imports
  `NativeMenuContext` from `@tamagui/native` on web, and `types.tsx:29` pulls
  `@tamagui/react-native-types` into the public type surface.
- 48 files under `code/ui` import from `@tamagui/web` (20 `styled`, 8 `View`,
  4 `Text`, plus `createStyledContext`, `createStyledHOC`, `Theme`, ...).

### Risks in the proposed move

- **Cycle.** `html.tsx`, `html.native.tsx`, `primitives.native.tsx` and
  `internal-runtime.ts` in web import `viewStaticConfig` / `textStaticConfig`
  from `views/View` and `views/Text`. Moving View / Text to core as written
  makes web import core. Fix: split by data, not files. Web keeps base host
  static configs (no RN tables, no variants) that html.* extend; core adds the
  RN validity tables, RN mappings, and the View / Text components on top.
- **Native half ownership.** `html.native.tsx` lives in web. "Native remains
  core-only" means either the native html half moves to core (then
  `import { html } from '@tamagui/web'` under the `react-native` condition must
  resolve to something that throws with a clear message) or web keeps a native
  html path that does not reach RN tables. Pick one; the doc leaves it open.
- **Variants.** `styled` from web loses variants after phase 1. All 20 ui
  `styled` imports from `@tamagui/web` must move to core in the same change or
  they break at runtime with no type error if the carrier is optional.
- **Single instance.** Config, theme and context singletons live in web.
  `@tamagui/ui`, `@tamagui/core` and user code importing `@tamagui/web`
  directly must resolve one copy. This is the same failure class as the known
  subpath context duplication in rolldown/vite. Add a dedupe assertion (a
  module-scope "already loaded" check in dev) and keep all `@tamagui/*` at an
  exact shared version.
- **Tree shaking.** 59 of 60 ui packages are `sideEffects: false`; `tamagui`
  has `setup.*` (polyfill-dev, `globalThis.React`, rAF polyfill) and core has
  `**/runtime.*`. An html-only web consumer must import `@tamagui/web`, since
  `tamagui` and `@tamagui/core` both pull runtime setup. Say so in docs, and
  gate it with the `html-div` fixture that `web-core-split.md` phase 0 already
  asks for.

### Recommendation

Follow the phase order in `web-core-split.md` (size gate, variants carrier,
price RN spans, then move), with the corrections above. Fix the master spec's
diagram: ui depends on core.

---

## 4. Function children for 3rd-party native components

### Findings

- **Nothing implements it** (RAN `rg "typeof children === 'function'"` over
  `code/core/web/src` and `code/core/dom/src`: no hits). The spec's
  `createComponent.tsx` snippet is illustrative.
- **The contract already rejected it.** `compatibility.ts:343` records
  "children as a render function: not part of the contract", because "it
  exposes the native prop shape as public api and blocks compile-time
  literal-text wrapping". The master spec reverses a recorded decision without
  answering either reason.
- **The capability already exists.** `render` accepts
  `(props, state) => ReactElement` (`types.tsx:312`, `getCustomRender` at
  `createComponent.tsx:2372`) on web and native. A second function API on
  `children` violates one-way-to-do-it and collides with the literal-text
  wrapping in `htmlRuntime.native.tsx:62`.
- **The props are not what a native library wants, either way (INFERRED from
  `htmlRuntime.native.tsx` and `primitives.native.tsx`).** On native html.*, DOM
  to RN adaptation is split: renames and accessibility nesting run before the
  styled component, but `onClick -> onPress`, `__inherit` text-style resolution
  and the `__tag` ref facade run inside the DOM primitive. A function invoked
  from `createComponent` (children or `render`) gets `onClick`, `__inherit`,
  `__tag` and no inherited text styles. `react-native-maps` would ignore the
  click and receive private keys.
- **Animated styles.** With a native animation driver the resolved style can be
  an animated style object that is only valid on the driver's Animated host.
  Handing it to a third-party view breaks or silently freezes (INFERRED from
  the `isAnimatedCustomComponent` path at `createComponent.tsx:622`).
- **Web.** The web props are `className` + atomic classes + `is_View`. Libraries
  that run through react-native-web expect RN `style` objects and do not apply
  `className` (GUESSED from RNW's documented prop filtering). Passing props
  through does not make a native component styled on web.

### Recommendation

1. Do not add function children.
2. Make `render={(props) => <NativeMapView {...props} />}` on native html.*
   hand over RN-shaped props: strip `__inherit` / `__tag`, adapt `onClick` to
   `onPress`, and pass a plain resolved style (no animated value) when the
   render target is not the primitive. Test with a plain function component
   asserting received props.
3. Document the universal recipe that needs no prop passing: size the html.*
   container, render the native component inside with `style={{ flex: 1 }}`.
   It works on web through RNW and on native, and it keeps the compiler able to
   flatten the container.

---

## Other spec errors worth fixing before it is called final

- `grid-native-runtime-report.md` is cited but does not exist in
  `plans/v3-beta/`.
- The Tier 1 grid formula `calc(100% / N - gap)` is wrong
  (`calc((100% - (N - 1) * gap) / N)`), and native has no `calc()`, so Tier 1
  must compute widths from measured container width.
- The `--to-html` codemod maps `View -> html.div`. If html.div adopts web
  defaults (block, `flex-shrink: 1`, static position) as
  `web-alignment-steps.md` says, every converted file changes layout: `gap`
  and `alignItems` stop applying, and absolutely positioned children re-anchor
  because `View` implies `position: relative` on native. The codemod has to
  emit `display="flex" flexDirection="column"` (and `position="relative"` where
  children are absolute), or the mapping is lossy.
- The RSD asymmetry claim is correct (RAN `jq` on `rsd-snapshot.json`: web `b`
  has no `fontWeight`, native `b` has `fontWeight: "bold"`).

## Implementation checklist

Style routing

- [ ] Drop CSSOM discovery from the plan; keep `validStyleProps` tables for
      value semantics.
- [ ] Generate per-tag DOM prop tables into html.* static configs; invert the
      predicate for html.* only.
- [ ] Resolve overlaps in the generator: `width` / `height` / `src` per tag,
      `translate`, `size`, `transition`.
- [ ] Check variants before the style predicate for html.*.
- [ ] Dev-only warning for props routed to style that `CSS.supports` rejects.
- [ ] Measure with the styled-view and html-div fixtures before claiming bytes.

Resets

- [ ] New html.* web host class; remove `is_View` / `is_Text` from html.*.
- [ ] Generate `:where(.is_DOM)` reset rules from `TAGS.display`; no `display`
      in the base rule.
- [ ] Remove `DISPLAY_WEB_RESET` from `generate-html.ts`, `compilerHost.ts`,
      the conformance web model and the tailwind html rebinding in one change.
- [ ] Keep semantic tag defaults as atomic defaults.
- [ ] Pick one box-sizing for html.* and align web and native.
- [ ] Fix `reset.css` `all: unset` on `dialog` and `[hidden]`.
- [ ] SSR + computed-style web test for `p`, `h1`, `span`, `button`,
      `div[hidden]`.

Packages

- [ ] Land the html-div size gate first.
- [ ] Split static config data (web base host configs, core RN tables) before
      moving View / Text; `rg` web for `views/View` and `views/Text` imports
      must return only web-owned configs.
- [ ] Decide where `html.native.tsx` lives and what `@tamagui/web` resolves to
      under `react-native`.
- [ ] Codemod the 48 ui files importing `@tamagui/web`.
- [ ] Remove `@tamagui/native` from web's web graph (`createComponent.tsx:11`).
- [ ] Dev-time duplicate-instance assertion for `@tamagui/web`.
- [ ] `knip` + fixture attribution confirm no `.native` fork in web's graph.
- [ ] Correct the master spec diagram (ui depends on core); consider making
      `tamagui` depend on `@tamagui/ui` and dropping the duplicate `./web`
      export.

Native interop

- [ ] No function children.
- [ ] `render` function on native html.* receives RN-shaped props with private
      keys stripped and `onClick` adapted.
- [ ] Document the container + `flex: 1` recipe for native components.

## Decision needed from Nate

Moving the margin / padding reset to zero specificity means page-level element
CSS (`p { margin: 1em }`) changes html.* spacing on web and not on native.
Recommendation: accept it and document it, because the alternative (class
specificity) breaks atomic overrides whenever stylesheets load out of order,
which is why `is_View` moved to `:where()` in the first place.

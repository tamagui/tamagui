# Surfaces, levels, generics — proposal

2026-07-18. Status: PROPOSAL, pending user decision. Executes as T2 in
`plans/v3-beta-campaign-plan.md` if accepted. Companion to `plans/variables.md`.

## The claim

Every concept in this space (generics, levels, Surface, per-area restyling,
whole-surface press states) is one operation: **re-binding the generic theme
keys against the color scale, scoped to a subtree.** v3 already ships exactly
two entry points for that operation: named re-binding (sub-themes generated
from theme-builder templates) and anonymous re-binding (`<Variables>`). The
clean design adds zero new runtime mechanisms. It adds one convention, one
copied fixture, and one documented rule.

## The model

1. **Two vocabulary layers, hard rule between them.** Scales (`color1..12`,
   per scheme) are raw material. Generics (`background`, `backgroundHover`,
   `backgroundPress`, `borderColor`, `color`, ...) are the only keys a skin
   may style against. A skin never references `colorN` directly. This rule is
   what makes everything else compose: anything that re-binds generics
   restyles every skin beneath it, with no skin cooperation needed.

2. **Levels are sub-themes that re-bind generics.** `surface1-3` already are
   this (`code/core/themes/src/v4-tamagui.ts` templates). "Everything in this
   panel a bit darker" = `theme="surface2"`. The light/dark asymmetry the
   owner wants (light hover shifts up the scale, dark shifts down) lives in
   the templates, resolved once at theme-build time — the right place; no
   per-component logic. Custom levels = user defines a template, the builder
   generates light and dark variants. Named, typed, class-swap cheap on web.

3. **`<Variables>` is the anonymous escape hatch, not the levels system.**
   One-off patch: "this panel's `backgroundHover` is `$blue4`". Docs rule:
   used in more than one place → make it a sub-theme; one place →
   `<Variables>`. Same operation, two entry points, pick by whether it
   deserves a name.

4. **`Surface` is a copied skin fixture, not a framework component.** ~15
   lines: YStack + structural chrome reading generics (`bg="$background"`,
   `borderColor="$borderColor"`, radius from a variable) + a `level` variant
   that sets `theme="surfaceN"`. It replaces ThemeableStack for user layout
   code (panels, wells, toolbars). Component skins (Card, Select popover,
   ListItem) do NOT extend Surface — they get their similarity by styling
   against the same generics and setting their own level. A single Surface is
   right precisely because it is a fixture: users who want CardSurface vs
   ListSurface fork the copy, and nothing in the framework cares.

5. **Kill `$surfaceBorder`-style component-scoped tokens.** Inside a level,
   the border IS `$borderColor` — the template re-binds it. Config-declared
   custom variables (`config.variables`, shipped, typed) stay for genuinely
   cross-cutting non-palette knobs only: `$disabledOpacity`,
   `$focusRingColor`/`Width`, `$pressScale`, easings, `$radius`. That is also
   the "users define their own tokens" story: it exists today via
   `config.variables` + module augmentation.

6. **States.** Per-part: `hoverStyle`/`pressStyle` with generic keys (already
   the skin pattern). Whole-subtree state re-theming (parent press recolors
   children) is deliberately NOT rebuilt — that was v2 component-theme
   territory, expensive and confusing. Where a real case exists (ListItem
   selection), the A1 state vocabulary emits `data-state` and group styles
   cover it.

7. **Sizing stays out of themes.** Colors flow through themes (cascade, zero
   re-render); size flows through named size tables + styled-context
   (`createSizeTable`), already standard in the v3 skins. A "denser area" is
   a size context at a boundary, orthogonal to surface levels. A size-shifting
   theme mechanism would re-invent the v2 token stepper v3 just deleted.
   Numeric knobs that should cascade (`$radius`) are custom variables.

## Facets: the variant-system piece (owner addition, 2026-07-18)

The owner's addition: v3 has a typed variant helper (`createVariantResolver`
machinery), so surfaces should get composable capability variants. This is
ThemeableStack's one good idea (`bordered`, `elevate`, `outlined`,
hover/press/focus theming) reborn in the right layer with the right inputs.

**Facets are canonical boolean variants, generated once by a small helper in
the copied layer, each a pure function of generics + conventional variables.**

Chrome facets — each owns exactly one property family, static styles only:

- `backgrounded` → `bg: '$background'`
- `bordered` → `borderWidth: 1, borderColor: '$borderColor'`
- `elevated` → shadow generics / elevation
- `rounded` → `borderRadius: '$radius'` (custom variable)

Interaction facets — each owns exactly one pseudo, never static styles:

- `hoverable` → `hoverStyle: { bg: '$backgroundHover', borderColor: '$borderColorHover' }`
- `pressable` → `pressStyle: { bg: '$backgroundPress', borderColor: '$borderColorPress', scale: '$pressScale' }`
- `focusable` → focus-visible ring from `$focusRingColor`/`$focusRingWidth`

Composition rules (these are what keep it from becoming a second variant
system):

1. **Family ownership kills compound variants.** Chrome facets never touch
   pseudos; interaction facets only touch pseudos. An interaction facet may
   state-shift ANY family's generic (`borderColorPress`), because the value is
   inert when that chrome is absent (no borderWidth → borderColor does
   nothing). `pressable + bordered` composes with zero coordination.
2. **Generics-only, so facets are level-aware for free.**
   `<Surface level={2} pressable bordered>` needs no facet cooperation; the
   level re-bound the generics the facets read.
3. **They live in the copied layer** — a `facets.ts` shipped beside the skins
   in the registry, imported by Surface and any skin that wants them, forkable
   like every copy. Core contributes only the existing variant machinery.
4. **A1 stays accurate for free.** hover/press/focus are pseudo-tier states in
   the A1 vocabulary, so the registry's derived `meta.states` picks facet
   usage up without new scanning rules.
5. **No preset facets.** `outlined`-style multi-family combos are documented
   compositions (`bordered` minus `backgrounded`), not additional keys. One
   tier of vocabulary.

Surface then collapses to: YStack + `level` variant + facets, with **nothing
on by default** (owner decision 2026-07-18): a bare `<Surface>` renders no
chrome and no interaction styling; every facet is opt-in at the use site.
It is purely a copy-paste composition point. Component skins use interaction
facets where they match (ListItem is `hoverable pressable`) and hand-write
chrome where their look demands it; facets are convenience, not law.

### Naming (DECIDED, user 2026-07-18)

All adjectives, interaction collapsed to one facet:
**`filled`, `outlined`, `elevated`, `rounded`, `interactive`**, plus `level`.

```tsx
<Surface level={2} filled outlined rounded interactive />
```

- `filled` replaces "backgrounded" (established UI term, real English).
- `outlined` over `bordered` (user call): avoids overloading the existing v2
  `bordered` ThemeableStack variant and style-prop-adjacent wording. Here it
  is purely additive border chrome, NOT the Material border-minus-fill
  preset; `outlined` without `filled` happens to equal that preset anyway.
- `interactive` replaces `hoverable`/`pressable`/`focusable`: the three
  feedbacks travel together in practice, per-state differences already live
  in the generics, and one word stops the `-able`s from falsely implying
  capability (behavior primitives own actual focus/press capability).
  Press-only/hover-only wants → fork the facet file; granularity lives in
  the fork, not the API.
- Noun pairing: `Surface` the noun, `level` which one, adjectives how it
  looks; `theme="surface2"` and `<Surface level={2}>` share vocabulary.
- Rejected: noun facets (`border`, `fill`) — collide with real style props;
  mixed word-forms (`bordered` + `pressable`) — read as arbitrary.

Still open before executing (not blocking):

- native parity for the focus ring (outline vs focusStyle border swap).

## Docs presentation

One theming page ("Surfaces and levels") owns the concept. Component pages
never explain it: they show `theme="surface2"` as a one-liner on the elevated
example. Surface itself is a small registry/docs page showing its copied
source, same as any skin.

## What users must learn (total)

- style skins against generics, never the scale;
- `theme="surface1-3"` shifts a subtree's level;
- `<Variables>` patches one-offs;
- `Surface` is a copy-paste panel primitive;
- custom knobs go in `config.variables`.

## Explicitly deferred

**Relative levels** (`level="+1"` compounding under nesting). Real new
concept: theme resolution is absolute today; nesting `surface2` inside
`surface2` does not compound. Absolute named levels cover the app cases seen
so far. Revisit post-beta only with a concrete consumer.

## Execution (if accepted)

1. Delete the ThemeableStack/SizableStack variant system from behavior
   packages; migration note (styled YStack extension or Surface copy).
2. Ship the `Surface` fixture in the canonical skin set + registry, with the
   `level` variant and the variable conventions.
3. Sweep skins for scale references; enforce the generics-only rule in the
   registry generator check.
4. Docs page + component-page one-liners.

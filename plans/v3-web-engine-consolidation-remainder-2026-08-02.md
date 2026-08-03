# V3 web engine consolidation remainder

The program engine should survive. Ordinary string style values already use it as
their exclusive resolver and emitter. The remaining legacy surface owns values
that the current program representation cannot preserve, so deleting it inside
`@tamagui/web` alone would change behavior.

## Proven boundary

- Regular `View` has no `styleFrontend`. It enters `getSplitStyles` directly.
- Before this branch, every ordinary host string entered `propMapper` for
  structural normalization and then entered `contributeStylePrograms`. A
  successful contribution returned before `resolveLegacyPartValue` and
  `mergeStyle`, so the string was resolved and emitted only by programs.
- This branch bypasses `propMapper` for ordinary eligible host strings. Variants,
  safe-area values, styled-context values, accepted sub-styles, native `unset`,
  numbers, variables, and structured values still enter the structural mapper.
- Numbers deliberately keep their natural representation. A trial that sent all
  numeric scalars through programs changed inline/native numbers into strings and
  changed established atomic class identifiers. The web and native integration
  suites caught both changes.
- The 98,965 rendered bytes attributed to `@tamagui/style-grammar` are genuinely
  reachable. Static compilation does not remove them: the validated fixture is
  377,550 JS bytes compiled and 376,482 JS bytes uncompiled.

## Required implementation order

1. Extend the style-grammar payload contract to preserve non-string values. A
   base payload must distinguish authored numbers from strings and carry the
   original styled-context value. Web serialization may add CSS units, while
   native evaluation must return the authored number for unitless and layout
   properties. This change belongs to `@tamagui/style-grammar`.
2. Add program ownership for the current `legacy-part` categories: structured
   shadow parts, the remaining transform parts, and every composite family that
   still reaches `resolveLegacyPartValue`. Each category needs one family split
   and one platform serializer. Do not add a program attempt followed by a legacy
   fallback.
3. Move variant output canonicalization to variant resolution. Variant functions
   and default-token selection remain component-aware, but their resulting style
   entries should enter the same contribution API as authored props. Once every
   output is canonical, remove shorthand expansion and scalar value resolution
   from `propMapper`.
4. Make the program web lowerer own base-only atomic output. It must cover the
   non-standard rules currently in `getCSSStylesAtomic`: placeholder selectors,
   prefixed `backgroundClip` and `userSelect`, pointer-event compatibility, and
   transform composition. Then delete `getCSSStylesAtomic`, its value normalizer,
   and the scalar `styleState.style` flush.
5. Delete `resolveLegacyPartValue`, the ordinary scalar `mergeStyle` branch, and
   the `usedKeys` state that only arbitrates between those paths. Keep a separate
   structured-prop owner only for accepted custom sub-styles that are not host
   CSS.
6. Resolve the runtime parser entry contract before claiming the bundle target.
   Splitting a barrel cannot remove code that synchronous rendering calls. Pick
   one explicit product contract:
   - keep runtime dynamic flat strings in core and reduce the web grammar entry to
     the parser, web resolver, and web lowerer, with native modules excluded; or
   - make dynamic flat strings an explicit runtime entry and require compiled
     lowering in the default web entry.

The second choice changes the public runtime contract and needs an owner decision.
Neither choice should be implemented as runtime feature detection or an async
fallback.

## Gates

- `code/core/core-test`: `bun run test:web` and `bun run test:native`.
- The comparison harness on `origin/validate/v3-web-flatten`, with the machine
  benchmark lock held for every timing run.
- Compiled JS below 93,098 gzip bytes and uncompiled JS below 92,763 gzip bytes.
- V3 at or faster than V2 for mount and rerender in every compiled and runtime
  scenario. Report retained medians and paired effects, not file-size estimates.

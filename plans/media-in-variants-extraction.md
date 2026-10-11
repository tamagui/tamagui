# Media inside variants: adopt the main-branch tests

Written 2026-08-07 against `main`. v3-beta must re-prove this; it cannot inherit
the fix, because the pipeline that carried the bug was replaced here.

## What was wrong on main

A media block nested inside a `styled()` variant value:

```tsx
const Title = styled(H3, {
  size: '$7',
  $lg: { size: '$9' },
  variants: {
    strength: {
      large: { size: '$9', $lg: { size: '$11' } },
    },
  },
})

<Title strength="large" />   // wanted 58px at $lg, rendered 35px
```

The compiler resolved the variant through `getSplitStyles` in static mode, where
a media block was merged into the flat style whenever node's `mediaState` said
that breakpoint was active. So the variant's `$lg` values landed on the
unconditional style, and the frame's own `$lg` was the only thing left holding
the breakpoint. Every element using the variant rendered the frame's ramp.

Dev builds were fine, because the compiler is off in dev. It only showed up in
production, which is what made it expensive to find.

A second, related defect: two media ternaries for the same breakpoint merged
first-wins, so a `$lg={{...}}` written at a JSX site lost to the `$lg` the
`styled()` frame declared, instead of overriding it.

A third: a `styled()` defined in the file being compiled was registered under
its *parent's* staticConfig, which knows nothing about the variants the call
declares. Passing one read as an unknown prop and de-opted the whole element,
so it never flattened at all.

## The fixes on main

- `code/core/web/src/helpers/getSplitStyles.tsx` — under `IS_STATIC`, a window
  media block stays nested under its own `$key` instead of being folded into the
  flat style. **This file still exists here and the change applies as-is.**
- `code/compiler/static/src/extractor/createExtractor.ts` — routes those nested
  blocks into the same media path a `$md`/`$lg` prop takes, de-opts on native
  (no build-time answer for a breakpoint there), and does a dynamic load when a
  `styled()` declares its own variants.
- `code/compiler/static/src/extractor/normalizeTernaries.ts` — media ternaries
  merge last-wins.

**The last two files do not exist on v3-beta.** The babel extractor was replaced
by `compiler-core` (`lower.ts` / `materialize.ts` / `normalize.ts`), so the same
three behaviors have to be checked against that pipeline rather than ported.

## What to adopt

Copy both test files from `main`:

- `code/compiler/static-tests/tests/mediaInVariants.web.test.tsx`
- `code/compiler/static-tests/tests/mediaInVariants.native.test.tsx`

They depend on `MyMediaVariantText` in
`code/core/test-design-system/src/index.ts` (a `strength` variant whose values
carry `$lg` blocks that set another variant). That fixture needs to come over
too, and the package needs a build before the tests will see it.

The web tests assert, for `<MyMediaVariantText strength="large" />`:

- base gets the variant's own base (`_fos-35px`), not the value from inside its
  `$lg`
- `$lg` gets the variant's `$lg` (`_fos-_lg_58px`), not the frame's
  (`_fos-_lg_35px`)
- a `$lg={{ size: '$11' }}` prop overrides the frame's `$lg` rather than losing
  to it, while a `$lg={{ color: 'red' }}` prop merges into it
- a locally defined `styled()` still flattens when handed one of its own
  variants

The native test asserts the element stays on the runtime path (no
`StyleSheet.create`) when a variant carries media, while a variant without media
still flattens.

Check the class-name expectations against v3's own atomic prefixes before
assuming a failure is a real one; the assertions are written against v2 names.

# font family types

Owner direction, 2026-10-04: "tamagui lets you stricltuy type this shit. we
shodlnt be showing randoms hit like this. its a big regression from v2",
reported for `fontFamily="display"` in Contrast's `HomeSentence.tsx`.

With `allowedStyleValues` enabled, font family suggestions derive from the
configured fonts. Generic CSS families are valid only when configured as a
font name, or when the application allows arbitrary style strings. Existing
conditional string syntax remains validated by the language service.

RAN: Contrast's native TypeScript language server suggested 19 values for
`fontFamily`: six configured names, twelve generic CSS families, and `unset`.
The typecheck already rejected an unconfigured single-token name. V2's
`ThemeValueGet<'fontFamily'>` included configured font tokens without the
unconditional generic CSS family union added in v3.

The isolated fixture under `code/core/web/test/font-family` uses a real strict
config and the built public types. Before the fix, the compiler reports three
unused `@ts-expect-error` directives for `fantasy`, `cursive`, and a styled
default using `math`. It also checks configured names and rejects an unknown
font name.

TESTED: the rebuilt public types passed the isolated fixture and Contrast's
`H2`, `Span`, `Text`, and `styled()` checks. A native TypeScript language-server
probe using Contrast's actual config returned seven suggestions: `body`,
`departure`, `display`, `heading`, `mono`, `system`, and `unset`. Configuring a
font with a CSS generic name still permits that name.

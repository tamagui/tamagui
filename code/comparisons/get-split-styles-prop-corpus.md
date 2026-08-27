# getSplitStyles real-world prop corpus

This corpus statically parses JSX in `code/tamagui.dev`, `code/kitchen-sink`, `code/demos`. Generated output excludes `.next`, `.tamagui`, `coverage`, `dist`, `e2e`, `node_modules`, `tests` path segments. Run `bun code/comparisons/generate-get-split-styles-prop-corpus.ts` from the repository root to reproduce both files.

The generator keeps JSX attributes whose complete value is statically known. It supports scalar literals, literal templates, signed numbers, arrays, objects, and literal object spreads. Dynamic attributes are counted but omitted from replay. Each corpus row preserves the element, source line, component kind, and the full static prop object.

The `zero-props` and `one-prop` lanes are fixed synthetic controls. They replay `View` with `{}` and `{ opacity: 1 }` so the benchmark can separate fixed call cost from the first property contribution without depending on the harvested application mix.

## Distribution

Denominator for value and prop percentages: 22,918 static attributes from 8,948 elements in 755 parsed files. Another 3,599 dynamic attributes were observed and omitted.

| Category | Count | Static attributes |
| --- | ---: | ---: |
| Strings | 17,239 | 75.22% |
| Numbers | 4,022 | 17.55% |
| Booleans | 1,096 | 4.78% |
| Nulls | 8 | 0.03% |
| Arrays | 181 | 0.79% |
| Objects | 372 | 1.62% |
| Clause strings | 1,093 | 4.77% (6.34% of strings) |
| Conditional objects | 14 | 0.06% |
| Variant props | 1,793 | 7.82% |
| Shorthands | 2,365 | 10.32% |

Variant classification uses variant keys declared in `styled()` calls across the corpus. A prop counts when its uppercase component has that key locally, or the key is used by another corpus component, and the prop is neither a style, shorthand, nor known host prop. This keeps the benchmark grounded in app-authored variant names without pretending every unknown JSX prop is a variant.

## Benchmark lanes

| Scenario | Elements | Corpus elements |
| --- | ---: | ---: |
| zero-props | 1 | fixed control |
| one-prop | 1 | fixed control |
| plain-props | 6,745 | 75.38% |
| clause-strings | 625 | 6.98% |
| conditional-objects | 14 | 0.16% |
| variant-props | 1,674 | 18.71% |
| shorthand-heavy | 345 | 3.86% |
| style-prop-heavy | 540 | 6.03% |

The lanes overlap where a real element combines behaviors. `plain-props` excludes clause strings, conditional objects, and classified variants. `shorthand-heavy` requires at least two shorthands and at least half of the element's static style props to be shorthand. `style-prop-heavy` requires at least five static style props and at least half of all static attributes to be style props.

Corpus SHA-256: `1eef702fd69dcd8853822326f024df6e1ebbcf63adcc978e69c84a99226bcee5`.

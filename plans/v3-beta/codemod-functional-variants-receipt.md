# V3 functional-variant codemod receipt

The codemod ran in report mode only. It did not receive `--write`, and every
Markdown and JSON report was written under `/tmp/tamagui-functional-variants-receipts`.
The consumer repository status checks after the runs showed no new source changes.

Each corpus contains every tracked TypeScript file matched by a repository-wide
search for a quoted `...category`, `...`, or `:type` property key. The codemod
then used Tamagui import provenance to discard false positives. Takeout and chat
also completed broader source-root scans with identical functional-variant counts.
Soot's broader scan crossed a live `.tmp-sootsim-runner-*` directory that another
process removed during traversal, so its stable report uses the complete
function-key corpus. The same bounded scan keeps 3pc's referenced monorepo graph
from turning one functional site into a long full-workspace typecheck.

| repository | candidate files | functional sites | automatic | catch-all | mixed | needs `.resolve` | type bodies | other flags |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `~/takeout` | 4 | 1 | 1 | 0 | 0 | 0 | 0 | 0 |
| `~/chat` | 23 | 8 | 8 | 0 | 0 | 0 | 0 | 0 |
| `~/soot` | 12 | 3 | 3 | 0 | 0 | 0 | 0 | 0 |
| `~/3pc` | 2 | 1 | 1 | 0 | 0 | 0 | 0 | 0 |

The automatic sites consist of nine `':number'` variants, three
`'...fontSize'` variants, and one `'...size'` variant. No corpus site reads
`extras.props`, mixes exact and function keys, uses the catch-all key, or needs a
manual type-body merge.

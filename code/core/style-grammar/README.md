# `@tamagui/style-grammar`

This package owns the shared parser and intermediate representation for
Tamagui style value strings.

Runtime consumers must follow the repository's
[one-parse-per-unique-value constraint](../../../CONTRIBUTING.md#style-value-parsing-one-parse-per-unique-value).
Cache the parsed representation and extend it with structural predicates when
a new consumer needs more information. Do not add a second string scanner
beside the grammar.

## The one scanner

`scanFlatValue.ts` is the split: one left-to-right pass that hands a handler
index ranges and never allocates a slice. `parseValue` is built on it, and so
are the three scanners in `@tamagui/web` (`contributeStyleString`,
`resolveVariants`, `hasFlatModifier`). A consumer that needs a different answer
writes a different handler, never a second pass.

## The Rust LSP's tables are generated from here

`code/lsp/crates/tamagui-grammar` is an editor transport for this grammar and
never a second owner of what a modifier means, so its modifier tables and its
conformance vectors are generated:

```sh
bun run generate:rust   # write src/generated.rs and tests/vectors.json
bun run check:rust      # fail if what is on disk differs
```

`checks.yaml` runs `check:rust` and `cargo test --workspace` on every push. When
you change a modifier name, an alias, a platform, or anything the parser
decides, regenerate and commit both files with the change.

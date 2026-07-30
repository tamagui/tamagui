# Flat-values codemod spike

This private package measures how much existing Tamagui syntax can be converted
mechanically to V3 flat property values. It only produces a Markdown report and
never writes the source files it scans.

```sh
cd code/core/codemod-flat-values
bun run dry-run
```

The default corpus is `code/kitchen-sink/src/usecases` plus the canonical
`Button.tsx` skin. Pass source files or directories as positional arguments to
scan another corpus, and use `--report <path>` to choose the report destination.
Pass `--transforms` to convert legacy `scale`, `scaleX`, `scaleY`, `x`, `y`, and
`rotate` condition entries. This remains off by default so transform migration
is an explicit corpus choice.

The spike deliberately stops at statically local syntax. Dynamic legacy
condition objects, spreads, computed property names, structured native values,
and token dot paths are reported for manual migration. A plain dynamic
expression used as the base of a conditional program becomes a template
literal when its units are provable; uncertain length expressions remain
flagged.

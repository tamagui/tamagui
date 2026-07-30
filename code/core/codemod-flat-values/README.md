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

The spike deliberately stops at statically local syntax. Dynamic legacy
condition objects, spreads, computed property names, structured native values,
token dot paths, and conditions targeting a raw or dynamic base value are
reported for manual migration.

# Expo export:embed repair, 2026-08-03

Any iOS Release build must have the real Expo `export:embed` implementation. VxRN
1.21.13 carried a built-in dependency patch that replaced the start of
`exportEmbedAsync` with a warning and an immediate return. Xcode still reported a
successful bundle phase, but the app could contain an old JS bundle or no JS bundle.
Plain `expo export` uses a different path and was unaffected.

This tree fixes both parts of the problem:

- `patches/vxrn@1.21.13.patch` removes the `@expo/cli` mutation from VxRN's source
  and both shipped build files.
- `package.json` registers that patch under `patchedDependencies`, so a later
  `bun install` keeps the repair.

## Repair a worktree before the commit is available

VxRN preserves Expo's original file next to the patched copy. Restore it from the
worktree root:

```sh
cp node_modules/@expo/cli/build/src/export/embed/exportEmbedAsync.js.vxrn.original \
  node_modules/@expo/cli/build/src/export/embed/exportEmbedAsync.js
```

That repairs the current install only. Running a One or VxRN patch command can add
the early return again until the durable VxRN patch is present.

## Durable install procedure

Use the committed `package.json`, `bun.lock`, and
`patches/vxrn@1.21.13.patch`, then install normally:

```sh
bun install --frozen-lockfile
```

The patch is version-specific. If One moves to a different VxRN version, regenerate
the patch for that exact version and update `patchedDependencies`. Do not carry the
1.21.13 key forward while assuming it applied to a newer package.

## Verification

Read the function body itself. A path check or a search in a different copy of Expo
CLI cannot establish that Xcode will execute the real implementation.

```sh
sed -n '180,230p' \
  node_modules/@expo/cli/build/src/export/embed/exportEmbedAsync.js
```

The body must start normally, process the CI and environment options, and reach:

```js
await exportEmbedInternalAsync(projectRoot, options)
```

There must be no warning and immediate return after the function declaration.

To prove the repair survives both package installation and VxRN's patch pass, run:

```sh
bun install --frozen-lockfile
cd code/sandbox
../../node_modules/.bin/one patch --force
cd ../..
sed -n '180,230p' \
  node_modules/@expo/cli/build/src/export/embed/exportEmbedAsync.js
```

The final read must still show the complete function body and the call to
`exportEmbedInternalAsync`.

# V3 G1 packed release dry run

This harness validates the release artifacts in isolation. It never publishes. The only
source-tree writes it permits are the package builds explicitly requested before packing;
all manifest rewriting, tarballs, extraction, installs, and reports live under a new
directory in the operating-system temp root.

## Canary contract

Pass the G0 canary with `--canary`. The harness copies it to `/tmp`, excludes its lockfiles,
workspace links, caches, and build output, and writes a new package manifest only in that
copy. The copied manifest installs every staged Tamagui package by absolute `file:` tarball.
Any canary Tamagui workspace dependency without a staged tarball is fatal.

The canary may define:

```json
{
  "scripts": {
    "g0:web": "bun run test:web",
    "g0:native": "bun run test:native"
  }
}
```

Alternatively, pass both `--web-command` and `--native-command`. These commands run from
the isolated copied canary after export probing, with `NODE_PATH` removed and
`TAMAGUI_PACKED_CANARY=1`.

## Source-light planning

This resolves the changed public package roots and their full internal Tamagui runtime
dependency closure. It does not build, copy, pack, install, or run the canary.

```sh
bun scripts/v3-release-dry-run.ts \
  --base <release-staging-base-sha> \
  --canary <g0-canary-dir> \
  --plan-only
```

An explicit set can replace `--base`:

```sh
bun scripts/v3-release-dry-run.ts \
  --package @tamagui/compiler-core \
  --package @tamagui/vite-plugin \
  --package tamagui \
  --canary <g0-canary-dir> \
  --plan-only
```

`--package-list packages.json` accepts either a string array or `{ "packages": [...] }`.

## Serialized G1 gate

Run only after the coordinator releases the single heavy lane:

```sh
bun scripts/v3-release-dry-run.ts \
  --base <release-staging-base-sha> \
  --canary <g0-canary-dir> \
  --packer npm \
  --release-preview \
  --tag beta
```

Use `--packer bun` to repeat the artifact proof through `bun pm pack`. The full run:

1. builds selected packages in dependency order and verifies source package manifests did
   not change;
2. copies each package to temporary staging, replaces `workspace:` ranges only in that
   copy, and rejects local/absolute/deleted-package references;
3. packs into `/tmp`, records each tarball path, SHA-256, byte size, and exact file list;
4. rejects tests, fixtures, caches, traversal/absolute paths, missing export targets,
   source-only imports, legacy grammar copies, undeclared dependencies, or recursive
   `workspace:` strings;
5. requires every runtime `tamagui`/`@tamagui/*` dependency to have a staged tarball;
6. installs all tarballs into the copied canary and rejects package resolution outside the
   isolated consumer;
7. executes ESM and CJS entrypoints, resolves browser and react-native conditions, then
   runs the G0 web and native commands from the tarball-only consumer;
8. writes `release-preview.json` with artifact inventory, probes, commands, versions, and
   exact `npm publish` commands.

The final commands are printed for owner authorization. There is deliberately no code path
that invokes `npm publish`.

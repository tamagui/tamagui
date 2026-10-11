# V3 G1 packed release dry run

This harness validates the release artifacts in isolation. It never publishes. The only
source-tree writes it permits are the package builds explicitly requested before packing;
all manifest rewriting, tarballs, extraction, installs, and reports live under a new
directory in the operating-system temp root.

## Automatic beta publishing

Successful push CI on `v3-beta` publishes an immutable
`3.0.0-beta.<workflow-run>.<attempt>` version to the npm `beta` tag. The release uses
GitHub OIDC through `.github/workflows/release.yml`; it does not write a version commit or
tag back to `v3-beta`. GitHub evaluates `workflow_run` from the default branch, so the
same release workflow must be present on `main` before beta automation can run.

Seven v3 public package names are absent from the current main release set. Check their
one-time npm bootstrap and trusted-publisher setup without changing external state:

```sh
bun scripts/bootstrap-v3-beta-oidc.ts
```

After reviewing the plan and explicitly approving the initial npm package claims, run
the guarded interactive setup with `--execute`. It publishes missing names only under
the `bootstrap` tag, then configures `tamagui/tamagui` and `release.yml` as the trusted
publisher for all seven names.

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

The repository canary's `g0:web` runs typechecking, Vite dev/HMR, production build,
SSR, and browser hydration. Its `g0:native` first creates a production iOS export
through Metro, then renders and interacts with the same tree through the native
runtime. A renderer-only native test is not a substitute for the Metro export.

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
  --version 3.0.0-beta.0 \
  --tag beta
```

The normal release script invokes this same staging path, passes version overrides for
packages skipped as unchanged, retains `release-preview.json`, and publishes only the
requested package tarballs from that report. Dependency-closure tarballs are still packed,
hashed, audited, and installed into the isolated canary, but are not publish candidates.
Skipped closure packages are downloaded as the exact `name@version` registry tarballs;
current workspace bytes are never relabeled as an already-published version.
If the release cannot resolve a skipped package at the target dist-tag, that package is
put back into the publish set so every staged dependency version exists.

Use `--packer bun` to repeat the artifact proof through `bun pm pack`. The full run:

`--version` rewrites versions and internal dependency ranges only in temporary staged
manifests. Release-preview mode rejects a missing version so it cannot print beta-tagged
publish commands for the repository's current stable package versions.

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

The package audit also rejects references to removed v3 packages:
`@tamagui/animations-moti`, `@tamagui/babel-plugin`, `@tamagui/sizable-context`,
`@tamagui/static-sync`, and `@tamagui/static-worker`.

The final commands are printed for owner authorization. There is deliberately no code path
that invokes `npm publish`.

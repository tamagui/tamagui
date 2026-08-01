# Tamagui V3 beta ready-to-test procedure

Status: awaiting the final isolated conformance audit.

Audited SHA: pending

This procedure tests the V3 beta from local package tarballs. It does not publish
packages, move an npm dist-tag, create a Git tag, or deploy anything.

## 1. Confirm the candidate

Run these commands from the `v3-beta` checkout:

```sh
git branch --show-current
git status --short
git rev-parse HEAD
```

The branch must be `v3-beta`, the checkout must be clean, and the SHA must match
the audited SHA above. If any value differs, stop and audit that exact commit
before testing it as the candidate.

The release-facing audit is:

```sh
./scripts/gate-audit.sh "$(git rev-parse HEAD)"
```

Keep the audit worktree and its `.gate-logs/` directory until the beta decision
is recorded. The expected local result is `audit passed` with every gate at exit
zero. CI-only browser and bundle gates listed in
`plans/v3-final-conformance-matrix.md` remain separate evidence.

## 2. Build the local packages

From the same clean candidate checkout:

```sh
bun install --frozen-lockfile
bun run build
git status --short
```

The build must finish successfully. The only accepted tracked rewrite is
`code/tamagui.dev/tamagui.generated.css`, as recorded by the conformance matrix.
Do not use a checkout with other generated changes as the package source.

## 3. Install the candidate into a consumer

Choose an existing consumer whose dependencies are already installed. Use an
absolute path so the source and target are unambiguous:

```sh
TAMAGUI_V3_CONSUMER=/absolute/path/to/consumer
test -d "$TAMAGUI_V3_CONSUMER/node_modules"
bun run release --into "$TAMAGUI_V3_CONSUMER"
```

The `--into` path runs `npm pack` locally for each Tamagui workspace package
that already exists in the consumer's `node_modules`, then extracts that tarball
over the installed package. It does not contact npm to publish anything.

Read the final package count. A package that the consumer does not already have
is intentionally skipped, so confirm the consumer directly depends on every
package needed for the test.

## 4. Restart and test the consumer

Stop any running consumer dev server before the local install, then start a new
process after it completes. Vite and similar tools retain dependency code in
memory, so an old process does not test the newly installed package output.

Run the consumer's normal typecheck, production build, and integration tests.
Also exercise these V3 beta behaviors in the real app:

1. a transition using Tamagui shorthands such as `bg`, `p`, `w`, and `br`;
2. transform-driven CSS animations, including interrupted or reversed motion;
3. a container-only parent whose descendant responds to a container size change;
4. optimized compiler output in the consumer's production build;
5. repeated invalid input diagnostics, confirming each distinct message appears
   once per process.

Record the candidate SHA, consumer commit, commands, exit codes, browser or
device, and screenshots for visible behavior. A failure report should include
the smallest reproduction and the relevant build or browser log.

## 5. Restore the consumer

After testing, restore the consumer's locked dependency contents with its normal
package manager. For a Bun consumer:

```sh
cd "$TAMAGUI_V3_CONSUMER"
bun install --force --frozen-lockfile
```

Restart the consumer again after restoration.

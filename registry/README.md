# Tamagui registry (DRY, shadcn-compatible)

A shadcn-compatible copy-paste registry generated **from** the styled skin
source — the single source of truth. The styled components live in `tamagui`
(the unstyled `@tamagui/ui` primitive + ONE default skin definition). "The
copy-paste thing should be the same thing": a registry item IS that styled
component source, and every downstream copy is mechanically checked against it.
Nothing is hand-duplicated.

## The pipeline

```
<skin source>/Button.tsx          ← single source of truth (unstyled + skin)
<skin source>/Button.manifest.ts   ← co-located, NON-derivable bits only
        │
        ▼  scripts/generate-registry.ts
registry/json/registry.json        ← shadcn registry index
registry/json/r/button.json        ← shadcn registry-item (the copy-paste payload)
        │
        ├─▶ downstream copies (demos, kitchen-sink, site, canary) — drift-checked
        └─▶ blank web + blank Expo apps — installed, built, interacted with in CI
```

> The exact `styled = unstyled + skin` layering mechanism (how the skin is
> defined and made registry-extractable) is owned by W4 and being finalized; it
> determines the concrete files `<skin source>` points at. The generator is
> source-shape-agnostic — see "Wiring to the real skin source" below.

Everything the generator can derive from the skin, it derives:

| Field                     | Source                                            |
| ------------------------- | ------------------------------------------------- |
| file content              | the skin `.tsx`, verbatim (only `name:` reprefixed) |
| `name`, `title`           | the skin filename                                 |
| `dependencies` (npm)      | the skin's imports (external packages)            |
| `registryDependencies`    | the skin's relative imports of sibling skins      |
| `description`, `categories` | the co-located manifest                         |
| `native` / token / theme assumptions | the co-located manifest                |

The manifest (`SkinManifest` in `scripts/lib/registry/types.ts`) holds only what a
static scan cannot see. Listing an npm dep there that the imports already reveal
would break the DRY bar.

## The one legitimate variation: `name:`

A styled component's `name:` string is its identity (used for debugging and
compiler extraction). It is the ONLY thing that legitimately differs between the
skin, the shipped registry copy, and each downstream copy. The generator
reprefixes it; everything else is byte-identical. That is what makes the drift
check exact: any other difference is drift.

- skin → shipped registry copy: prefix stripped (`ButtonFrame`).
- skin → demos copy: `DemoButtonFrame`; kitchen-sink: `KitchenSinkButtonFrame`; etc.

## Commands

```bash
bun run registry:build       # generate registry.json + r/*.json
bun run registry:check       # fail if the checked-in artifacts are stale (CI)
bun run registry:validate    # shadcn-schema-validate the generated registry
bun run registry:drift       # report which downstream copies drift from the skin source
bun run registry:write-consumers  # write generated copies into write-authorized consumers

# drift, strict, only the generator-owned blank apps (CI gate):
bun ./scripts/generate-registry.ts drift --only-authorized --strict
```

## CI (`.github/workflows/registry.yml`)

1. **generate** — artifacts up to date + shadcn-valid + blank-app copies match the skin source.
2. **web** — build the packages the app needs, install the item into
   `registry/ci/blank-web`, prove the install output equals the committed copy,
   `vite build`, then a Playwright click smoke (the Button's `onPress` drives a
   counter).
3. **expo** — same install proof, a react-test-renderer press smoke under native
   resolution, then `expo export` (a real Metro/Hermes bundle).

## Wiring to the real skin source

Today the generator targets a fixture (`registry/__fixtures__/skins/`) that
mirrors the layout it consumes, so the whole pipeline is validated before the
real styled source is extractable. When W4's `styled = unstyled + skin`
mechanism lands, flip one constant in `scripts/lib/registry/config.ts`:

```ts
export const USE_REAL_SKIN_SOURCE = true   // skinSourceRoot → the real styled source
// canonicalNamePrefix auto-switches to '' (real skins use bare names)
```

Then `bun run registry:build && bun run registry:write-consumers`. No other
change: the generator, schema, drift check, installer, and blank-app harness are
all source-shape-agnostic.

## Layout

```
registry/
  schema/           vendored shadcn registry + registry-item JSON schemas
  json/             GENERATED (checked in): registry.json + r/<name>.json
  ci/blank-web/     blank vite+tamagui app — install target + web smoke
  ci/blank-expo/    blank expo+tamagui app — install target + native smoke
  __fixtures__/skins/ stub skin source (Button pilot) until the real one is extractable
scripts/
  generate-registry.ts   CLI: build | check | validate | drift | write-consumers
  registry-install.ts    minimal shadcn-compatible installer (used by CI)
  lib/registry/          generator internals
```

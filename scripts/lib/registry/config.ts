import { join } from 'node:path'

// repo root (this file is scripts/lib/registry/config.ts)
export const repoRoot = join(import.meta.dir, '..', '..', '..')

// ---------------------------------------------------------------------------
// skin source root — the single source of truth.
//
// the styled components live in `tamagui` (code/ui/tamagui) = the unstyled
// `@tamagui/ui` primitive + ONE default skin definition layered on top
// (one <Component>.tsx skin + co-located <Component>.manifest.ts per
// primitive). the registry generates FROM that styled skin source.
// ---------------------------------------------------------------------------

export const skinSourceRoot = join(repoRoot, 'code/ui/tamagui/src/components')
export const skinPackagePath = join(repoRoot, 'code/ui/tamagui/package.json')

// where generated registry artifacts are written (checked in, served in CI)
export const outDir = join(repoRoot, 'registry/json')

// registry index metadata
export const registryName = 'tamagui'
export const registryHomepage = 'https://tamagui.dev'

// base url the served registry items live at. when set, cross-skin
// registryDependencies are emitted as absolute urls (real shadcn CLI, cross
// registry). left empty → bare item names (our own installer resolves them
// within this registry).
export const registryBaseUrl = ''

// target path prefix for installed skin files inside a consumer app. shadcn
// `registry:ui` items default to the app's ui dir; we pin an explicit,
// tamagui-namespaced target so the installer is unambiguous on web AND expo.
export const installTargetDir = 'components/tamagui'

// import specifiers that are PEER responsibilities of the consuming app, not
// npm deps shadcn installs per-item. excluded from derived `dependencies`.
export const providedPeers = new Set([
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react-native',
])

// ---------------------------------------------------------------------------
// drift consumers — the checked-in copies of each skin that live in
// downstream apps. the SAME generator emits these; a CI drift check fails if
// any real copy diverges from what the skin source would generate. the ONLY legitimate
// per-consumer variation is the styled() `displayName:` prefix (used for React
// identity / debugging); everything else must be byte-identical to the skin source.
//
// `canonicalDisplayNamePrefix` is the prefix the skin source uses in its `displayName:`
// fields. each consumer swaps it for its own prefix. the real styled source
// uses bare names, so the canonical prefix is empty.
// ---------------------------------------------------------------------------

export const canonicalDisplayNamePrefix = ''

export type DriftConsumer = {
  key: string
  // styled() displayName: prefix this consumer uses
  displayNamePrefix: string
  // directory holding the consumer's copies, relative to repo root
  dir: string
  // filename for a given skin basename (e.g. 'Button' -> 'Button.tsx')
  filename: (skinBase: string) => string
  // whether the generator is authorized to WRITE this consumer's real files.
  // held false until the skin source lands + the campaign signs off on flipping consumers
  // to generated copies (avoids clobbering other workers' active files). the
  // drift CHECK still runs against real files regardless — it only reads.
  writeAuthorized: boolean
}

export const driftConsumers: DriftConsumer[] = [
  {
    key: 'demos',
    displayNamePrefix: 'Demo',
    dir: 'code/demos/src',
    filename: (b) => `${b}.tsx`,
    writeAuthorized: false,
  },
  {
    key: 'kitchen-sink',
    displayNamePrefix: 'KitchenSink',
    dir: 'code/kitchen-sink/src/components',
    filename: (b) => `${b}.tsx`,
    writeAuthorized: false,
  },
  {
    key: 'site',
    displayNamePrefix: 'Site',
    dir: 'code/tamagui.dev/components',
    filename: (b) => `${b}.tsx`,
    writeAuthorized: false,
  },
  {
    key: 'v3-canary',
    displayNamePrefix: 'Canary',
    dir: 'code/tests/v3-canary/src/components',
    filename: (b) => `${b}.tsx`,
    writeAuthorized: false,
  },
  // the blank CI apps consume the exact SHIPPED registry copy (neutral names).
  // these are generator-owned, so writes are authorized: the committed copies
  // ARE the install output, kept honest by the drift check.
  {
    key: 'ci-blank-web',
    displayNamePrefix: '',
    dir: 'registry/ci/blank-web/components/tamagui',
    filename: (b) => `${b}.tsx`,
    writeAuthorized: true,
  },
  {
    key: 'ci-blank-expo',
    displayNamePrefix: '',
    dir: 'registry/ci/blank-expo/components/tamagui',
    filename: (b) => `${b}.tsx`,
    writeAuthorized: true,
  },
]

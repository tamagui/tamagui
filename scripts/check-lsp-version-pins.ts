// `@tamagui/lsp` pins each per-platform binary package at an exact version, and
// those leaves are built from the umbrella's own version (see
// code/lsp/npm/build-platform-packages.mjs). The release script bumps `version`
// and has no reason to know these pins exist, so without this check a release
// publishes an umbrella depending on eight packages that were never published
// at that version. npm treats them as optional, so nothing fails loudly: the
// install just silently has no binary and every editor reports "not installed".
//
// Run by `bun run check`.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const umbrellaPath = join(
  import.meta.dirname,
  '..',
  'code/lsp/npm/tamagui-lsp/package.json'
)

type Manifest = {
  name: string
  version: string
  optionalDependencies?: Record<string, string>
}

function mismatches(manifest: Manifest) {
  return Object.entries(manifest.optionalDependencies ?? {}).filter(
    ([, range]) => range !== manifest.version
  )
}

// a check that cannot fail is not a check: prove the comparison discriminates
// before trusting the real one
const selfTest = mismatches({
  name: 'self-test',
  version: '9.9.9',
  optionalDependencies: { '@tamagui/lsp-darwin-arm64': '9.9.8' },
})
if (selfTest.length !== 1) {
  console.error('✗ check-lsp-version-pins self-test failed; the check is broken')
  process.exit(1)
}

const umbrella: Manifest = JSON.parse(readFileSync(umbrellaPath, 'utf8'))
const pins = Object.entries(umbrella.optionalDependencies ?? {})

if (pins.length === 0) {
  console.error(
    `✗ ${umbrella.name} declares no optionalDependencies.\n` +
      `  The per-platform binaries are how the server ships; without them npm\n` +
      `  installs no executable at all.`
  )
  process.exit(1)
}

const stale = mismatches(umbrella)
if (stale.length > 0) {
  console.error(`✗ ${umbrella.name} is ${umbrella.version} but pins:`)
  for (const [name, range] of stale) console.error(`    ${name}@${range}`)
  console.error(
    `\n  Fix: cd code/lsp/npm && node build-platform-packages.mjs\n` +
      `  (it repins them from the umbrella version, which is the source of truth)`
  )
  process.exit(1)
}

console.info(`✓ @tamagui/lsp pins ${pins.length} platform binaries at ${umbrella.version}`)

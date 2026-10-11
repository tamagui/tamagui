// Builds the per-platform npm packages for the Rust language server.
//
// Shape verified against esbuild (25 platform packages), oxlint (19), Rollup
// (27) and Biome (8): the umbrella lists every leaf in `optionalDependencies`,
// and each leaf declares `os`/`cpu` (plus `libc` on linux) and carries nothing
// but the executable. npm then installs exactly one.
//
//   node build-platform-packages.mjs            # host target only
//   node build-platform-packages.mjs --all      # every target (needs toolchains)

import { execFileSync } from 'node:child_process'
import { chmodSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const workspace = join(here, '..')
const umbrella = JSON.parse(readFileSync(join(here, 'tamagui-lsp/package.json'), 'utf8'))

/** rust target triple -> the npm leaf it produces */
const TARGETS = [
  { rust: 'aarch64-apple-darwin', pkg: 'lsp-darwin-arm64', os: 'darwin', cpu: 'arm64' },
  { rust: 'x86_64-apple-darwin', pkg: 'lsp-darwin-x64', os: 'darwin', cpu: 'x64' },
  {
    rust: 'aarch64-unknown-linux-gnu',
    pkg: 'lsp-linux-arm64-gnu',
    os: 'linux',
    cpu: 'arm64',
    libc: 'glibc',
  },
  {
    rust: 'aarch64-unknown-linux-musl',
    pkg: 'lsp-linux-arm64-musl',
    os: 'linux',
    cpu: 'arm64',
    libc: 'musl',
  },
  {
    rust: 'x86_64-unknown-linux-gnu',
    pkg: 'lsp-linux-x64-gnu',
    os: 'linux',
    cpu: 'x64',
    libc: 'glibc',
  },
  {
    rust: 'x86_64-unknown-linux-musl',
    pkg: 'lsp-linux-x64-musl',
    os: 'linux',
    cpu: 'x64',
    libc: 'musl',
  },
  { rust: 'aarch64-pc-windows-msvc', pkg: 'lsp-win32-arm64', os: 'win32', cpu: 'arm64' },
  { rust: 'x86_64-pc-windows-msvc', pkg: 'lsp-win32-x64', os: 'win32', cpu: 'x64' },
]

const hostTriple = execFileSync('rustc', ['-vV'], { encoding: 'utf8' })
  .split('\n')
  .find((line) => line.startsWith('host:'))
  .slice('host:'.length)
  .trim()

const wanted = process.argv.includes('--all')
  ? TARGETS
  : TARGETS.filter((t) => t.rust === hostTriple)

if (wanted.length === 0) {
  console.error(`no target matches host ${hostTriple}; pass --all to build every target`)
  process.exit(1)
}

for (const target of wanted) {
  console.info(`building ${target.rust}`)
  execFileSync(
    'cargo',
    ['build', '--release', '-p', 'tamagui-lsp', '--target', target.rust],
    {
      cwd: workspace,
      stdio: 'inherit',
    }
  )

  const exe = target.os === 'win32' ? 'tamagui-lsp.exe' : 'tamagui-lsp'
  const outDir = join(here, target.pkg)
  mkdirSync(outDir, { recursive: true })

  const manifest = {
    name: `@tamagui/${target.pkg}`,
    version: umbrella.version,
    description: `The ${target.os}-${target.cpu} binary for @tamagui/lsp`,
    license: 'MIT',
    repository: umbrella.repository,
    // npm reads these to decide whether this optional dependency applies
    os: [target.os],
    cpu: [target.cpu],
    ...(target.libc ? { libc: [target.libc] } : {}),
    files: [exe],
    publishConfig: { access: 'public' },
  }
  writeFileSync(join(outDir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`)

  const built = join(workspace, 'target', target.rust, 'release', exe)
  const dest = join(outDir, exe)
  copyFileSync(built, dest)
  if (target.os !== 'win32') chmodSync(dest, 0o755)

  console.info(`  -> ${dest}`)
}

// the umbrella must list exactly the leaves that exist, or npm silently
// installs nothing on a platform whose leaf was never published
const declared = Object.keys(umbrella.optionalDependencies).sort()
const expected = TARGETS.map((t) => `@tamagui/${t.pkg}`).sort()
if (JSON.stringify(declared) !== JSON.stringify(expected)) {
  console.error('umbrella optionalDependencies do not match the target list:')
  console.error(`  declared: ${declared.join(', ')}`)
  console.error(`  expected: ${expected.join(', ')}`)
  process.exit(1)
}

// each leaf is versioned from the umbrella, so the umbrella must pin exactly
// its own version. the release script bumps `version` but has no reason to know
// these pins exist, which would otherwise publish an umbrella depending on
// leaves that were never published at that version.
const stale = Object.entries(umbrella.optionalDependencies).filter(
  ([, range]) => range !== umbrella.version
)
if (stale.length > 0) {
  for (const [name, range] of stale) {
    umbrella.optionalDependencies[name] = umbrella.version
    console.info(`  repinned ${name} ${range} -> ${umbrella.version}`)
  }
  writeFileSync(
    join(here, 'tamagui-lsp/package.json'),
    `${JSON.stringify(umbrella, null, 2)}\n`
  )
}
console.info(`umbrella pins ${declared.length} leaves at ${umbrella.version}`)

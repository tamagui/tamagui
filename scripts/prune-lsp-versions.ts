// Unpublishes superseded `@tamagui/lsp` versions across all nine packages.
//
// The language server ships as an umbrella plus eight per-platform binaries,
// each carrying a real executable, so every beta leaves ~8 binary tarballs on
// npm that nothing will ever install again. npm caps how much a package may
// hold, so they accumulate toward a real limit rather than merely being untidy.
//
// npm's own rules are the safety net and this script does not try to restate
// them: an unpublish is refused once anything depends on the version, once it
// has meaningful downloads, or once it is old enough to be someone's lockfile
// pin. A refusal here is npm saying that version is in use, which is the
// answer, so it is reported and the run continues.
//
//   bun scripts/prune-lsp-versions.ts                      # what it would do
//   bun scripts/prune-lsp-versions.ts --execute --otp 123456
//   bun scripts/prune-lsp-versions.ts --version 2.7.7 --execute --otp 123456
//
// The one rule npm will NOT enforce for us: unpublishing a package's last
// remaining version deletes the package itself, which takes its trusted
// publisher config with it and blocks the name for 24 hours. The nine configs
// on npmjs.com are the whole reason releases work without a token in the repo,
// so this refuses to empty a package.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const execute = args.includes('--execute')
const otp = args[args.indexOf('--otp') + 1]
const explicit = args.includes('--version') ? args[args.indexOf('--version') + 1] : ''

if (args.includes('--otp') && !otp) {
  console.error('--otp needs a code')
  process.exit(1)
}
if (args.includes('--version') && !explicit) {
  console.error('--version needs a version')
  process.exit(1)
}

const umbrella = JSON.parse(
  readFileSync(
    join(import.meta.dirname, '../code/lsp/npm/tamagui-lsp/package.json'),
    'utf8'
  )
) as { name: string; optionalDependencies?: Record<string, string> }

// the umbrella's own pins are the list of packages, the same source the release
// workflow and check-lsp-version-pins.ts read, so the three cannot disagree
const packages = [umbrella.name, ...Object.keys(umbrella.optionalDependencies ?? {})]

function npm(argv: string[]) {
  const result = Bun.spawnSync(['npm', ...argv], { stdout: 'pipe', stderr: 'pipe' })
  return {
    ok: result.exitCode === 0,
    out: new TextDecoder().decode(result.stdout).trim(),
    err: new TextDecoder().decode(result.stderr).trim(),
  }
}

const published = npm(['view', umbrella.name, 'versions', '--json'])
if (!published.ok) {
  console.error(`could not read ${umbrella.name} from npm:\n${published.err}`)
  process.exit(1)
}
const versions: string[] = JSON.parse(published.out)

// prereleases are the prunable ones. a stable version is someone's dependency
// whether or not npm has noticed yet, and `0.0.0-bootstrap.0` is the placeholder
// that created each package and its trusted publisher config.
const betas = versions.filter((v) => v.includes('-') && !v.startsWith('0.0.0-bootstrap'))
const newestBeta = betas.at(-1)

const targets = explicit ? [explicit] : betas.filter((v) => v !== newestBeta)

if (targets.length === 0) {
  console.info(
    `nothing to prune: ${betas.length} beta(s) published, newest is ${newestBeta ?? 'none'}`
  )
  process.exit(0)
}

console.info(
  `${execute ? 'pruning' : 'would prune'} ${targets.join(', ')} from ${packages.length} packages\n`
)

let removed = 0
let refused = 0
for (const version of targets) {
  // the umbrella goes first. the reverse order would leave it on npm for a
  // moment pinning leaves that no longer exist, and npm treats a missing
  // optional dependency as a successful install with no binary at all.
  for (const name of packages) {
    const spec = `${name}@${version}`
    const remaining = npm(['view', name, 'versions', '--json'])
    if (!remaining.ok) {
      console.info(`  - ${spec}: not published`)
      continue
    }
    const list: string[] = JSON.parse(remaining.out)
    if (!list.includes(version)) {
      console.info(`  - ${spec}: not published`)
      continue
    }
    if (list.length === 1) {
      console.error(
        `  ! ${spec}: the only version left; unpublishing it would delete the package and its trusted publisher config`
      )
      refused++
      continue
    }
    if (!execute) {
      console.info(`  ~ ${spec}`)
      continue
    }
    const result = npm(['unpublish', spec, ...(otp ? ['--otp', otp] : [])])
    if (result.ok) {
      console.info(`  ✓ ${spec}`)
      removed++
    } else {
      console.error(`  ! ${spec}: ${result.err.split('\n')[0]}`)
      refused++
    }
  }
}

console.info(`\n${removed} unpublished, ${refused} refused`)
if (!execute) console.info('this was a dry run; pass --execute to do it')
process.exit(refused > 0 && execute ? 1 : 0)

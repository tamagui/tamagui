// watches one v3-beta sha all the way to a fully published npm beta.
//
// two things make the naive checks wrong:
// - a v3-beta push cuts a beta only when the Checks workflow goes green, so
//   watching Checks alone tells you nothing about whether the beta exists.
// - the Release job publishes ~166 packages one at a time, and `tamagui`
//   itself lands early. its dist-tag flipping means the cut STARTED, not that
//   it finished: on 3.0.0-beta.1173.1 `tamagui` and `@tamagui/toast` were up
//   while core, config, themes, web, cli and style-grammar were still on the
//   previous beta. a consumer that bumps its pins at that point cannot install.
//
// so the receipt is every package in PROBE carrying the same new version.
// exit 0: all of them are on one version newer than --since; prints it.
// exit 1: Checks failed, the Release run failed, or the deadline passed.
// usage: bun scripts/ops/watch-beta.ts --sha <sha> [--since <version>] [--timeout-min 60]
//
// polls once a minute inside this process so the caller can sleep through it
// with `tm wait --exec` instead of burning turns. only the Checks workflow
// gates the cut: Android Detox and the ios jobs are deliberately ignored.

// spread across the dependency graph so a partial publish cannot look complete.
const PROBE = [
  'tamagui',
  '@tamagui/core',
  '@tamagui/web',
  '@tamagui/config',
  '@tamagui/themes',
  '@tamagui/cli',
  '@tamagui/style-grammar',
]

const args = process.argv.slice(2)
const readFlag = (name: string) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? undefined : args[index + 1]
}

const sha = readFlag('sha')
if (!sha) {
  console.error('usage: bun scripts/ops/watch-beta.ts --sha <sha> [--since <version>]')
  process.exit(2)
}
const repo = readFlag('repo') ?? 'tamagui/tamagui'
const since = readFlag('since')
const deadline = Date.now() + Number(readFlag('timeout-min') ?? 60) * 60_000
// the workflow-runs api matches head_sha exactly, so a short sha silently
// returns zero runs and the watcher waits forever on nothing.
const fullSha = Bun.spawnSync(['git', 'rev-parse', sha]).stdout.toString().trim()

// gh colors json when FORCE_COLOR is set, which this agent env always has.
const env = { ...process.env, NO_COLOR: '1' }
delete env.FORCE_COLOR
delete env.CLICOLOR_FORCE

const run = (cmd: string[]) => {
  const proc = Bun.spawnSync(cmd, { env })
  return proc.exitCode === 0 ? proc.stdout.toString() : null
}

const betaTags = () =>
  PROBE.map((name) => ({
    name,
    version: run(['npm', 'view', name, 'dist-tags.beta'])?.trim() || null,
  }))

const checksRuns = () => {
  const out = run([
    'gh',
    'api',
    `repos/${repo}/actions/workflows/checks.yaml/runs?head_sha=${fullSha}&per_page=20`,
    '--jq',
    '[.workflow_runs[] | {id, status, conclusion, event}]',
  ])
  return out
    ? (JSON.parse(out) as {
        id: number
        status: string
        conclusion: string | null
        event: string
      }[])
    : null
}

// release.yml is triggered by workflow_run, so github reports main's tip as its
// head_sha for every run. it cannot be matched to this push by sha; take the
// runs started after Checks went green instead.
const releaseRunsSince = (iso: string) => {
  const out = run([
    'gh',
    'api',
    `repos/${repo}/actions/workflows/release.yml/runs?per_page=10`,
    '--jq',
    `[.workflow_runs[] | select(.created_at > "${iso}") | {id, status, conclusion}]`,
  ])
  return out
    ? (JSON.parse(out) as { id: number; status: string; conclusion: string | null }[])
    : null
}

const bad = new Set(['failure', 'cancelled', 'timed_out', 'startup_failure'])
let checksGreenAt: string | null = null

while (Date.now() < deadline) {
  const tags = betaTags()
  const versions = new Set(tags.map((tag) => tag.version))
  const only = versions.size === 1 ? [...versions][0] : null
  if (only && only !== since) {
    console.log(`published: ${only} across ${PROBE.length} probed packages`)
    process.exit(0)
  }

  if (!checksGreenAt) {
    const checks = (checksRuns() ?? []).filter((r) => r.event === 'push')
    const failed = checks.find((r) => r.conclusion && bad.has(r.conclusion))
    if (failed) {
      console.error(
        `Checks ${failed.conclusion}: https://github.com/${repo}/actions/runs/${failed.id}`
      )
      process.exit(1)
    }
    if (checks.some((r) => r.conclusion === 'success')) {
      checksGreenAt = new Date(Date.now() - 10 * 60_000).toISOString()
      console.log('Checks green, waiting on the beta publish')
    } else {
      console.log(`Checks pending (${checks.length} runs)`)
    }
  } else {
    const release = releaseRunsSince(checksGreenAt) ?? []
    const failed = release.find((r) => r.conclusion && bad.has(r.conclusion))
    if (failed) {
      console.error(
        `Release ${failed.conclusion}: https://github.com/${repo}/actions/runs/${failed.id}`
      )
      process.exit(1)
    }
    const lagging = tags.filter((tag) => tag.version === since || tag.version === null)
    console.log(
      `publishing: ${PROBE.length - lagging.length}/${PROBE.length} probed packages moved off ${since}`
    )
  }

  await new Promise((resolve) => setTimeout(resolve, 60_000))
}

console.error(
  `deadline passed, probed beta tags: ${betaTags()
    .map((t) => `${t.name}=${t.version}`)
    .join(' ')}`
)
process.exit(1)

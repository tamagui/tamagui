// watches every github actions run for one sha to a terminal state.
// exit 0: all runs completed successfully (or were skipped).
// exit 1: any run failed, was cancelled, or timed out.
// usage: bun scripts/ops/watch-ci.ts --sha <sha> [--repo tamagui/tamagui]
//
// polls the api once a minute inside this process so the caller can sleep
// through it with `tm wait --exec` instead of burning turns.

const args = process.argv.slice(2)
const readFlag = (name: string) => {
  const index = args.indexOf(`--${name}`)
  return index === -1 ? undefined : args[index + 1]
}

const sha = readFlag('sha')
const repo = readFlag('repo') ?? 'tamagui/tamagui'
if (!sha) {
  console.error('usage: bun scripts/ops/watch-ci.ts --sha <sha> [--repo owner/name]')
  process.exit(2)
}

const bad = new Set(['failure', 'cancelled', 'timed_out', 'startup_failure'])

// transient network errors (TLS handshake timeouts, DNS blips) must not kill
// a watcher; only a sustained outage is terminal
let consecutiveFetchFailures = 0

while (true) {
  const proc = Bun.spawnSync([
    'gh',
    'api',
    `repos/${repo}/commits/${sha}/check-runs?per_page=100`,
    '--jq',
    '[.check_runs[] | {name, status, conclusion}]',
  ])
  if (proc.exitCode !== 0) {
    consecutiveFetchFailures++
    console.error(
      `fetch failed (${consecutiveFetchFailures}/10): ${proc.stderr.toString().trim()}`
    )
    if (consecutiveFetchFailures >= 10) process.exit(2)
    await new Promise((resolve) => setTimeout(resolve, 60_000))
    continue
  }
  consecutiveFetchFailures = 0
  const runs: { name: string; status: string; conclusion: string | null }[] = JSON.parse(
    proc.stdout.toString()
  )
  const failed = runs.filter((run) => run.conclusion && bad.has(run.conclusion))
  const pending = runs.filter((run) => run.status !== 'completed')
  if (failed.length > 0) {
    for (const run of failed) console.error(`failed: ${run.name} (${run.conclusion})`)
    process.exit(1)
  }
  if (runs.length > 0 && pending.length === 0) {
    for (const run of runs) console.log(`ok: ${run.name} (${run.conclusion})`)
    process.exit(0)
  }
  console.log(`${runs.length - pending.length}/${runs.length} complete`)
  await new Promise((resolve) => setTimeout(resolve, 60_000))
}

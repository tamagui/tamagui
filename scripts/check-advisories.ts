// gates on critical npm advisories. all criticals are pinned to patched
// versions via root package.json "overrides", so this needs no ignore list.
//
// `bun audit --audit-level critical` alone conflates two very different
// outcomes in its exit code: "npm reports a critical advisory" and "npm did not
// answer". A registry 503 hard-failed the whole checks job for everyone, before
// check/typecheck/lint had run, which is a security gate reporting a network
// outage as a finding. So ask for --json and decide on what came back: a parsed
// body gates, an unreachable registry retries and then says so without claiming
// the tree is clean.

const ATTEMPT_TIMEOUT_MS = 90_000
const ATTEMPTS = 3

type Advisory = {
  id: number
  url: string
  title: string
  severity: string
}

async function runAudit(): Promise<Record<string, Advisory[]> | null> {
  const proc = Bun.spawn(['bun', 'audit', '--json'], {
    stdout: 'pipe',
    stderr: 'pipe',
  })

  const timer = setTimeout(() => proc.kill(), ATTEMPT_TIMEOUT_MS)
  const [stdout, stderr] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
  ])
  await proc.exited
  clearTimeout(timer)

  try {
    return JSON.parse(stdout)
  } catch {
    console.log(`  registry did not answer: ${(stderr || stdout).trim().slice(0, 200)}`)
    return null
  }
}

let report: Record<string, Advisory[]> | null = null

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  report = await runAudit()
  if (report) break
  if (attempt < ATTEMPTS) {
    await Bun.sleep(attempt * 5000)
  }
}

if (!report) {
  console.log(
    `⚠ could not reach the npm advisory registry in ${ATTEMPTS} attempts, skipping the advisory gate`
  )
  process.exit(0)
}

const critical = Object.entries(report).flatMap(([name, advisories]) =>
  advisories.filter((a) => a.severity === 'critical').map((a) => ({ name, ...a }))
)

if (critical.length) {
  console.error(`✗ ${critical.length} critical advisories:`)
  for (const a of critical) {
    console.error(`  ${a.name}: ${a.title}\n    ${a.url}`)
  }
  console.error(`\npin a patched version in the root package.json "overrides"`)
  process.exit(1)
}

const total = Object.values(report).reduce((n, a) => n + a.length, 0)
console.log(
  `✓ no critical advisories (${total} high/moderate/low, run \`bun audit\` to review)`
)

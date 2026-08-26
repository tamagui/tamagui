const shaFlag = Bun.argv.indexOf('--sha')
const sha = shaFlag === -1 ? undefined : Bun.argv[shaFlag + 1]

if (!sha) {
  console.error('usage: bun scripts/watch-ci.ts --sha <commit>')
  process.exit(2)
}

const repositoryResult = Bun.spawnSync([
  'gh',
  'repo',
  'view',
  '--json',
  'nameWithOwner',
  '--jq',
  '.nameWithOwner',
])

if (!repositoryResult.success) {
  console.error(repositoryResult.stderr.toString())
  process.exit(repositoryResult.exitCode)
}

const repository = repositoryResult.stdout.toString().trim()
let terminalSince = 0
let terminalRunIds = ''

while (true) {
  const result = Bun.spawnSync([
    'gh',
    'run',
    'list',
    '--repo',
    repository,
    '--commit',
    sha,
    '--limit',
    '50',
    '--json',
    'databaseId,status,conclusion,workflowName,url',
  ])

  if (!result.success) {
    console.error(result.stderr.toString())
    process.exit(result.exitCode)
  }

  const runs = JSON.parse(result.stdout.toString()) as Array<{
    databaseId: number
    status: string
    conclusion: string
    workflowName: string
    url: string
  }>

  if (runs.length > 0 && runs.every((run) => run.status === 'completed')) {
    const runIds = runs
      .map((run) => run.databaseId)
      .sort((a, b) => a - b)
      .join(',')

    if (runIds !== terminalRunIds) {
      terminalRunIds = runIds
      terminalSince = Date.now()
    } else if (Date.now() - terminalSince >= 30_000) {
      for (const run of runs) {
        console.info(`${run.workflowName}: ${run.conclusion} ${run.url}`)
      }

      const accepted = new Set(['success', 'neutral', 'skipped'])
      process.exit(runs.every((run) => accepted.has(run.conclusion)) ? 0 : 1)
    }
  } else {
    terminalSince = 0
    terminalRunIds = ''
  }

  await Bun.sleep(15_000)
}

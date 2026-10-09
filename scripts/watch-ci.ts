import { spawnSync } from 'node:child_process'
import { setTimeout } from 'node:timers/promises'

const shaFlag = process.argv.indexOf('--sha')
const sha = shaFlag === -1 ? undefined : process.argv[shaFlag + 1]

const workflows = new Set<string>()
for (let index = 2; index < process.argv.length; index++) {
  if (process.argv[index] === '--workflow') {
    const name = process.argv[++index]
    if (!name || name.startsWith('--')) {
      console.error('--workflow requires a workflow name')
      process.exit(2)
    }
    workflows.add(name)
  }
}

if (!sha) {
  console.error('usage: bun scripts/watch-ci.ts --sha <commit> [--workflow <name>]')
  process.exit(2)
}

const repositoryResult = spawnSync('gh', [
  'repo',
  'view',
  '--json',
  'nameWithOwner',
  '--jq',
  '.nameWithOwner',
])

if (repositoryResult.status !== 0) {
  console.error(repositoryResult.stderr.toString())
  process.exit(repositoryResult.status ?? 1)
}

const repository = repositoryResult.stdout.toString().trim()
const commitResult = spawnSync('git', ['rev-parse', '--verify', `${sha}^{commit}`])

if (commitResult.status !== 0) {
  console.error(commitResult.stderr.toString())
  process.exit(commitResult.status ?? 1)
}

const commit = commitResult.stdout.toString().trim()
let terminalSince = 0
let terminalRunIds = ''

while (true) {
  const result = spawnSync('gh', [
    'run',
    'list',
    '--repo',
    repository,
    '--commit',
    commit,
    '--limit',
    '50',
    '--json',
    'databaseId,status,conclusion,workflowName,url',
  ])

  if (result.status !== 0) {
    console.error(result.stderr.toString())
    process.exit(result.status ?? 1)
  }

  const allRuns = JSON.parse(result.stdout.toString())
  if (
    !Array.isArray(allRuns) ||
    allRuns.some(
      (run) =>
        !run ||
        typeof run.databaseId !== 'number' ||
        typeof run.status !== 'string' ||
        typeof run.conclusion !== 'string' ||
        typeof run.workflowName !== 'string' ||
        typeof run.url !== 'string'
    )
  ) {
    console.error('github returned an invalid workflow run list')
    process.exit(2)
  }

  let runs = allRuns.filter(
    (run) => workflows.size === 0 || workflows.has(run.workflowName)
  )
  if (workflows.size > 0) {
    const latestRuns = new Map<string, (typeof runs)[number]>()
    for (const run of runs) {
      const previous = latestRuns.get(run.workflowName)
      if (!previous || run.databaseId > previous.databaseId) {
        latestRuns.set(run.workflowName, run)
      }
    }
    runs = [...latestRuns.values()]
  }
  const allWorkflowsPresent = [...workflows].every((name) =>
    runs.some((run) => run.workflowName === name)
  )

  if (
    allWorkflowsPresent &&
    runs.length > 0 &&
    runs.every((run) => run.status === 'completed')
  ) {
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

      const accepted = new Set(
        workflows.size > 0 ? ['success'] : ['success', 'neutral', 'skipped']
      )
      process.exit(runs.every((run) => accepted.has(run.conclusion)) ? 0 : 1)
    }
  } else {
    terminalSince = 0
    terminalRunIds = ''
  }

  await setTimeout(120_000)
}

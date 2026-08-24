import { execFile } from 'node:child_process'
import { appendFile } from 'node:fs/promises'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

type ReleasePullRequest = {
  number: number
  state: 'open' | 'closed'
  merged_at: string | null
  merge_commit_sha: string | null
  head: {
    ref: string
    sha: string
  }
}

type WorkflowRun = {
  id: number
  event: string
  head_sha: string
  status: string
  conclusion: string | null
  created_at: string
}

export type StableReleaseOperations = {
  verifyPreparedCommit(version: string, targetSha: string): Promise<void>
  findPullRequests(branch: string): Promise<ReleasePullRequest[]>
  getCurrentMainSha(): Promise<string>
  ensureReleaseBranch(branch: string): Promise<void>
  createPullRequest(branch: string, version: string): Promise<ReleasePullRequest>
  listChecksRuns(headSha: string): Promise<WorkflowRun[]>
  dispatchChecks(branch: string): Promise<void>
  getWorkflowRun(runId: number): Promise<WorkflowRun>
  squashPullRequest(pullRequest: ReleasePullRequest): Promise<void>
  getPullRequest(number: number): Promise<ReleasePullRequest>
  verifyMergedCommit(sha: string): Promise<void>
  sleep(ms: number): Promise<void>
}

function latestRun(runs: WorkflowRun[], headSha: string) {
  return runs
    .filter((run) => run.head_sha === headSha)
    .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0]
}

async function requireSuccessfulChecks(
  headSha: string,
  branch: string,
  operations: StableReleaseOperations
) {
  let runs = await operations.listChecksRuns(headSha)
  let run = latestRun(runs, headSha)

  if (!run) {
    const previousRunIds = new Set(runs.map(({ id }) => id))
    await operations.dispatchChecks(branch)

    for (let attempt = 0; attempt < 12; attempt++) {
      await operations.sleep(10_000)
      runs = await operations.listChecksRuns(headSha)
      run = latestRun(
        runs.filter(
          ({ id, event }) => event === 'workflow_dispatch' && !previousRunIds.has(id)
        ),
        headSha
      )
      if (run) break
    }

    if (!run) {
      throw new Error(`Checks did not start for ${headSha}`)
    }
  }

  for (let attempt = 0; attempt < 50; attempt++) {
    if (run.status === 'completed') {
      if (run.conclusion !== 'success') {
        throw new Error(`Checks run ${run.id} concluded ${run.conclusion}`)
      }
      return
    }

    await operations.sleep(120_000)
    run = await operations.getWorkflowRun(run.id)
  }

  throw new Error(`Timed out waiting for Checks run ${run.id}`)
}

export async function mergeStableRelease(
  version: string,
  targetSha: string,
  operations: StableReleaseOperations
) {
  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`Stable release version must be X.Y.Z, received ${version}`)
  }
  if (!/^[0-9a-f]{40}$/.test(targetSha)) {
    throw new Error(`Invalid release source SHA ${targetSha}`)
  }

  await operations.verifyPreparedCommit(version, targetSha)

  // refs/heads/release already exists, so a release/... namespace cannot be created.
  const branch = `release-v${version}-${targetSha}`
  const existingPullRequests = await operations.findPullRequests(branch)
  if (existingPullRequests.length > 1) {
    throw new Error(`Multiple pull requests use ${branch}`)
  }

  let pullRequest = existingPullRequests[0]
  if (pullRequest?.merged_at) {
    if (!pullRequest.merge_commit_sha) {
      throw new Error(`Merged pull request #${pullRequest.number} has no merge commit`)
    }
    await operations.verifyMergedCommit(pullRequest.merge_commit_sha)
    return pullRequest.merge_commit_sha
  }
  if (pullRequest?.state === 'closed') {
    throw new Error(
      `Release pull request #${pullRequest.number} was closed without merging`
    )
  }

  if (!pullRequest) {
    const mainSha = await operations.getCurrentMainSha()
    if (mainSha !== targetSha) {
      throw new Error(`main advanced from ${targetSha} to ${mainSha}`)
    }
  }

  await operations.ensureReleaseBranch(branch)
  pullRequest ||= await operations.createPullRequest(branch, version)

  await requireSuccessfulChecks(pullRequest.head.sha, branch, operations)

  pullRequest = await operations.getPullRequest(pullRequest.number)
  if (!pullRequest.merged_at) {
    const mainSha = await operations.getCurrentMainSha()
    if (mainSha !== targetSha) {
      throw new Error(`main advanced from ${targetSha} to ${mainSha}`)
    }
    await operations.squashPullRequest(pullRequest)
  }

  for (let attempt = 0; attempt < 50; attempt++) {
    pullRequest = await operations.getPullRequest(pullRequest.number)
    if (pullRequest.merged_at) {
      if (!pullRequest.merge_commit_sha) {
        throw new Error(`Merged pull request #${pullRequest.number} has no merge commit`)
      }
      await operations.verifyMergedCommit(pullRequest.merge_commit_sha)
      return pullRequest.merge_commit_sha
    }
    if (pullRequest.state === 'closed') {
      throw new Error(
        `Release pull request #${pullRequest.number} closed without merging`
      )
    }
    await operations.sleep(120_000)
  }

  throw new Error(`Timed out waiting for release pull request #${pullRequest.number}`)
}

export type CommandRunner = (command: string, args: string[]) => Promise<string>

async function run(command: string, args: string[]) {
  const { stdout } = await execFileAsync(command, args, {
    maxBuffer: 10 * 1024 * 1024,
  })
  return stdout.trim()
}

function parseJSON<T>(value: string): T {
  return JSON.parse(value) as T
}

export function createStableReleaseOperations(
  repository: string,
  execute: CommandRunner = run
): StableReleaseOperations {
  const [owner] = repository.split('/')
  if (!owner || !repository.includes('/')) {
    throw new Error(`Invalid GitHub repository ${repository}`)
  }

  const getPullRequest = async (number: number) =>
    parseJSON<ReleasePullRequest>(
      await execute('gh', ['api', `repos/${repository}/pulls/${number}`])
    )

  return {
    async verifyPreparedCommit(version, targetSha) {
      const subject = await execute('git', ['show', '-s', '--format=%s', 'HEAD'])
      if (subject !== `v${version}`) {
        throw new Error(`Prepared commit subject is ${subject}, expected v${version}`)
      }
      const parent = await execute('git', ['rev-parse', 'HEAD^'])
      if (parent !== targetSha) {
        throw new Error(`Prepared commit parent is ${parent}, expected ${targetSha}`)
      }
    },

    async findPullRequests(branch) {
      return parseJSON<ReleasePullRequest[]>(
        await execute('gh', [
          'api',
          '--method',
          'GET',
          `repos/${repository}/pulls`,
          '-f',
          'state=all',
          '-f',
          `head=${owner}:${branch}`,
          '-f',
          'base=main',
          '-f',
          'per_page=100',
        ])
      )
    },

    async getCurrentMainSha() {
      await execute('git', ['fetch', '--no-tags', 'origin', 'main'])
      return execute('git', ['rev-parse', 'FETCH_HEAD'])
    },

    async ensureReleaseBranch(branch) {
      const remote = await execute('git', [
        'ls-remote',
        '--heads',
        'origin',
        `refs/heads/${branch}`,
      ])
      if (!remote) {
        await execute('git', ['push', 'origin', `HEAD:refs/heads/${branch}`])
        return
      }

      await execute('git', ['fetch', '--no-tags', 'origin', `refs/heads/${branch}`])
      const [localTree, remoteTree] = await Promise.all([
        execute('git', ['rev-parse', 'HEAD^{tree}']),
        execute('git', ['rev-parse', 'FETCH_HEAD^{tree}']),
      ])
      if (localTree !== remoteTree) {
        throw new Error(`Existing ${branch} has different release content`)
      }
    },

    async createPullRequest(branch, version) {
      return parseJSON<ReleasePullRequest>(
        await execute('gh', [
          'api',
          '--method',
          'POST',
          `repos/${repository}/pulls`,
          '-f',
          `title=v${version}`,
          '-f',
          `head=${branch}`,
          '-f',
          'base=main',
          '-f',
          'body=Generated by the stable release workflow. Full CI must pass before this is squash-merged into protected main.',
        ])
      )
    },

    async listChecksRuns(headSha) {
      const response = parseJSON<{ workflow_runs: WorkflowRun[] }>(
        await execute('gh', [
          'api',
          '--method',
          'GET',
          `repos/${repository}/actions/workflows/checks.yaml/runs`,
          '-f',
          `head_sha=${headSha}`,
          '-f',
          'per_page=20',
        ])
      )
      return response.workflow_runs
    },

    async dispatchChecks(branch) {
      await execute('gh', [
        'api',
        '--method',
        'POST',
        `repos/${repository}/actions/workflows/checks.yaml/dispatches`,
        '-f',
        `ref=${branch}`,
      ])
    },

    async getWorkflowRun(runId) {
      return parseJSON<WorkflowRun>(
        await execute('gh', ['api', `repos/${repository}/actions/runs/${runId}`])
      )
    },

    async squashPullRequest(pullRequest) {
      await execute('gh', [
        'pr',
        'merge',
        String(pullRequest.number),
        '--repo',
        repository,
        '--squash',
        '--match-head-commit',
        pullRequest.head.sha,
      ])
    },

    getPullRequest,

    async verifyMergedCommit(sha) {
      await execute('git', ['fetch', '--no-tags', 'origin', 'main'])
      await execute('git', ['merge-base', '--is-ancestor', sha, 'FETCH_HEAD'])
    },

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    },
  }
}

if (import.meta.main) {
  const version = process.env.RELEASE_VERSION
  const targetSha = process.env.TARGET_SHA
  const repository = process.env.GITHUB_REPOSITORY
  const outputPath = process.env.GITHUB_OUTPUT

  if (!version || !targetSha || !repository || !outputPath) {
    throw new Error(
      'RELEASE_VERSION, TARGET_SHA, GITHUB_REPOSITORY, and GITHUB_OUTPUT are required'
    )
  }

  const mergedSha = await mergeStableRelease(
    version,
    targetSha,
    createStableReleaseOperations(repository)
  )
  await appendFile(outputPath, `merged-sha=${mergedSha}\n`)
  console.info(`Release v${version} merged at ${mergedSha}`)
}

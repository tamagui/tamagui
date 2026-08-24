import { describe, expect, test } from 'bun:test'

import {
  createStableReleaseOperations,
  mergeStableRelease,
  type StableReleaseOperations,
} from './release-github'

const targetSha = '1'.repeat(40)
const releaseSha = '2'.repeat(40)
const mergedSha = '3'.repeat(40)

function makePullRequest(overrides: Record<string, unknown> = {}) {
  return {
    number: 42,
    state: 'open' as const,
    merged_at: null,
    merge_commit_sha: null,
    head: {
      ref: `release-v2.7.8-${targetSha}`,
      sha: releaseSha,
    },
    ...overrides,
  }
}

function makeOperations(
  overrides: Partial<StableReleaseOperations> = {}
): StableReleaseOperations {
  return {
    verifyPreparedCommit: async () => {},
    findPullRequests: async () => [],
    getCurrentMainSha: async () => targetSha,
    ensureReleaseBranch: async () => {},
    createPullRequest: async () => makePullRequest(),
    listChecksRuns: async () => [],
    dispatchChecks: async () => {},
    getWorkflowRun: async () => {
      throw new Error('unexpected workflow run read')
    },
    squashPullRequest: async () => {},
    getPullRequest: async () => makePullRequest(),
    verifyMergedCommit: async () => {},
    sleep: async () => {},
    ...overrides,
  }
}

describe('stable release pull request coordinator', () => {
  test('runs full CI, squash-merges the protected pull request, and returns the merged commit', async () => {
    const events: string[] = []
    let checksDispatched = false
    let pullReads = 0

    const operations = makeOperations({
      verifyPreparedCommit: async () => {
        events.push('verified release commit')
      },
      ensureReleaseBranch: async (branch) => {
        events.push(`pushed ${branch}`)
      },
      createPullRequest: async () => {
        events.push('opened pull request')
        return makePullRequest()
      },
      listChecksRuns: async () => {
        if (!checksDispatched) return []
        return [
          {
            id: 7,
            event: 'workflow_dispatch',
            head_sha: releaseSha,
            status: 'completed',
            conclusion: 'success',
            created_at: '2026-08-24T00:00:00Z',
          },
        ]
      },
      dispatchChecks: async () => {
        checksDispatched = true
        events.push('dispatched checks')
      },
      squashPullRequest: async () => {
        events.push('squashed pull request')
      },
      getPullRequest: async () => {
        pullReads++
        if (pullReads === 1) return makePullRequest()
        return makePullRequest({
          state: 'closed',
          merged_at: '2026-08-24T00:30:00Z',
          merge_commit_sha: mergedSha,
        })
      },
      verifyMergedCommit: async (sha) => {
        events.push(`verified ${sha}`)
      },
    })

    await expect(mergeStableRelease('2.7.8', targetSha, operations)).resolves.toBe(
      mergedSha
    )
    expect(events).toEqual([
      'verified release commit',
      `pushed release-v2.7.8-${targetSha}`,
      'opened pull request',
      'dispatched checks',
      'squashed pull request',
      `verified ${mergedSha}`,
    ])
  })

  test('resumes from an already merged release without opening another pull request', async () => {
    const events: string[] = []
    const mergedPullRequest = makePullRequest({
      state: 'closed',
      merged_at: '2026-08-24T00:30:00Z',
      merge_commit_sha: mergedSha,
    })
    const operations = makeOperations({
      findPullRequests: async () => [mergedPullRequest],
      ensureReleaseBranch: async () => {
        events.push('pushed')
      },
      dispatchChecks: async () => {
        events.push('dispatched')
      },
      squashPullRequest: async () => {
        events.push('squashed')
      },
      verifyMergedCommit: async () => {
        events.push('verified merged commit')
      },
    })

    await expect(mergeStableRelease('2.7.8', targetSha, operations)).resolves.toBe(
      mergedSha
    )
    expect(events).toEqual(['verified merged commit'])
  })

  test('does not create a release branch after main advances', async () => {
    let releaseBranchCreated = false
    const operations = makeOperations({
      getCurrentMainSha: async () => '4'.repeat(40),
      ensureReleaseBranch: async () => {
        releaseBranchCreated = true
      },
    })

    await expect(mergeStableRelease('2.7.8', targetSha, operations)).rejects.toThrow(
      'main advanced'
    )
    expect(releaseBranchCreated).toBe(false)
  })

  test('does not squash-merge a release whose full CI failed', async () => {
    let squashMerged = false
    const operations = makeOperations({
      findPullRequests: async () => [makePullRequest()],
      listChecksRuns: async () => [
        {
          id: 8,
          event: 'workflow_dispatch',
          head_sha: releaseSha,
          status: 'completed',
          conclusion: 'failure',
          created_at: '2026-08-24T00:00:00Z',
        },
      ],
      squashPullRequest: async () => {
        squashMerged = true
      },
    })

    await expect(mergeStableRelease('2.7.8', targetSha, operations)).rejects.toThrow(
      'Checks run 8 concluded failure'
    )
    expect(squashMerged).toBe(false)
  })

  test('rechecks main after full CI and leaves the attempt branch intact if it advanced', async () => {
    let mainReads = 0
    let squashMerged = false
    const operations = makeOperations({
      getCurrentMainSha: async () => {
        mainReads++
        return mainReads === 1 ? targetSha : '4'.repeat(40)
      },
      listChecksRuns: async () => [
        {
          id: 9,
          event: 'workflow_dispatch',
          head_sha: releaseSha,
          status: 'completed',
          conclusion: 'success',
          created_at: '2026-08-24T00:00:00Z',
        },
      ],
      squashPullRequest: async () => {
        squashMerged = true
      },
    })

    await expect(mergeStableRelease('2.7.8', targetSha, operations)).rejects.toThrow(
      'main advanced'
    )
    expect(mainReads).toBe(2)
    expect(squashMerged).toBe(false)
  })

  test('invokes the protected-branch merge with an exact head and explicit squash', async () => {
    const commands: { command: string; args: string[] }[] = []
    const operations = createStableReleaseOperations(
      'tamagui/tamagui',
      async (command, args) => {
        commands.push({ command, args })
        return ''
      }
    )

    await operations.squashPullRequest(makePullRequest())

    expect(commands).toEqual([
      {
        command: 'gh',
        args: [
          'pr',
          'merge',
          '42',
          '--repo',
          'tamagui/tamagui',
          '--squash',
          '--match-head-commit',
          releaseSha,
        ],
      },
    ])
  })
})

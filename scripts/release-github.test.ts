import { describe, expect, test } from 'bun:test'

import { mergeStableRelease, type StableReleaseOperations } from './release-github'

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
      ref: 'release-v2.7.8',
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
    enqueuePullRequest: async () => {},
    getPullRequest: async () => makePullRequest(),
    verifyMergedCommit: async () => {},
    sleep: async () => {},
    ...overrides,
  }
}

describe('stable release pull request coordinator', () => {
  test('runs full CI, enters the merge queue, and returns the merged commit', async () => {
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
      enqueuePullRequest: async () => {
        events.push('entered merge queue')
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
      'pushed release-v2.7.8',
      'opened pull request',
      'dispatched checks',
      'entered merge queue',
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
      enqueuePullRequest: async () => {
        events.push('queued')
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

  test('does not enqueue a release whose full CI failed', async () => {
    let enqueued = false
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
      enqueuePullRequest: async () => {
        enqueued = true
      },
    })

    await expect(mergeStableRelease('2.7.8', targetSha, operations)).rejects.toThrow(
      'Checks run 8 concluded failure'
    )
    expect(enqueued).toBe(false)
  })
})

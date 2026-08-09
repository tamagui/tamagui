import { describe, expect, test } from 'bun:test'

const { publishInBatches } = require('./release-publish-batches.cjs') as {
  publishInBatches(options: {
    workspaces: string[]
    publish: (workspace: string) => Promise<void>
    onAuthFailure: () => void
    batchSize?: number
    maxAttempts?: number
  }): Promise<string[]>
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('npm workspace publish batches', () => {
  test('publishes one leader before each concurrent group', async () => {
    const events: string[] = []
    let active = 0
    let maxActive = 0

    const failures = await publishInBatches({
      workspaces: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
      publish: async (workspace) => {
        events.push(`start:${workspace}`)
        active++
        maxActive = Math.max(maxActive, active)
        await wait(workspace === 'a' || workspace === 'g' ? 1 : 10)
        active--
        events.push(`end:${workspace}`)
      },
      onAuthFailure: () => {},
    })

    expect(failures).toEqual([])
    expect(events.indexOf('end:a')).toBeLessThan(events.indexOf('start:b'))
    expect(events.indexOf('end:g')).toBeLessThan(events.indexOf('start:h'))
    expect(maxActive).toBe(5)
  })

  test('renews authentication on a leader before starting its followers', async () => {
    const calls = new Map<string, number>()
    const events: string[] = []
    let authFailures = 0

    const failures = await publishInBatches({
      workspaces: ['a', 'b', 'c'],
      publish: async (workspace) => {
        const call = (calls.get(workspace) || 0) + 1
        calls.set(workspace, call)
        events.push(`${workspace}:${call}`)
        if (workspace === 'a' && call === 1) {
          throw Object.assign(new Error('passkey required'), { code: 'EOTP' })
        }
      },
      onAuthFailure: () => {
        authFailures++
      },
    })

    expect(failures).toEqual([])
    expect(events).toEqual(['a:1', 'a:2', 'b:1', 'c:1'])
    expect(authFailures).toBe(1)
  })

  test('retries failed followers behind a new serial leader', async () => {
    const calls = new Map<string, number>()
    const events: string[] = []
    let authFailures = 0

    const failures = await publishInBatches({
      workspaces: ['a', 'b', 'c', 'd'],
      publish: async (workspace) => {
        const call = (calls.get(workspace) || 0) + 1
        calls.set(workspace, call)
        events.push(`${workspace}:${call}`)
        if ((workspace === 'b' || workspace === 'c') && call === 1) {
          throw Object.assign(new Error('one-time password required'), {
            code: 'E401',
            body: 'one-time password required',
          })
        }
      },
      onAuthFailure: () => {
        authFailures++
      },
    })

    expect(failures).toEqual([])
    expect(events.slice(-2)).toEqual(['b:2', 'c:2'])
    expect(authFailures).toBe(1)
  })
})

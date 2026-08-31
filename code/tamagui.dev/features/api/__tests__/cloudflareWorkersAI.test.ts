import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CLOUDFLARE_WORKERS_AI_MODEL,
  generateWithCloudflareWorkersAI,
} from '../cloudflareWorkersAI'

const originalAccountId = process.env.CLOUDFLARE_ACCOUNT_ID
const originalApiKey = process.env.CLOUDFLARE_AI_API_KEY

afterEach(() => {
  if (originalAccountId === undefined) {
    delete process.env.CLOUDFLARE_ACCOUNT_ID
  } else {
    process.env.CLOUDFLARE_ACCOUNT_ID = originalAccountId
  }

  if (originalApiKey === undefined) {
    delete process.env.CLOUDFLARE_AI_API_KEY
  } else {
    process.env.CLOUDFLARE_AI_API_KEY = originalApiKey
  }

  vi.restoreAllMocks()
})

describe('generateWithCloudflareWorkersAI', () => {
  it('uses the Workers AI DeepSeek model with reasoning disabled', async () => {
    process.env.CLOUDFLARE_ACCOUNT_ID = 'account-id'
    process.env.CLOUDFLARE_AI_API_KEY = 'test-key'

    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: 'generated theme' } }],
        }),
        { status: 200 }
      )
    )

    await expect(generateWithCloudflareWorkersAI('make it blue', fetcher)).resolves.toBe(
      'generated theme'
    )

    const [url, options] = fetcher.mock.calls[0]
    expect(url).toBe(
      'https://api.cloudflare.com/client/v4/accounts/account-id/ai/v1/chat/completions'
    )
    expect(JSON.parse(options.body as string)).toMatchObject({
      model: CLOUDFLARE_WORKERS_AI_MODEL,
      chat_template_kwargs: { enable_thinking: false },
    })
    expect(options.headers).toMatchObject({ Authorization: 'Bearer test-key' })
  })

  it('surfaces provider failures without exposing credentials', async () => {
    process.env.CLOUDFLARE_ACCOUNT_ID = 'account-id'
    process.env.CLOUDFLARE_AI_API_KEY = 'test-key'

    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: { message: 'credits exhausted' } }), {
        status: 402,
      })
    )

    await expect(
      generateWithCloudflareWorkersAI('make it blue', fetcher)
    ).rejects.toThrow('Cloudflare Workers AI request failed (402): credits exhausted')
  })
})

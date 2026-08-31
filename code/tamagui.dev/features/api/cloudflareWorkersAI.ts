import { serverEnv } from './serverEnv'

export const CLOUDFLARE_WORKERS_AI_MODEL = '@cf/deepseek-ai/deepseek-v4-flash-0731'

const CLOUDFLARE_WORKERS_AI_TIMEOUT_MS = 60_000

type CloudflareChatResponse = {
  choices?: Array<{
    message?: {
      content?: unknown
    }
  }>
  error?: unknown
  errors?: unknown
}

function getResponseError(body: CloudflareChatResponse) {
  if (typeof body.error === 'string') {
    return body.error
  }

  if (body.error && typeof body.error === 'object' && 'message' in body.error) {
    const message = (body.error as { message?: unknown }).message
    if (typeof message === 'string') {
      return message
    }
  }

  if (Array.isArray(body.errors)) {
    const message = body.errors
      .map((error) => {
        if (typeof error === 'string') return error
        if (error && typeof error === 'object' && 'message' in error) {
          const value = (error as { message?: unknown }).message
          return typeof value === 'string' ? value : ''
        }
        return ''
      })
      .filter(Boolean)
      .join('; ')

    if (message) return message
  }

  return ''
}

function getMessageText(content: unknown) {
  if (typeof content === 'string') {
    return content
  }

  if (!Array.isArray(content)) {
    return ''
  }

  return content
    .map((part) => {
      if (typeof part === 'string') return part
      if (part && typeof part === 'object' && 'text' in part) {
        const text = (part as { text?: unknown }).text
        return typeof text === 'string' ? text : ''
      }
      return ''
    })
    .join('')
}

export async function generateWithCloudflareWorkersAI(
  prompt: string,
  fetcher: typeof fetch = fetch
) {
  const accountId = serverEnv('CLOUDFLARE_ACCOUNT_ID')
  const apiKey = serverEnv('CLOUDFLARE_AI_API_KEY')

  if (!accountId || !apiKey) {
    throw new Error('Cloudflare Workers AI is not configured')
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), CLOUDFLARE_WORKERS_AI_TIMEOUT_MS)

  try {
    const response = await fetcher(
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(accountId)}/ai/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: CLOUDFLARE_WORKERS_AI_MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4_000,
          chat_template_kwargs: { enable_thinking: false },
        }),
        signal: controller.signal,
      }
    )

    const body = (await response.json()) as CloudflareChatResponse

    if (!response.ok) {
      const providerError = getResponseError(body)
      throw new Error(
        `Cloudflare Workers AI request failed (${response.status})${providerError ? `: ${providerError}` : ''}`
      )
    }

    const text = getMessageText(body.choices?.[0]?.message?.content)
    if (!text.trim()) {
      throw new Error('Cloudflare Workers AI returned an empty response')
    }

    return text
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Cloudflare Workers AI request timed out')
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

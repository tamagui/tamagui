import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const { sendEmail } = vi.hoisted(() => ({
  sendEmail: vi.fn().mockResolvedValue({ MessageID: 'message-id' }),
}))

vi.mock('postmark', () => ({
  ServerClient: class {
    sendEmail = sendEmail
  },
}))

vi.mock('../../api/serverEnv', () => ({
  serverEnv: () => 'test-postmark-token',
}))

let emailHelpers: typeof import('../helpers')

beforeAll(async () => {
  vi.stubEnv('NODE_ENV', 'production')
  emailHelpers = await import('../helpers')
})

beforeEach(() => {
  sendEmail.mockClear()
})

afterAll(() => {
  vi.unstubAllEnvs()
})

describe('Postmark delivery configuration', () => {
  it('tracks transactional purchase email opens and links', async () => {
    await emailHelpers.sendProductPurchaseEmail('buyer@example.com', {
      name: 'Buyer',
      product_name: 'Tamagui Pro',
    })

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        MessageStream: 'outbound',
        TrackOpens: true,
        TrackLinks: 'HtmlAndText',
      })
    )
  })

  it('sends promotional reminders through the tracked broadcast stream', async () => {
    await emailHelpers.sendPaymentMethodReminderEmail('customer@example.com', {
      name: 'Customer',
      daysUntilExpiry: 3,
    })

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        MessageStream: 'broadcast',
        TrackOpens: true,
        TrackLinks: 'HtmlAndText',
      })
    )
  })
})

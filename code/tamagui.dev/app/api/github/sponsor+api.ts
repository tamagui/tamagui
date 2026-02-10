import crypto from 'crypto'
import { apiRoute } from '~/features/api/apiRoute'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

export default apiRoute(async (req) => {
  if (!process.env.GITHUB_SPONSOR_WEBHOOK_SECRET) {
    throw new Error('GITHUB_SPONSOR_WEBHOOK_SECRET env var is not set')
  }

  const signature = req.headers.get('x-hub-signature-256')
  if (!signature) {
    return Response.json({ error: 'Missing signature' }, { status: 401 })
  }

  const body = await req.text()
  const hmac = crypto.createHmac('sha256', process.env.GITHUB_SPONSOR_WEBHOOK_SECRET!)
  hmac.update(body)
  const expectedSignature = `sha256=${hmac.digest('hex')}`

  const sigBuf = Buffer.from(signature)
  const expectedBuf = Buffer.from(expectedSignature)
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
    return Response.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const parsedBody = JSON.parse(body)

  switch (parsedBody.action) {
    case 'cancelled':
      console.info(
        `Received cancelled webhook event to cancel the sponsorship for ${parsedBody.sponsorship.node_id}`
      )
      await supabaseAdmin
        .from('teams')
        .update({
          is_active: false,
        })
        .eq('github_id', parsedBody.sponsorship.node_id)
      break
    case 'tier_changed':
      console.info(
        `Received cancelled webhook event to change the sponsorship tier for ${parsedBody.sponsorship.node_id}. new tier: ${parsedBody.sponsorship.tier.node_id}`
      )
      await supabaseAdmin
        .from('teams')
        .update({
          tier: parsedBody.sponsorship.tier.node_id,
        })
        .eq('github_id', parsedBody.sponsorship.node_id)
      break
  }

  return Response.json({
    success: true,
  })
})

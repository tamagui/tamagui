import { apiRoute } from '~/features/api/apiRoute'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

console.info(`debug?`, `${process.env.GITHUB_SPONSOR_WEBHOOK_SECRET}`.slice(0, 4))

export default apiRoute(async (req) => {
  if (!process.env.GITHUB_SPONSOR_WEBHOOK_SECRET) {
    throw new Error('GITHUB_SPONSOR_WEBHOOK_SECRET env var is not set')
  }

  if (req.headers.get('x-hub-signature') !== process.env.GITHUB_SPONSOR_WEBHOOK_SECRET) {
    return Response.json(
      {
        error: 'Invalid token.',
      },
      {
        status: 401,
      }
    )
  }

  const body = await readBodyJSON(req)

  switch (body.action) {
    case 'cancelled':
      console.info(
        `Received cancelled webhook event to cancel the sponsorship for ${body.sponsorship.node_id}`
      )
      await supabaseAdmin
        .from('teams')
        .update({
          is_active: false,
        })
        .eq('github_id', body.sponsorship.node_id)
      break
    case 'tier_changed':
      console.info(
        `Received cancelled webhook event to change the sponsorship tier for ${body.sponsorship.node_id}. new tier: ${body.sponsorship.tier.node_id}`
      )
      await supabaseAdmin
        .from('teams')
        .update({
          tier: body.sponsorship.tier.node_id,
        })
        .eq('github_id', body.sponsorship.node_id)
      break
  }

  return Response.json({
    success: true,
  })
})

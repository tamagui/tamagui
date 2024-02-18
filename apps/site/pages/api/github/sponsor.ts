import { apiRoute } from '@lib/apiRoute'
import { supabaseAdmin } from '@lib/supabaseAdmin'

const handler = apiRoute(async (req, res) => {
  if (!process.env.GITHUB_SPONSOR_WEBHOOK_SECRET) {
    throw new Error('GITHUB_SPONSOR_WEBHOOK_SECRET env var is not set')
  }

  if (req.headers['x-hub-signature'] !== process.env.GITHUB_SPONSOR_WEBHOOK_SECRET) {
    res.status(401).json({
      error: 'Invalid token.',
    })
  }

  switch (req.body.action) {
    case 'cancelled':
      console.info(
        `Received cancelled webhook event to cancel the sponsorship for ${req.body.sponsorship.node_id}`
      )
      await supabaseAdmin
        .from('teams')
        .update({
          is_active: false,
        })
        .eq('github_id', req.body.sponsorship.node_id)
      break
    case 'tier_changed':
      console.info(
        `Received cancelled webhook event to change the sponsorship tier for ${req.body.sponsorship.node_id}. new tier: ${req.body.sponsorship.tier.node_id}`
      )
      await supabaseAdmin
        .from('teams')
        .update({
          tier: req.body.sponsorship.tier.node_id,
        })
        .eq('github_id', req.body.sponsorship.node_id)
      break
  }
  res.json({
    success: true,
  })
})

export default handler

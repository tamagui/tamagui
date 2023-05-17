import { supabaseAdmin } from '@lib/supabaseAdmin'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
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
      console.log(
        `Received cancelled webhook event to cancel the sponsorship for ${req.body.sponsorship.node_id}`
      )
      await supabaseAdmin
        .from('teams')
        .update({
          is_active: false,
        })
        .eq('github_id', req.body.sponsorship.node_id)
    case 'tier_changed':
      console.log(
        `Received cancelled webhook event to change the sponsorship tier for ${req.body.sponsorship.node_id}. new tier: ${req.body.sponsorship.tier.node_id}`
      )
      await supabaseAdmin
        .from('teams')
        .update({
          tier: req.body.sponsorship.tier.node_id,
        })
        .eq('github_id', req.body.sponsorship.node_id)
  }
  res.json({
    success: true,
  })
}

export default handler

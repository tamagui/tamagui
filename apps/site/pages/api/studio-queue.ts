import { Database } from '@lib/supabase-types'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'
import { sponsorshipDateMap } from 'protected/constants'

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient<Database>({ req, res })

  const teamId = req.query.team_id

  if (typeof teamId !== 'string') {
    res.status(400).json({ error: 'Bad data' })
  }

  const teamResult = await supabase.from('teams').select('*').eq('id', teamId).single()
  if (teamResult.error) {
    throw new Error(teamResult.error.message)
  }
  const team = teamResult.data

  const priorTeamsResult = team.is_active
    ? await supabaseAdmin
        .from('teams')
        .select('id')
        .eq('tier', team.tier)
        .lte('studio_queued_at', team.studio_queued_at)
    : await supabaseAdmin
        .from('teams')
        .select('id')
        .is('tier', null)
        .lte('studio_queued_at', team.studio_queued_at)

  const place = priorTeamsResult.data?.length

  const info =
    team.is_active && team.tier
      ? sponsorshipDateMap[team.tier as keyof typeof sponsorshipDateMap]
      : sponsorshipDateMap.NOT_SPONSOR

  res.json({
    place,
    date: info.date,
    estimatedDate: info.dateStr,
    tierName: info.tierName,
    tierId: team.id,
    name: team.name,
  })
}

export default handler

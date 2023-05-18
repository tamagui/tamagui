import { Database } from '@lib/supabase-types'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'

const sponsorshipDateMap = {
  NOT_SPONSOR: {
    tierName: null,
    dateStr: 'late July 2023',
    date: new Date(2023, 6, 30),
  },

  ST_kwDNL0TOAAMT2w: {
    tierName: '$10 a month',
    dateStr: 'late June 2023',
    date: new Date(2023, 5, 30),
  },

  ST_kwDNL0TOAANQFA: {
    tierName: '$100 a month',
    dateStr: 'late May 2023',
    date: new Date(2023, 4, 30),
  },

  ST_kwDNL0TOAAPNDw: {
    tierName: '$200 a month',
    dateStr: 'May 2023',
    date: new Date(2023, 4, 1),
  },

  ST_kwDNL0TOAAPNEQ: {
    tierName: '$500 a month',
    dateStr: 'April 2023',
    date: new Date(2023, 3, 1),
  },

  ST_kwDNL0TOAAPNEg: {
    tierName: '$1,000 a month',
    dateStr: 'April 2023',
    date: new Date(2023, 3, 1),
  },
  /*
  N/A:
  $50 one time "ST_kwDNL0TOAAMTSA"
  $100 one time "ST_kwDNL0TOAAMT2g"
  $400 one time "ST_kwDNL0TOAAMTSg"
  */
}

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
    estimatedDate: info.date,
    dateStr: info.dateStr,
    tierName: info.tierName,
    tierId: team.id,
    name: team.name,
  })
}

export default handler

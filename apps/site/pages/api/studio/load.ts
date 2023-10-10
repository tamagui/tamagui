import { checkSponsorAccess } from '@lib/getSponsorData'
import { protectApiRoute } from '@lib/protectApiRoute'
import { NextApiHandler } from 'next'

import { setupCors } from '../../../lib/cors'
import { StoreData } from './save'

const handler: NextApiHandler = async (req, res) => {
  setupCors(req, res)
  const { supabase, user } = await protectApiRoute({ req, res })
  const { teamId } = await checkSponsorAccess({
    req,
    res,
    supabase,
    throwIfNoAccess: true,
  })

  const results = await supabase
    .from('studio_themes')
    .select('*')
    .eq('team_id', teamId)
    .eq('user_id', user.id)

  if (results.error) {
    res.status(400).json({
      message: 'an error occurred.',
    })
    return
  }
  console.log(results.data)
  res.json([
    {
      themes: Object.fromEntries(
        results.data.map((theme) => [theme.id.toString(), theme.data as any])
      ),
    },
  ] satisfies StoreData)
}

export default handler

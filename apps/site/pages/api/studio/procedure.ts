import { setupCors } from '@lib/cors'
import { protectApiRoute } from '@lib/protectApiRoute'
import * as apis from '@tamagui/studio/api'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  setupCors(req, res)
  await protectApiRoute(req, res)
  // uncomment to block out non-sponsors:
  // const teamsResult = await supabase.from('teams').select('id, name, is_active')
  // if (teamsResult.error) {
  //   throw teamsResult.error
  // }
  // const teams = getArray(teamsResult.data)
  // const hasAccess = teams.some((team) => team.is_active)

  const hasAccess = true

  if (!hasAccess) {
    res.status(403).json({
      error: "You don't have access to this part of studio.",
    })
    return
  }

  const procedureName = req.query.procedure

  if (req.method === 'POST') {
    if (typeof procedureName !== 'string') {
      res
        .status(400)
        .json({ error: '`procedure` query param is not provided / incorrect.' })
      return
    }

    try {
      res.json(await apis[procedureName](JSON.parse(req.body)))
      return
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: 'an unknown error occurred' })
      return
    }
  }

  res.status(405).json({})
}

export default handler

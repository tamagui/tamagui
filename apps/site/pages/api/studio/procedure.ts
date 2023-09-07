import { setupCors } from '@lib/cors'
import { checkSponsorAccess } from '@lib/getSponsorData'
import { protectApiRoute } from '@lib/protectApiRoute'
import * as apis from '@tamagui/studio/api'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  setupCors(req, res)
  const { supabase } = await protectApiRoute({ req, res })
  await checkSponsorAccess({
    req,
    res,
    supabase,
    throwIfNoAccess: true,
  })

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

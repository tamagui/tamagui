import { setupCors } from '@lib/cors'
import { protectApiRoute } from '@lib/protectApiRoute'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  setupCors(req, res)
  const { supabase } = await protectApiRoute({ req, res })
  // TODO: return from db
  res.json({})
}

export default handler

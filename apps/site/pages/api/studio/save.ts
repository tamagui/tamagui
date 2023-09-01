import { setupCors } from '@lib/cors'
import { protectApiRoute } from '@lib/protectApiRoute'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  setupCors(req, res)
  const { supabase } = await protectApiRoute({ req, res })

  let body = {}
  try {
    body = JSON.parse(req.body)
  } catch (error) {
    res.status(400)
    return
  }
  console.log('store state: ', JSON.stringify(body, null, 2))

  // TODO: persist
  res.status(500)
}

export default handler

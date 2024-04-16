import { apiOssBentoRoute } from '@lib/apiOssBentoRoute'
import { HandledResponseTermination, apiRoute } from '@lib/apiRoute'
import { authorizeUserAccess } from '@lib/authorizeUserAccess'
import { protectApiRoute } from '@lib/protectApiRoute'
import { supabaseAdmin } from '@lib/supabaseAdmin'

const handler = apiOssBentoRoute(async (req, res) => {
  try {
      throw new HandledResponseTermination(`testing throwing error on [...slug]`)
  } catch (err) {
    console.error(err)
    res.status(401).json({ error: err.message })
  }
})

export default handler

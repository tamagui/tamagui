import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

import { getURL } from '../../lib/helpers'
import { stripe } from '../../lib/stripe'
import { createOrRetrieveCustomer } from '../../lib/supabaseAdmin'

const createPortalLink = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const supabase = createServerSupabaseClient({ req, res })
    const {
      data: { session: authSession },
    } = await supabase.auth.getSession()

    if (!authSession)
      return res.status(401).json({
        error: 'not_authenticated',
        description: 'The user does not have an active session or is not authenticated',
      })

    try {
      const customer = await createOrRetrieveCustomer({
        uuid: authSession.user.id || '',
        email: authSession.user.email || '',
      })

      if (!customer) throw Error('Could not get customer')
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/account`,
      })

      return res.status(200).json({ url })
    } catch (err: any) {
      console.log(err)
      res.status(500).json({ error: { statusCode: 500, message: err.message } })
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}

export default createPortalLink

import {
  getUser,
  withAuthRequired,
} from '@supabase/supabase-auth-helpers/nextjs'
import { NextApiRequest, NextApiResponse } from 'next'

import { getURL } from '../../lib/helpers'
import { stripe } from '../../lib/stripe'
import { createOrRetrieveCustomer } from '../../lib/supabaseAdmin'

const createPortalLink = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { user } = await getUser({ req, res })
      if (!user) throw Error('Could not get user')
      const customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || '',
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

export default withAuthRequired(createPortalLink)

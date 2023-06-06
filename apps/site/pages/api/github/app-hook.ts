import { supabaseAdmin } from '@lib/supabaseAdmin'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  console.log(req.query, req.body, req.headers['x-hub-signature'], req.headers)

  switch (req.body.action) {
  }

  res.json({
    success: true,
  })
}

export default handler

import type { Endpoint } from 'one'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'

export const POST: Endpoint = async (req) => {
  const { supabase, user } = await ensureAuth({ req })

  const { hasPro } = await ensureAccess({ req, supabase })
  if (!hasPro) {
    return Response.json({ error: 'Must have Pro account' }, { status: 403 })
  }

  const email = user.email

  if (typeof email !== 'string') {
    return Response.json({ error: 'no username' }, { status: 400 })
  }

  const requestBody = {
    action: 'add',
    email,
    key: process.env.TAMAGUI_PRO_SECRET,
  }

  const response = await fetch('https://start.chat/api/tamagui-pro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  const data = await response.json()

  if (!response.ok) {
    console.error(`Got error response`)
  }

  return Response.json(data)
}

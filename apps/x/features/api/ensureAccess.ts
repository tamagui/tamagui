import type { SupabaseClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { getUserAccessInfo } from '~/features/user/helpers'
import type { Database } from '../supabase/types'
import { getCookie, setCookie } from './cookies'

const JWT_NAME = 'tamagui_authorization'
const JWT_SECRET = process.env.STUDIO_JWT_SECRET!

type PayloadShape = {
  hasStudioAccess: boolean
  hasBentoAccess: boolean
  hasTakeoutAccess: boolean
  teamId: number
}

/**
 * checks is the user has sponsor access and sets a jwt cookie for subsequent requests to be faster
 */
export async function ensureAccess({
  req,
  supabase,
  checkForStudioAccess = false,
  checkForBentoAccess = false,
}: {
  req: Request
  supabase: SupabaseClient<Database>
  checkForStudioAccess?: boolean
  checkForBentoAccess?: boolean
}): Promise<PayloadShape> {
  const oldJwt = getCookie(req.headers, JWT_NAME)
  if (oldJwt) {
    try {
      const payload = jwt.verify(oldJwt, JWT_SECRET) as PayloadShape
      return payload
    } catch (error) {
      // continue to create a new one and set it
    }
  }

  const teamsResult = await supabase.from('teams').select('id, name, is_active')
  if (teamsResult.error) {
    throw teamsResult.error
  }

  const user = (await supabase.auth.getUser()).data.user
  const { hasBentoAccess, hasStudioAccess, hasTakeoutAccess, teamsWithAccess } =
    await getUserAccessInfo(supabase, user)

  const payload: PayloadShape = {
    hasStudioAccess,
    teamId: teamsWithAccess[0]?.id,
    hasBentoAccess,
    hasTakeoutAccess,
  }

  if (checkForStudioAccess && !hasStudioAccess && process.env.NODE_ENV === 'production') {
    throw Response.json(
      {
        message: "You don't have access to this part of the studio.",
      },
      {
        status: 403,
      }
    )
  }

  // check for bento access
  if (checkForBentoAccess && !hasBentoAccess && process.env.NODE_ENV === 'production') {
    throw Response.json(
      {
        message: "You don't have access to Bento.",
      },
      {
        status: 403,
      }
    )
  }

  const newJwt = jwt.sign(payload, JWT_SECRET)
  setCookie(req.headers, {
    value: newJwt,
    key: JWT_NAME,
    expiration: 2,
    httpOnly: true,
    domain: process.env.NODE_ENV === 'production' ? '.tamagui.dev' : 'localhost',
  })

  return payload
}

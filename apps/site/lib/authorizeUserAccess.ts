import type { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { getCookie, setCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import type { NextApiRequest, NextApiResponse } from 'next'

import { HandledResponseTermination } from './apiRoute'
import type { Database } from './supabase-types'
import { getUserAccessInfo } from './user-helpers'

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
export async function authorizeUserAccess(
  {
    req,
    res,
    supabase,
  }: {
    req: NextApiRequest
    res: NextApiResponse
    supabase: SupabaseClient<Database>
  },
  {
    checkForStudioAccess = false,
    checkForBentoAccess = false,
  }: {
    /**
     * throws and returns 403 if no studio access
     */
    checkForStudioAccess?: boolean
    /**
     * throws and returns 403 if no bento access
     */
    checkForBentoAccess?: boolean
  }
): Promise<PayloadShape> {
  const oldJwt = getCookie(JWT_NAME, { req, res })
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
    res.status(403).json({
      message: "You don't have access to this part of the studio.",
    })
  }

  // check for bento access
  if (checkForBentoAccess && !hasBentoAccess && process.env.NODE_ENV === 'production') {
    res.status(403).json({
      message: "You don't have access to Bento.",
    })
  }

  const newJwt = jwt.sign(payload, JWT_SECRET)
  setCookie(JWT_NAME, newJwt, {
    req,
    res,
    maxAge: 60 * 2, // 2 mins
    httpOnly: true,
    domain: process.env.NODE_ENV === 'production' ? '.tamagui.dev' : 'localhost',
  })

  return payload
}

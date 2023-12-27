import { SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { getCookie, setCookie } from 'cookies-next'
import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'

import { whitelistGithubUsernames } from '../protected/_utils/github'
import { HandledResponseTermination } from './apiRoute'
import { Database } from './supabase-types'
import { getArray } from './supabase-utils'
import { userHasTakeout } from './user-helpers'

const STUDIO_COOKIE_NAME = 'studio_jwt'
const JWT_SECRET = process.env.STUDIO_JWT_SECRET!

type PayloadShape = {
  hasStudioAccess: boolean
  teamId: number
}

/**
 * checks is the user has sponsor access and sets a jwt cookie for subsequent requests to be faster
 */
export async function checkSponsorAccess({
  req,
  res,
  supabase,
  throwIfNoAccess = false,
}: {
  req: NextApiRequest
  res: NextApiResponse
  supabase: SupabaseClient<Database>
  throwIfNoAccess?: boolean
}): Promise<PayloadShape> {
  const oldJwt = getCookie(STUDIO_COOKIE_NAME, { req, res })
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
  const teams = getArray(teamsResult.data)
  const teamsWithAccess = teams.filter(
    (team) =>
      team.is_active || whitelistGithubUsernames.some((name) => team.name === name)
  )
  // if the user has purchased takeout, we give studio access
  const hasTakeout = await userHasTakeout(supabase)
  // if the user has at least one team (this could be a personal team too - so basically a personal sponsorship) with active sponsorship, we give studio access
  const hasTeamAccess = teamsWithAccess.length > 0

  const hasStudioAccess = hasTakeout || hasTeamAccess

  const payload: PayloadShape = { hasStudioAccess, teamId: teamsWithAccess[0]?.id }

  if (throwIfNoAccess && !hasStudioAccess && process.env.NODE_ENV === 'production') {
    res.status(403).json({
      message: "You don't have access to this part of the studio.",
    })
    throw new HandledResponseTermination("User doesn't have access to studio.")
  }

  const newJwt = jwt.sign(payload, JWT_SECRET)
  setCookie(STUDIO_COOKIE_NAME, newJwt, {
    req,
    res,
    maxAge: 60 * 2,
    httpOnly: true,
    domain: process.env.NODE_ENV === 'production' ? '.tamagui.dev' : 'localhost',
  })

  return payload
}

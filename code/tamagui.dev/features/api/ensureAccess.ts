import type { SupabaseClient, User } from '@supabase/supabase-js'
import { getUserAccessInfo } from '~/features/user/helpers'
import type { Database } from '../supabase/types'

type AccessInfo = {
  hasPro: boolean
  teamId?: number
}

/**
 * Checks if the user has Pro access
 */
export async function ensureAccess({
  supabase,
  user,
}: {
  supabase: SupabaseClient<Database>
  user: User
}): Promise<AccessInfo> {
  console.info(`[ensureAccess] user=${user?.email} checking access...`)

  const { hasPro, teamsWithAccess } = await getUserAccessInfo(supabase, user)
  console.info(`[ensureAccess] user=${user?.email} hasPro=${hasPro}`)

  return {
    hasPro,
    teamId: teamsWithAccess[0]?.id,
  }
}

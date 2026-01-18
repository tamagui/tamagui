import type { User } from '@supabase/auth-js'
import type { Database } from '../supabase/types'
import type {
  getSubscriptions,
  getUserAccessInfo,
  getUserDetails,
  getUserThemeHistories,
} from '../user/helpers'

export type UserContextType = {
  subscriptions?: Awaited<ReturnType<typeof getSubscriptions>> | null
  user: User
  userDetails?: Awaited<ReturnType<typeof getUserDetails>> | null
  teams: {
    all?: Database['public']['Tables']['teams']['Row'][] | null
    orgs?: Database['public']['Tables']['teams']['Row'][] | null
    personal?: Database['public']['Tables']['teams']['Row'] | null
    main?: Database['public']['Tables']['teams']['Row'] | null
  }
  accessInfo: Awaited<ReturnType<typeof getUserAccessInfo>>
  themeHistories?: Awaited<ReturnType<typeof getUserThemeHistories>>
  githubUsername?: string | null
}

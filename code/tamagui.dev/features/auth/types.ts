import type { User } from '@supabase/supabase-js'
import type { Database } from '../supabase/types'
import type {
  getProductOwnerships,
  getSubscriptions,
  getUserAccessInfo,
  getUserDetails,
} from '../user/helpers'

export type UserContextType = {
  subscriptions?: Awaited<ReturnType<typeof getSubscriptions>> | null
  productOwnerships?: Awaited<ReturnType<typeof getProductOwnerships>> | null
  user: User
  userDetails?: Awaited<ReturnType<typeof getUserDetails>> | null
  teams: {
    all?: Database['public']['Tables']['teams']['Row'][] | null
    orgs?: Database['public']['Tables']['teams']['Row'][] | null
    personal?: Database['public']['Tables']['teams']['Row'] | null
    main?: Database['public']['Tables']['teams']['Row'] | null
  }
  connections: {
    github: boolean
    discord: boolean
  }
  accessInfo: Awaited<ReturnType<typeof getUserAccessInfo>>
}

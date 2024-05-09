import type { Session, User } from '@supabase/supabase-js'
import type {
  getProductOwnerships,
  getSubscriptions,
  getUserAccessInfo,
  getUserDetails,
} from './helpers'
import type { Database } from '../supabase/types'

export type UserContextType = {
  subscriptions?: Awaited<ReturnType<typeof getSubscriptions>> | null
  productOwnerships?: Awaited<ReturnType<typeof getProductOwnerships>> | null
  session: Session
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

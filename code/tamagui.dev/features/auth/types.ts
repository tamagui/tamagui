import type { User } from '@supabase/supabase-js'
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
}

export type Subscription = NonNullable<UserContextType['subscriptions']>[number]

export enum PRODUCT_NAME {
  TAMAGUI_PRO = 'Tamagui Pro',
  TAMAGUI_SUPPORT = 'Tamagui Support',
  TAMAGUI_PRO_TEAM_SEATS = 'Tamagui Pro Team Seats',
}

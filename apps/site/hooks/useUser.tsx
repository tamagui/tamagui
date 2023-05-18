import { Database } from '@lib/supabase-types'
import { getArray, getSingle } from '@lib/supabase-utils'
import { tiersPriority } from '@protected/_utils/sponsorship'
import { siteRootDir } from '@protected/studio/constants'
import { User, useSessionContext, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Spinner, YStack } from 'tamagui'

type UserContextType = {
  accessToken: string | null
  user: User | null
  userDetails?: Database['public']['Tables']['users']['Row'] | null
  teams: {
    all?: Database['public']['Tables']['teams']['Row'][] | null
    orgs?: Database['public']['Tables']['teams']['Row'][] | null
    personal?: Database['public']['Tables']['teams']['Row'] | null
    main?: Database['public']['Tables']['teams']['Row'] | null
  }

  isLoading: boolean
  // subscription: any | null
  signout: () => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props {
  [propName: string]: any
}

export const MyUserContextProvider = (props: Props) => {
  const forceUpdate = useReducer((x) => (x + 1) % Number.MAX_SAFE_INTEGER, 0)[1]
  const { isLoading: isLoadingUser, session } = useSessionContext()
  const supabase = useSupabaseClient<Database>()

  useEffect(() => {
    // need to do this cause session loses provider_token
    const listener = supabase.auth.onAuthStateChange((_, session) => {
      if (
        session?.user.app_metadata.provider === 'github' &&
        session.provider_token &&
        session.user.user_metadata.github_token !== session.provider_token
      ) {
        supabase.auth.updateUser({
          data: {
            github_token: session.provider_token,
            github_refresh_token: session.refresh_token,
          },
        })
      }
    })
    return () => listener.data.subscription.unsubscribe()
  }, [])

  const getUserDetails = async () => {
    const result = await supabase.from('users').select('*').single()
    if (result.error) throw new Error(result.error.message)
    return result.data
  }

  const getUserTeams = async () => {
    const result = await supabase.from('teams').select('*')
    if (result.error) throw new Error(result.error.message)
    return result.data
  }

  const router = useRouter()
  const [isLoadingData, setIsloadingData] = useState(false)
  const [userDetails, setUserDetails] = useState<UserContextType['userDetails']>()
  const [userTeams, setUserTeams] = useState<UserContextType['teams']['all']>()
  // const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (session?.user && !isLoadingData && !userDetails) {
      setIsloadingData(true)
      Promise.allSettled([getUserDetails(), getUserTeams()]).then(
        ([userDetailsPromise, userTeamsPromise]) => {
          // const subscriptionPromise = results[2]

          if (userDetailsPromise.status === 'fulfilled') {
            setUserDetails(userDetailsPromise.value)
          }
          if (userTeamsPromise.status === 'fulfilled') {
            setUserTeams(userTeamsPromise.value)
          }
          setIsloadingData(false)
        }
      )
    } else if (!session?.user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null)
      // setSubscription(null)
    }
  }, [session?.user, isLoadingUser])

  const value: UserContextType = {
    accessToken: session?.access_token ?? null,
    user: session?.user ?? null,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    // subscription,
    teams: {
      all: userTeams,
      personal: getPersonalTeam(userTeams),
      orgs: getOrgTeams(userTeams),
      main: getMainTeam(userTeams),
    },
    signout: useCallback(async () => {
      await supabase.auth.signOut()
      forceUpdate()
    }, []),
  }

  return <UserContext.Provider value={value} {...props} />
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`)
  }
  return context
}

export const UserGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!user && !isLoading && router.isReady) {
      router.push(`${siteRootDir}/login`)
    }
  }, [user, isLoading, router])

  if (!user)
    return (
      <YStack ai="center" flex={1} jc="center">
        <Spinner size="large" />
      </YStack>
    )

  return <>{children}</>
}

function getPersonalTeam(teams: ReturnType<typeof useUser>['teams']['all']) {
  return getSingle(teams?.filter((team) => team.is_personal))
}

function getOrgTeams(teams: ReturnType<typeof useUser>['teams']['all']) {
  return getArray(teams?.filter((team) => !team.is_personal) ?? [])
}

function getMainTeam(teams: ReturnType<typeof useUser>['teams']['all']) {
  const sortedTeams = teams?.sort(
    (a, b) => tiersPriority.indexOf(a.tier as any) - tiersPriority.indexOf(b.tier as any)
  )
  return sortedTeams?.[0]
}

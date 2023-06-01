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

const getUserDetails = async (
  supabase: ReturnType<typeof useSupabaseClient<Database>>
) => {
  const result = await supabase.from('users').select('*').single()
  if (result.error) throw new Error(result.error.message)
  return result.data
}

const getUserTeams = async (supabase: ReturnType<typeof useSupabaseClient<Database>>) => {
  const result = await supabase.from('teams').select('*')
  if (result.error) throw new Error(result.error.message)
  return result.data
}

const getSubscriptions = async (
  supabase: ReturnType<typeof useSupabaseClient<Database>>
) => {
  const result = await supabase.from('subscriptions').select('*, prices(*, products(*))')
  if (result.error) throw new Error(result.error.message)
  return result.data
}

type UserContextType = {
  accessToken: string | null
  subscriptions?: Awaited<ReturnType<typeof getSubscriptions>> | null
  user: User | null
  userDetails?: Awaited<ReturnType<typeof getUserDetails>> | null
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
    const listener = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (event === 'SIGNED_IN') {
        if (session?.user.id === currentSession?.user.id) {
          return
        }
        await fetch('/api/github-sync', { method: 'POST' })
      }
    })
    return () => listener.data.subscription.unsubscribe()
  }, [session])

  const [isLoadingData, setIsloadingData] = useState(false)
  const [userDetails, setUserDetails] = useState<UserContextType['userDetails']>()
  const [userTeams, setUserTeams] = useState<UserContextType['teams']['all']>()
  const [subscriptions, setSubscriptions] = useState<UserContextType['subscriptions']>()

  useEffect(() => {
    if (session?.user && !isLoadingData && !userDetails) {
      setIsloadingData(true)
      Promise.allSettled([
        getSubscriptions(supabase),
        getUserDetails(supabase),
        getUserTeams(supabase),
      ]).then(([subscriptionsPromise, userDetailsPromise, userTeamsPromise]) => {
        if (subscriptionsPromise.status === 'fulfilled') {
          setSubscriptions(subscriptionsPromise.value)
        }

        if (userDetailsPromise.status === 'fulfilled') {
          setUserDetails(userDetailsPromise.value)
        }
        if (userTeamsPromise.status === 'fulfilled') {
          setUserTeams(userTeamsPromise.value)
        }
        setIsloadingData(false)
      })
    } else if (!session?.user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null)
    }
  }, [session?.user, isLoadingUser])

  const value: UserContextType = {
    accessToken: session?.access_token ?? null,
    user: session?.user ?? null,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscriptions,
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

export const useUnsafeUser = () => useContext(UserContext)

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

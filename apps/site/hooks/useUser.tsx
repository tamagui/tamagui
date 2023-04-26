import { Database } from '@lib/supabase-types'
import { supabase } from '@lib/supabaseClient'
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
import { UserAccessStatus } from 'types'

import { useSharedAuth } from './useSharedAuth'

type UserContextType = {
  accessToken: string | null
  user: User | null
  userDetails: any | null
  isLoading: boolean
  // subscription: any | null
  accessStatus: UserAccessStatus | null
  signout: () => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props {
  [propName: string]: any
}

const getAccessDetails = async () => {
  const res = await fetch('/api/access-check')
  const data = await res.json()
  if (res.status !== 200) throw new Error(data.error)
  return data as UserAccessStatus
}

export const MyUserContextProvider = (props: Props) => {
  const forceUpdate = useReducer((x) => (x + 1) % Number.MAX_SAFE_INTEGER, 0)[1]
  const { isLoading: isLoadingUser, session } = useSessionContext()
  const supabase = useSupabaseClient<Database>()

  const [isLoadingData, setIsloadingData] = useState(false)
  const [userDetails, setUserDetails] = useState<any>(null)
  // const [subscription, setSubscription] = useState<any>(null)
  const [accessStatus, setAccessStatus] = useState<UserAccessStatus | null>(null)

  const getUserDetails = () => supabase.from('users').select('*').single()

  // const getSubscription = () =>
  //   supabase
  //     .from('subscriptions')
  //     .select('*, prices(*, products(*))')
  //     .in('status', ['trialing', 'active'])
  //     .single()



  useEffect(() => {
    if (session?.user && !isLoadingData && !userDetails) {
      setIsloadingData(true)
      Promise.allSettled([
        getUserDetails(),
        getAccessDetails(),
        // getSubscription()
      ]).then((results) => {
        const userDetailsPromise = results[0]
        const accessDetailsPromise = results[1]
        // const subscriptionPromise = results[2]

        if (userDetailsPromise.status === 'fulfilled')
          setUserDetails(userDetailsPromise.value.data)

        if (accessDetailsPromise.status === 'fulfilled')
          setAccessStatus(accessDetailsPromise.value)

        // if (subscriptionPromise.status === 'fulfilled')
        // setSubscription(subscriptionPromise.value.data)

        setIsloadingData(false)
      })
    } else if (!session?.user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null)
      // setSubscription(null)
    }
  }, [session?.user, isLoadingUser])

  const value = {
    accessToken: session?.access_token ?? null,
    user: session?.user ?? null,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    accessStatus,
    // subscription,
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

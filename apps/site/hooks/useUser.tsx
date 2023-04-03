import { User, useSession } from '@supabase/auth-helpers-react'
import { SupabaseClient } from '@supabase/supabase-js'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'

type UserContextType = {
  accessToken: string | null
  user: User | null
  userDetails: any | null
  isLoading: boolean
  subscription: any | null
  signout: () => void
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export interface Props {
  supabaseClient: SupabaseClient
  [propName: string]: any
}

export const MyUserContextProvider = (props: Props) => {
  const forceUpdate = useReducer((x) => (x + 1) % Number.MAX_SAFE_INTEGER, 0)[1]
  const { supabaseClient: supabase } = props
  const session = useSession()

  const [isLoadingData, setIsloadingData] = useState(false)
  const [userDetails, setUserDetails] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)

  const getUserDetails = () => supabase.from('users').select('*').single()

  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single()

  const isLoadingUser = !!session?.user

  useEffect(() => {
    if (session?.user && !isLoadingData && !userDetails && !subscription) {
      setIsloadingData(true)
      Promise.allSettled([getUserDetails(), getSubscription()]).then((results) => {
        const userDetailsPromise = results[0]
        const subscriptionPromise = results[1]

        if (userDetailsPromise.status === 'fulfilled')
          setUserDetails(userDetailsPromise.value.data)

        if (subscriptionPromise.status === 'fulfilled')
          setSubscription(subscriptionPromise.value.data)

        setIsloadingData(false)
      })
    } else if (!session?.user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null)
      setSubscription(null)
    }
  }, [session?.user, isLoadingUser])

  const value = {
    accessToken: session?.access_token ?? null,
    user: session?.user ?? null,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription,
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

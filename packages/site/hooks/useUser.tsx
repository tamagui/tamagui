import { SupabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import {
  User,
  useUser as useSupaUser,
} from '@supabase/supabase-auth-helpers/react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { UserDetails } from 'types'
import { Subscription } from 'types'

type UserContextType = {
  accessToken: string | null
  user: User | null
  userDetails: UserDetails | null
  isLoading: boolean
  subscription: Subscription | null
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
  const { user, accessToken, isLoading: isLoadingUser } = useSupaUser()
  const [isLoadingData, setIsloadingData] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  const getUserDetails = () =>
    supabase.from<UserDetails>('users').select('*').single()

  const getSubscription = () =>
    supabase
      .from<Subscription>('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single()

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsloadingData(true)
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          const userDetailsPromise = results[0]
          const subscriptionPromise = results[1]

          if (userDetailsPromise.status === 'fulfilled')
            setUserDetails(userDetailsPromise.value.data)

          if (subscriptionPromise.status === 'fulfilled')
            setSubscription(subscriptionPromise.value.data)

          setIsloadingData(false)
        },
      )
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null)
      setSubscription(null)
    }
  }, [user, isLoadingUser])

  const value = {
    accessToken,
    user,
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

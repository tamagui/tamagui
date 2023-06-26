'use client'

import { Database } from '@lib/supabase-types'
import { Session, SupabaseClient } from '@supabase/auth-helpers-nextjs'
import { createContext, useContext } from 'react'

type SupabaseContext = {
  supabase: SupabaseClient<Database>
}

const Context = createContext<SupabaseContext | undefined>(undefined)
const SessionContext = createContext<Session | null>(null)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
  // const [supabase] = useState(() => createBrowserSupabaseClient<Database>())
  // const router = useRouter()
  // const [session, setSession] = useState<Session | null>(null)

  // useEffect(() => {
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     router.refresh()
  //     setSession(session)
  //   })

  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [router, supabase])

  // return (
  //   <Context.Provider value={{ supabase }}>
  //     <SessionContext.Provider value={session}>
  //       <SharedAuthHandler>{children}</SharedAuthHandler>
  //     </SessionContext.Provider>
  //   </Context.Provider>
  // )
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }

  return context.supabase
}

export const useSession = () => {
  const context = useContext(SessionContext)

  if (context === undefined) {
    throw new Error('useSession must be used inside SessionProvider')
  }

  return context
}

const SharedAuthHandler = ({ children }: { children: React.ReactNode }) => {
  // const supabase = useSupabase()

  // useSharedAuth(supabase, {
  //   onUnauthenticated: () => {
  //     location.href = `${process.env.NEXT_PUBLIC_SITE_ADDRESS}/login`
  //   },
  // })
  return <>{children}</>
}

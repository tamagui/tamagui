import { useUser } from '@supabase/supabase-auth-helpers/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useForwardToDashboard() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace('/account')
    }
  }, [user])
}

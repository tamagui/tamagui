import { useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export function useForwardToDashboard() {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.replace(
        process.env.NODE_ENV === 'production'
          ? 'https://studio.tamagui.dev/'
          : 'http://localhost:1421/'
      )
    }
  }, [user])
}

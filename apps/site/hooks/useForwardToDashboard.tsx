import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useUser } from './useUser'

export function useForwardToDashboard() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user && !isLoading) {
      router.replace('/account')
    }
  }, [user, isLoading])
}

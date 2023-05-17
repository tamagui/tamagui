import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useUser } from './useUser'

export function useForwardToDashboard() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    const main = async () => {
      if (user && !isLoading) {
        await fetch('/api/sponsorship-sync', { method: 'POST' })
        await router.replace('/account')
      }
    }
    main()
  }, [user, isLoading])
}

import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useUser } from './useUser'

export function useForwardToDashboard() {
  const { data, isLoading } = useUser()
  const user = data?.session?.user
  const router = useRouter()

  useEffect(() => {
    const main = async () => {
      if (user && !isLoading) {
        await router.replace(
          typeof router.query.redirect_to === 'string'
            ? router.query.redirect_to
            : '/account'
        )
      }
    }
    main()
  }, [user, isLoading, router.query.redirect_to])
}

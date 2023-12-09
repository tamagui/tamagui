import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useUser } from './useUser'

const ALLOWED_REDIRECT_DOMAINS = ['tamagui.dev']

export function useForwardToDashboard() {
  const { data, isLoading } = useUser()
  const user = data?.session?.user
  const router = useRouter()

  useEffect(() => {
    const main = async () => {
      if (user && !isLoading) {
        if (router.query.studio) {
          location.href =
            process.env.NODE_ENV === 'development'
              ? 'http://localhost:1421'
              : 'https://studio.tamagui.dev'
        } else {
          let redirectTo = '/account' // default
          if (router.query.redirect_to === 'string') {
            if (router.query.redirect_to.startsWith('/')) {
              redirectTo = router.query.redirect_to
            } else {
              try {
                const url = new URL(router.query.redirect_to)
                if (ALLOWED_REDIRECT_DOMAINS.includes(url.host) || process.env.NODE_ENV !== "production") {
                  redirectTo = router.query.redirect_to
                }
              } catch {
                // just use the default "/account"
              }
            }
          }
          await router.replace(redirectTo)
        }
      }
    }
    main()
  }, [user, isLoading, router.query.redirect_to])
}

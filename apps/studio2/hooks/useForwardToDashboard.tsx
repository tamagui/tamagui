import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useUser } from '../features/auth/useUser'

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
          if (typeof router.query.redirect_to === 'string') {
            const decodedUrl = decodeURIComponent(router.query.redirect_to)
            if (decodedUrl.startsWith('/')) {
              // e.g. /account/items
              redirectTo = decodedUrl
            } else {
              try {
                const url = new URL(decodedUrl)
                if (
                  ALLOWED_REDIRECT_DOMAINS.includes(url.host) ||
                  process.env.NODE_ENV !== 'production'
                ) {
                  redirectTo = decodedUrl
                }
              } catch {
                // means the url is invalid
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

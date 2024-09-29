import { useEffect } from 'react'
import { useGlobalSearchParams, useRouter } from 'vxs'
import { useUser } from './useUser'

const ALLOWED_REDIRECT_DOMAINS = ['tamagui.dev', '127.0.0.1', 'localhost']

export function useForwardToDashboard() {
  const { data, isLoading } = useUser()
  const user = data?.user
  const query = useGlobalSearchParams<any>()
  const router = useRouter()

  useEffect(() => {
    const main = async () => {
      if (user && !isLoading) {
        let redirectTo = '/account' // default
        if (typeof query.redirect_to === 'string') {
          const decodedUrl = decodeURIComponent(query.redirect_to)
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
        await router.replace(
          // @ts-expect-error
          redirectTo
        )
      }
    }
    main()
  }, [user, isLoading, query.redirect_to])
}

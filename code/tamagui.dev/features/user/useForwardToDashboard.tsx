import { type Href, useActiveParams, useRouter } from 'one'
import { useEffect } from 'react'
import { useUser } from './useUser'
import { accountModal } from '../site/purchase/NewAccountModal'

const ALLOWED_REDIRECT_DOMAINS = ['tamagui.dev', '127.0.0.1', 'localhost']

export function useForwardToDashboard() {
  const { data, isLoading } = useUser()
  const user = data?.user
  const query = useActiveParams<any>()
  const router = useRouter()

  useEffect(() => {
    const main = async () => {
      if (user && !isLoading) {
        if (typeof query.redirect_to === 'string') {
          const decodedUrl = decodeURIComponent(query.redirect_to)
          if (decodedUrl.startsWith('/')) {
            // e.g. /account/items
            await router.replace(decodedUrl as Href)
          } else {
            try {
              const url = new URL(decodedUrl)
              if (
                ALLOWED_REDIRECT_DOMAINS.includes(url.host) ||
                process.env.NODE_ENV !== 'production'
              ) {
                await router.replace(decodedUrl as Href)
              }
            } catch {
              // means the url is invalid
              // just show the account modal
              accountModal.show = true
            }
          }
        } else {
          // No redirect_to, show the account modal
          accountModal.show = true
        }
      }
    }
    main()
  }, [user, isLoading, query.redirect_to])
}

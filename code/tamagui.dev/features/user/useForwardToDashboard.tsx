import { type Href, useActiveParams, useRouter } from 'one'
import { useEffect } from 'react'
import {
  getSafeInternalPath,
  safeDecodeURIComponent,
} from '~/features/security/navigation'
import { useUser } from './useUser'
import { accountModal } from '../site/purchase/accountModalStore'

export function useForwardToDashboard() {
  const { data, isLoading } = useUser()
  const user = data?.user
  const query = useActiveParams<any>()
  const router = useRouter()

  useEffect(() => {
    const main = async () => {
      if (user && !isLoading) {
        // If we're in a popup window opened by the login link, notify the opener and close
        if (window.opener && window.opener !== window) {
          window.opener.postMessage(
            { type: 'SUPABASE_AUTH_SUCCESS' },
            window.location.origin
          )
          window.close()
          return
        }

        if (typeof query.redirect_to === 'string') {
          const redirectPath = getSafeInternalPath(
            safeDecodeURIComponent(query.redirect_to),
            {
              fallback: '',
            }
          )

          if (redirectPath) {
            await router.replace(redirectPath as Href)
            return
          }

          accountModal.show = true
        } else {
          // No redirect_to, show the account modal
          accountModal.show = true
        }
      }
    }
    main()
  }, [user, isLoading, query.redirect_to])
}

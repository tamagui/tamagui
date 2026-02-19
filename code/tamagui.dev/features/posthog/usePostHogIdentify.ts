import { useEffect } from 'react'
import { useUser } from '~/features/user/useUser'
import { clientPostHog } from './client'

export function usePostHogIdentify() {
  const { data } = useUser()
  const user = data?.user

  useEffect(() => {
    if (user) {
      clientPostHog.identify(user.id, {
        email: user.email,
      })
    }
  }, [user?.id, user?.email])
}

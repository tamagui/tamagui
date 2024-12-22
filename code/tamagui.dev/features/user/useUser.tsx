import { useEffect } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { Spinner, YStack } from 'tamagui'
import { useRouter } from 'one'

import { useOfflineMode } from '~/hooks/useOfflineMode'
import type { UserContextType } from '../auth/types'

export const useUser = () => {
  const { mutate } = useSWRConfig()
  const response = useSWR<UserContextType | null>('user', {
    fetcher: async () => {
      if (typeof window === 'undefined') {
        return null
      }
      const res = await fetch('/api/user')
      if (res.ok) {
        return (await res.json()) as UserContextType
      }

      // in the case where you are unauthorized lets clear all cookies
      // this is because we had a bad version of supabase ssr that caused bad cookies
      // and users with those cookies cant sign in
      deleteSupabaseCookies()

      return null
    },
    refreshInterval: 0,
  })
  return {
    ...response,
    refresh() {
      mutate('user')
    },
  }
}

function deleteSupabaseCookies() {
  document.cookie.split(';').forEach((cookie) => {
    const [name] = cookie.split('=')
    if (name.startsWith('sb-')) {
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  })
}

export const UserGuard = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useUser()
  const router = useRouter()
  const isOffline = useOfflineMode()
  const user = data?.user

  useEffect(() => {
    if (isOffline) {
      return
    }
    if (!user && !isLoading) {
      router.push(`/login`)
    }
  }, [isOffline, user, isLoading, router])

  if (!user)
    return (
      <YStack ai="center" flex={1} jc="center">
        <Spinner size="large" />
      </YStack>
    )

  return <>{children}</>
}

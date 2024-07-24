import { useEffect } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { Spinner, YStack } from 'tamagui'
import { useRouter } from 'vxs'

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

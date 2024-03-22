import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import { Spinner, YStack } from 'tamagui'

import type { UserContextType } from '../pages/api/user'
import { useOfflineMode } from './useOfflineMode'

const siteRootDir = process.env.NODE_ENV === 'development' ? '' : 'https://tamagui.dev'

export const useUser = () => {
  return useSWR<UserContextType | null>('user', {
    fetcher: async () => {
      try {
        const res = await fetch('/api/user')
        if (res.ok) {
          return (await res.json()) as UserContextType
        }
        return null
      } catch (error) {
        return null
      }
    },
    refreshInterval: 0,
  })
}

export const UserGuard = ({ children }: { children: React.ReactNode }) => {
  const { data, isLoading } = useUser()
  const router = useRouter()
  const isOffline = useOfflineMode()
  const user = data?.session?.user

  useEffect(() => {
    if (isOffline) {
      return
    }
    if (!user && !isLoading && router.isReady) {
      router.push(`${siteRootDir}/login`)
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

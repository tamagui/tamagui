import { studioRootDir } from '@protected/studio/constants'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useUser } from './useUser'

export function useForwardToDashboard() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    console.log(user, isLoading)
    if (user && !isLoading) {
      console.log(studioRootDir)
      router.replace(studioRootDir)
    }
  }, [user, isLoading])
}

import { useEffect } from 'react'
import { clientPostHog } from './client'
import { initializeErrorHandling } from './errorHandling'
import { usePostHogIdentify } from './usePostHogIdentify'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    clientPostHog.initialize()
    initializeErrorHandling()
  }, [])

  usePostHogIdentify()

  return <>{children}</>
}

import { useEffect } from 'react'
import { clientPostHog } from './client'
import { initializeErrorHandling } from './errorHandling'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    clientPostHog.initialize()
    initializeErrorHandling()
  }, [])

  return <>{children}</>
}

import { useState, useEffect } from 'react'

/**
 * Retrieves the user's Tamagui configuration from localStorage as a raw string.
 * SSR-safe implementation that doesn't use client-only guards.
 * @returns {string | null} userTamaguiConfig - The user's tamagui configuration
 */
export const useUserTamaguiConfig = () => {
  const [userTamaguiConfig, setUserTamaguiConfig] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userTamaguiConfig')
      setUserTamaguiConfig(stored || null)
    } catch {
      // localStorage not available
    }
  }, [])

  return userTamaguiConfig
}

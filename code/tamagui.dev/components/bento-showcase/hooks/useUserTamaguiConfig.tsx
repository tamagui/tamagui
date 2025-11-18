import { useLocalStorage } from 'foxact/use-local-storage'

/**
 * Retrieves the user's Tamagui configuration from localStorage as a raw string.
 * @returns {string | null} userTamaguiConfig - The user's tamagui configuration
 */
export const useUserTamaguiConfig = () => {
  const [userTamaguiConfig] = useLocalStorage<string | null>('userTamaguiConfig', '', {
    raw: true, // Return the raw string from localStorage, don't auto-parse JSON
  })
  return userTamaguiConfig || null
}

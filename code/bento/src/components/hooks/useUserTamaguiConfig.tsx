import { useLocalStorage } from 'foxact/use-local-storage'

/**
 * Retrieves the user's Tamagui configuration from localStorage with error handling, preventing parsing empty strings or invalid JSON.
 * @returns {string | null} userTamaguiConfig - The user's tamagui configuration
 */
export const useUserTamaguiConfig = () => {
  const [userTamaguiConfig] = useLocalStorage<string | null>('userTamaguiConfig', '', {
    raw: false,
    serializer: safeJSONStringify,
    deserializer: safeJSONParse,
  })
  return userTamaguiConfig
}

const safeJSONStringify = (value: unknown) => {
  try {
    return JSON.stringify(value)
  } catch (error) {
    console.warn('Failed to stringify value for localStorage:', error)
    return ''
  }
}

const safeJSONParse = (value: string) => {
  try {
    return JSON.parse(value)
  } catch (error) {
    console.warn('Failed to parse JSON from localStorage:', error)
    return null
  }
}

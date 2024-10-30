// Import the current platform from Tamagui constants
import { currentPlatform } from '@tamagui/constants'

// Define an array of supported platforms
export const platforms = ['web', 'native', 'ios', 'android']

// Function to check if a given platform key is active
export function isActivePlatform(key: string) {
  // If the key doesn't start with '$', and it's not in the platforms array, it's always active
  if (!key.startsWith('$') && !platforms.includes(key)) {
    return true
  }
  // Remove the '$' prefix from the key
  const platform = key.slice(1)
  return (
    // Check if the platform matches the current platform (web, ios, android)
    platform === currentPlatform ||
    // Or if it matches the TAMAGUI_TARGET environment variable (web, native)
    platform === process.env.TAMAGUI_TARGET
  )
}

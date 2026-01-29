/**
 * Browser detection helpers for Takeout animations
 */

/**
 * Detects if the current browser is desktop Safari (macOS only)
 * Note: Returns false for iOS Safari since animations work fine there
 */
export const isSafari = (): boolean => {
  if (typeof navigator === 'undefined') return false

  const userAgent = navigator.userAgent.toLowerCase()
  const vendor = navigator.vendor?.toLowerCase() || ''

  // Check if it's iOS (iPhone/iPad/iPod)
  const isIOS = /iphone|ipad|ipod/.test(userAgent)

  // If it's iOS, return false (animations work fine on iOS)
  if (isIOS) return false

  // Check for desktop Safari but exclude Chrome/Chromium browsers
  const isSafariBrowser = /^((?!chrome|chromium|android).)*safari/i.test(userAgent)

  // Additional check using vendor (Apple browsers have "apple" in vendor)
  const isAppleVendor = vendor.includes('apple')

  // Only return true for desktop Safari on macOS
  return isSafariBrowser && isAppleVendor
}

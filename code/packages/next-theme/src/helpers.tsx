import { MEDIA } from './constants'

export const helpers = {}
// Helpers

export const getTheme = (key: string, fallback?: string): any => {
  if (typeof window === 'undefined') return undefined
  let theme
  try {
    theme = localStorage.getItem(key) || undefined
  } catch (e) {
    // Unsupported
  }
  return theme || fallback
}

export const getSystemTheme = (e?: MediaQueryList): 'dark' | 'light' => {
  if (!e) {
    e = window.matchMedia(MEDIA)
  }

  const isDark = e.matches
  const systemTheme = isDark ? 'dark' : 'light'
  return systemTheme
}

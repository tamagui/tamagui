import { isWeb } from '../constants/platform'

export function insertStyleRule(rule: string) {
  if (typeof window === 'undefined') {
    return
  }
  if (process.env.NODE_ENV === 'development') {
    if (!isWeb) {
      console.warn('non web platform, dont use this')
      return
    }
  }
  const sheet = window.document.styleSheets[0]
  if (!sheet) {
    return
  }
  sheet.insertRule(rule, sheet.cssRules.length)
}

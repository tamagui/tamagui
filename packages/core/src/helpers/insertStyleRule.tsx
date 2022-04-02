import { isWeb } from '../constants/platform'

// this needs to check if its inserted already? 99% of the time it is

const inserted = {}
if (typeof window !== 'undefined') {
  const sheets = window.document.styleSheets
  for (let i = 0; i < sheets.length; i++) {
    const rules = sheets[i].cssRules
    const firstRule = rules[0]
    if (firstRule?.['selectorText'] === ':root') {
      // @ts-ignore
      for (const rule of rules) {
        if (!rule.selectorText) continue
        inserted[rule.selectorText.slice(1)] = true
      }
    }
  }
}

export function insertStyleRule(identifier: string, rule: string) {
  if (typeof window === 'undefined') {
    return
  }
  if (process.env.NODE_ENV === 'development') {
    if (!isWeb) {
      console.warn('non web platform, dont use this')
      return
    }
  }
  if (inserted[identifier]) {
    return
  }
  const sheet = window.document.styleSheets[0]
  if (!sheet) {
    return
  }
  sheet.insertRule(rule, sheet.cssRules.length)
}

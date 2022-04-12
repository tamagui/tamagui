import { isWeb } from '../constants/platform'

// this needs to check if its inserted already? 99% of the time it is

export const insertedSelectors = {}

if (typeof window !== 'undefined') {
  const sheets = window.document.styleSheets
  for (let i = 0; i < sheets.length; i++) {
    const rules = sheets[i].cssRules
    const firstRule = rules[0]
    if (firstRule?.['selectorText'] === ':root') {
      // @ts-ignore
      for (const rule of rules) {
        if (!rule.selectorText) continue
        insertedSelectors[rule.selectorText.slice(1)] = true
      }
    }
  }
}

const newRulesStyleTag =
  typeof window !== 'undefined' ? document.head.appendChild(document.createElement('style')) : null

export function insertStyleRule(identifier: string, rule: string) {
  if (!newRulesStyleTag) {
    return
  }
  if (insertedSelectors[identifier]) {
    return
  }
  const sheet = newRulesStyleTag.sheet!
  sheet.insertRule(rule, sheet.cssRules.length)
  insertedSelectors[identifier] = process.env.NODE_ENV === 'development' ? sheet.cssRules : true
  return identifier
}

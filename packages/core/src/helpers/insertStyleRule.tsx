// this needs to check if its inserted already? 99% of the time it is
// this should avoid re-inserts, but need to test the perf trade-offs
// i tested with the site itself and the initial insert was trivial

const allSelectors = {}
const insertedSelectors = {}

export const getAllSelectors = () => allSelectors
export const getInsertedRules = () => Object.values(insertedSelectors)

if (typeof window !== 'undefined') {
  const sheets = window.document.styleSheets
  for (let i = 0; i < sheets.length; i++) {
    const rules = sheets[i].cssRules
    const firstRule = rules[0]
    if (firstRule?.['selectorText'] === ':root') {
      // @ts-ignore
      for (const rule of rules) {
        if (!rule.selectorText) continue
        allSelectors[rule.selectorText.slice(1)] = true
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
  if (allSelectors[identifier]) {
    return
  }
  const sheet = newRulesStyleTag.sheet!
  sheet.insertRule(rule, sheet.cssRules.length)
  allSelectors[identifier] = process.env.NODE_ENV === 'development' ? rule : true
  insertedSelectors[identifier] = rule
  return identifier
}

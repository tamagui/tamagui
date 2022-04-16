// this needs to check if its inserted already? 99% of the time it is
// this should avoid re-inserts, but need to test the perf trade-offs
// i tested with the site itself and the initial insert was trivial

const allSelectors = {}
const insertedSelectors = {}
const transforms = {}

export const getAllSelectors = () => allSelectors
export const getInsertedRules = () => Object.values(insertedSelectors)
export const getAllTransforms = () => transforms

// keep transforms in map for merging later
function addTransform(identifier: string, rule: string) {
  const s = rule.indexOf('transform:')
  if (s === -1) throw new Error(`not a transform ${rule}`)
  const startI = s + 'transform:'.length
  const endI = rule.indexOf(';')
  const value = rule.slice(startI, endI)
  transforms[identifier] = value
}

// gets existing ones (client side)
// takes ~0.1ms for a fairly large page
if (typeof window !== 'undefined') {
  const sheets = window.document.styleSheets
  for (let i = 0; i < sheets.length; i++) {
    const rules = sheets[i].cssRules
    const firstRule = rules[0]

    if (firstRule?.['selectorText'] === ':root' || firstRule?.['selectorText'].startsWith('._')) {
      for (const rule of rules as any) {
        if (!rule.selectorText) continue
        const identifier = rule.selectorText.slice(1)
        allSelectors[identifier] = true
        if (identifier.startsWith('_transform')) {
          addTransform(identifier, rule.cssText)
        }
      }
    }
  }
}

const newRulesStyleTag =
  typeof window !== 'undefined' ? document.head.appendChild(document.createElement('style')) : null

export function insertStyleRule(identifier: string, rule: string) {
  if (allSelectors[identifier]) {
    return
  }
  insertedSelectors[identifier] = rule
  allSelectors[identifier] = process.env.NODE_ENV === 'development' ? rule : true
  if (identifier.startsWith('_transform')) {
    addTransform(identifier, rule)
  }
  if (!newRulesStyleTag) {
    return
  }
  const sheet = newRulesStyleTag.sheet!
  sheet.insertRule(rule, sheet.cssRules.length)
  return identifier
}

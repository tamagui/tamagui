// this needs to check if its inserted already? 99% of the time it is
// this should avoid re-inserts, but need to test the perf trade-offs
// i tested with the site itself and the initial insert was trivial

const allSelectors = {}
const insertedSelectors = {}
export const insertedTransforms = {}

export const getAllSelectors = () => allSelectors
export const getInsertedRules = () => Object.values(insertedSelectors)
export const getAllTransforms = () => insertedTransforms

// keep transforms in map for merging later
function addTransform(identifier: string, rule: string) {
  const s = rule.indexOf('transform:')
  if (s === -1) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Invalid transform, likely used deg/% improperly ${identifier} ${rule}`)
    }
    return
  }
  const startI = s + 'transform:'.length
  const endI = rule.indexOf(';')
  const value = rule.slice(startI, endI)
  insertedTransforms[identifier] = value
}

// gets existing ones (client side)
// takes ~0.1ms for a fairly large page
// used now for three things:
//   1. debugging at dev time
//   2. avoid duplicate insert styles at runtime
//   3. used now for merging transforms atomically
let hasInsertedSinceUpdate = true
const isClient = typeof document !== 'undefined'
export function updateInserted() {
  if (!isClient) {
    return
  }
  if (!hasInsertedSinceUpdate) {
    console.warn('hasnt inserted since')
    return
  }
  const sheets = document.styleSheets
  if (!sheets) return
  for (let i = 0; i < sheets.length; i++) {
    const rules = sheets[i].cssRules
    const firstRule = rules[0]
    if (!(firstRule instanceof CSSStyleRule)) continue
    const firstSelector = firstRule.selectorText
    if (!firstSelector) continue
    if (firstSelector === ':root' || firstSelector.startsWith('._')) {
      for (let i = 0; i < rules.length; i++) {
        const rule = rules.item(i)
        if (!(rule instanceof CSSStyleRule)) continue
        const identifier = rule.selectorText.slice(1)
        allSelectors[identifier] = process.env.NODE_ENV === 'development' ? rule.cssText : true
        if (identifier.startsWith('_transform')) {
          if (identifier === '_transform-18yurpa') {
            debugger
          }
          addTransform(identifier, rule.cssText)
        }
      }
    }
  }
  hasInsertedSinceUpdate = false
}

updateInserted()

const newRulesStyleTag =
  typeof document !== 'undefined'
    ? document.head.appendChild(document.createElement('style'))
    : null

export function insertStyleRule(identifier: string, rule: string) {
  if (allSelectors[identifier]) {
    return
  }
  hasInsertedSinceUpdate = true
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

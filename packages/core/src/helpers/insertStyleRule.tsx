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
function addTransform(identifier: string, css: string, rule?: CSSRule) {
  const s = css.indexOf('transform:')
  if (s === -1) {
    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed(`❌ Invalid transform, likely used deg/% improperly ${identifier}`)
      console.log('rule:', rule)
      console.trace()
      console.groupEnd()
    } else {
      console.error(`Missing transform`, identifier, css, rule)
    }
    return
  }
  const startI = s + 'transform:'.length
  const endI = css.indexOf(';')
  const value = css.slice(startI, endI)
  insertedTransforms[identifier] = value
}

const isClient = typeof document !== 'undefined'

// gets existing ones (client side)
// takes ~0.1ms for a fairly large page
// used now for three things:
//   1. debugging at dev time
//   2. avoid duplicate insert styles at runtime
//   3. used now for merging transforms atomically
let hasInsertedSinceUpdate = true

export function updateInserted() {
  if (process.env.NODE_ENV === 'test') return
  if (!isClient) return
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
        if (!allSelectors[identifier]) {
          allSelectors[identifier] = process.env.NODE_ENV === 'development' ? rule.cssText : true
          if (identifier.startsWith('_transform')) {
            addTransform(identifier, rule.cssText, rule)
          }
        }
      }
    }
  }
  hasInsertedSinceUpdate = false
}

updateInserted()

const sheet = isClient ? document.head.appendChild(document.createElement('style')).sheet : null

export function updateInsertedCache(identifier: string, rule: string) {
  if (insertedSelectors[identifier]) return
  insertedSelectors[identifier] = rule
  const isTransform = identifier.startsWith('_transform')
  if (isTransform) {
    addTransform(identifier, rule)
  }
}

export function insertStyleRule(identifier: string, rule: string) {
  if (allSelectors[identifier]) return
  hasInsertedSinceUpdate = true
  updateInsertedCache(identifier, rule)
  allSelectors[identifier] = process.env.NODE_ENV === 'development' ? rule : true
  sheet?.insertRule(rule, sheet.cssRules.length)
}

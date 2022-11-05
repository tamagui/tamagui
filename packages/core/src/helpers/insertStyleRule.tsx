// this needs to check if its inserted already? 99% of the time it is
// this should avoid re-inserts, but need to test the perf trade-offs
// i tested with the site itself and the initial insert was trivial

import type { StyleObject } from '@tamagui/helpers'

const allSelectors: Record<string, string> = {}
const allRules: Record<string, boolean | string[]> = {}
export const insertedTransforms = {}

export const getAllSelectors = () => allSelectors
export const getAllRules = () => Object.values(allRules)
export const getAllTransforms = () => insertedTransforms

// keep transforms in map for merging later
function addTransform(identifier: string, css: string, rule?: CSSRule) {
  const s = css.indexOf('transform:')
  if (s === -1) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.groupCollapsed(`❌ Invalid transform, likely used deg/% improperly ${identifier}`)
      // eslint-disable-next-line no-console
      console.log('rule:', rule)
      // eslint-disable-next-line no-console
      console.trace()
      // eslint-disable-next-line no-console
      console.groupEnd()
    } else {
      // missing transform
    }
    return false
  }
  const startI = s + 'transform:'.length
  const endI = css.indexOf(';')
  const value = css.slice(startI, endI)
  if (!insertedTransforms[identifier]) {
    insertedTransforms[identifier] = value
    return true
  }
  return false
}

const isClient = typeof document !== 'undefined'

// gets existing ones (client side)
// takes ~0.1ms for a fairly large page
// used now for three things:
//   1. debugging at dev time
//   2. avoid duplicate insert styles at runtime
//   3. used now for merging transforms atomically
const scannedNum = new WeakMap<CSSStyleSheet, number>()

export function updateInserted() {
  if (process.env.NODE_ENV === 'test') return
  if (!isClient) return
  const sheets = document.styleSheets
  if (!sheets) return
  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i]
    if (!sheet) continue

    // avoid errors on cross origin sheets
    // https://stackoverflow.com/questions/49993633/uncaught-domexception-failed-to-read-the-cssrules-property
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      continue
    }

    const len = rules.length
    const lastScanned = scannedNum.get(sheet) ?? 0
    if (lastScanned === len) {
      continue
    }
    for (let i = lastScanned; i < len; i++) {
      const rule = rules[i]
      const response = getTamaguiSelector(rule)
      if (!response) {
        continue
      }
      const [identifier, cssRule] = response
      if (!allSelectors[identifier]) {
        const isTransform = identifier.startsWith('_transform')
        const shouldInsert = isTransform ? addTransform(identifier, cssRule.cssText, cssRule) : true
        if (shouldInsert) {
          allSelectors[identifier] = cssRule.cssText
        }
      }
    }
    scannedNum.set(sheet, i)
  }
}

function getTamaguiSelector(rule: CSSRule | null): readonly [string, CSSStyleRule] | null {
  if (rule instanceof CSSStyleRule) {
    const text = rule.selectorText
    if (text.startsWith('._')) {
      return [text.slice(1), rule]
    }
    if (text.startsWith(':root') && text.includes('._')) {
      return [getIdentifierFromTamaguiSelector(text), rule]
    }
  } else if (rule instanceof CSSMediaRule) {
    // tamagui only ever inserts 1 rule per media
    if (rule.cssRules.length > 1) return null
    return getTamaguiSelector(rule.cssRules[0])
  }
  return null
}

const getIdentifierFromTamaguiSelector = (selector: string) =>
  selector
    .replace(/(:root)+\s+/, '')
    .replace(/:[a-z]+$/, '')
    .slice(1)

// move this to probably inside createTamagui
updateInserted()

const sheet = isClient ? document.head.appendChild(document.createElement('style')).sheet : null

export function updateRules(identifier: string, rules: string[]) {
  if (allRules[identifier]) return false
  allRules[identifier] = rules
  if (identifier.startsWith('_transform')) {
    return addTransform(identifier, rules[0])
  }
  return true
}

// [property, identifier, rules]
export type PartialStyleObject = Pick<StyleObject, 'identifier' | 'property' | 'rules'>
export type RulesToInsert = PartialStyleObject[]

export function insertStyleRules(rulesToInsert: RulesToInsert) {
  if (isClient && !sheet) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(`Missing sheet`)
    }
    return
  }
  for (const { identifier, rules } of rulesToInsert) {
    if (allSelectors[identifier]) continue
    allSelectors[identifier] = process.env.NODE_ENV === 'development' ? rules.join('\n') : ''
    updateRules(identifier, rules)
    if (sheet) {
      for (const rule of rules) {
        sheet.insertRule(rule, sheet.cssRules.length)
      }
    }
  }
}

const IS_STATIC = process.env.IS_STATIC === 'is_static'

export function shouldInsertStyleRules(styleObject: PartialStyleObject) {
  if (IS_STATIC) {
    return true
  }
  return !allSelectors[styleObject.identifier]
}

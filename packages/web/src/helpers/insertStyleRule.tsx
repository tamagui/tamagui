import { isClient } from '@tamagui/constants'

import type { RulesToInsert, StyleObject } from '../types'

const allSelectors: Record<string, string> = {}
const allRules: Record<string, string> = {}
export const insertedTransforms = {}

export const getAllSelectors = () => allSelectors
export const getAllRules = () => Object.values(allRules)
export const getAllTransforms = () => insertedTransforms

// keep transforms in map for merging later
function addTransform(identifier: string, css: string, rule?: CSSRule) {
  const s = css.indexOf('transform:')
  if (s === -1) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ Invalid transform, likely used deg/% improperly ${identifier}`)
    }
    return
  }
  const startI = s + 'transform:'.length
  const endI = css.indexOf(';')
  const value = css.slice(startI, endI)
  if (!insertedTransforms[identifier]) {
    insertedTransforms[identifier] = value
    return true
  }
}

// gets existing ones (client side)
// takes ~0.1ms for a fairly large page
// used now for three things:
//   1. debugging at dev time
//   2. avoid duplicate insert styles at runtime
//   3. used now for merging transforms atomically

// multiple sheets could have the same ids so we have to count

// only cache tamagui styles
const scannedCache = new WeakMap<CSSStyleSheet, string>()
const totalSelectorsInserted = new Map<string, number>()

export function listenForSheetChanges() {
  if (!isClient) return

  const mo = new MutationObserver((entries) => {
    for (const entry of entries) {
      if (
        (entry instanceof HTMLStyleElement && entry.sheet) ||
        (entry instanceof HTMLLinkElement && entry.href.endsWith('.css'))
      ) {
        scanAllSheets()
        break
      }
    }
  })

  mo.observe(document.head, {
    childList: true,
  })
}

let lastScannedSheets: Set<CSSStyleSheet> | null = null

export function scanAllSheets() {
  if (process.env.NODE_ENV === 'test') return
  if (!isClient) return

  const sheets = document.styleSheets || []
  const prev = lastScannedSheets
  const current = new Set(sheets as any as CSSStyleSheet[])
  if (document.styleSheets) {
    for (const sheet of current) {
      sheet && updateSheetStyles(sheet)
    }
    lastScannedSheets = current
  }

  if (prev) {
    for (const sheet of prev) {
      if (sheet && !current.has(sheet)) {
        updateSheetStyles(sheet, true)
      }
    }
  }
}

function track(id: string, remove = false) {
  const next = (totalSelectorsInserted.get(id) || 0) + (remove ? -1 : 1)
  totalSelectorsInserted.set(id, next)
  return next
}

function updateSheetStyles(sheet: CSSStyleSheet, remove = false) {
  // avoid errors on cross origin sheets
  // https://stackoverflow.com/questions/49993633/uncaught-domexception-failed-to-read-the-cssrules-property
  let rules: CSSRuleList
  try {
    rules = sheet.cssRules
    if (!rules) {
      return
    }
  } catch {
    return
  }

  const firstSelector = getTamaguiSelector(rules[0])?.[0]
  const lastSelector = getTamaguiSelector(rules[rules.length - 1])?.[0]
  const cacheKey = `${rules.length}${firstSelector}${lastSelector}`
  const lastScanned = scannedCache.get(sheet)

  if (!remove) {
    // avoid re-scanning
    if (lastScanned === cacheKey) {
      return
    }
  }

  const len = rules.length
  let fails = 0

  for (let i = 0; i < len; i++) {
    const rule = rules[i]
    if (!(rule instanceof CSSStyleRule)) continue

    const response = getTamaguiSelector(rule)

    if (!response) {
      fails++
      if (fails > 20) {
        // conservatively bail out of non-tamagui sheets
        return
      }
      continue
    }

    const [identifier, cssRule] = response

    // track references
    const total = track(identifier, remove)

    if (remove) {
      if (total === 0) {
        delete allSelectors[identifier]
      }
    } else if (!(identifier in allSelectors)) {
      const isTransform = identifier.startsWith('_transform')
      const shouldInsert = isTransform
        ? addTransform(identifier, cssRule.cssText, cssRule)
        : true
      if (shouldInsert) {
        allSelectors[identifier] = cssRule.cssText
      }
    }
  }

  scannedCache.set(sheet, cacheKey)
}

function getTamaguiSelector(
  rule: CSSRule | null
): readonly [string, CSSStyleRule] | null {
  if (rule instanceof CSSStyleRule) {
    const text = rule.selectorText
    if (text[0] === '.' && text[1] === '_') {
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

const sheet = isClient
  ? document.head.appendChild(document.createElement('style')).sheet
  : null

export function updateRules(identifier: string, rules: string[]) {
  if (identifier in allRules) {
    return false
  }
  allRules[identifier] = rules.join(' ')
  if (identifier.startsWith('_transform')) {
    return addTransform(identifier, rules[0])
  }
  return true
}

export function insertStyleRules(rulesToInsert: RulesToInsert) {
  if (!rulesToInsert.length || !sheet) {
    return
  }

  for (const { identifier, rules } of rulesToInsert) {
    if (!shouldInsertStyleRules(identifier)) {
      continue
    }

    allSelectors[identifier] = rules.join('\n')
    track(identifier)
    updateRules(identifier, rules)

    for (const rule of rules) {
      if (process.env.NODE_ENV === 'production') {
        sheet.insertRule(rule, sheet.cssRules.length)
      } else {
        try {
          sheet.insertRule(rule, sheet.cssRules.length)
        } catch (err) {
          console.groupCollapsed(
            `Error inserting rule into CSSStyleSheet: ${String(err)}`
          )
          // rome-ignore lint/nursery/noConsoleLog: <explanation>
          console.log({ rule, rulesToInsert })
          console.trace()
          console.groupEnd()
        }
      }
    }
  }
}

export function shouldInsertStyleRules(identifier: string) {
  if (process.env.IS_STATIC === 'is_static') {
    return true
  }
  const total = totalSelectorsInserted.get(identifier)
  // note, -1, we are being conservative and leaving some in
  return total === undefined || total < 2
}

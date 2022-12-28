import type { StyleObject } from '@tamagui/helpers'

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

// multiple sheets could have the same ids so we have to count

const scannedNum = new WeakMap<CSSStyleSheet, number>()
const totalSheetSelectors = new Map<string, number>()
const referencesInSheet = new WeakMap<CSSStyleSheet>()

export function listenForSheetChanges() {
  if (!isClient) return
  function handleNode(node: Node, remove = false) {
    if (node instanceof HTMLStyleElement && node.sheet) {
      updateSheetStyles(node.sheet, remove)
    }
  }
  const mo = new MutationObserver((entries) => {
    for (const entry of entries) {
      entry.addedNodes.forEach((node) => handleNode(node))
      entry.removedNodes.forEach((node) => handleNode(node, true))
    }
  })
  mo.observe(document.head, {
    childList: true,
  })
}

export function scanAllSheets() {
  if (process.env.NODE_ENV === 'test') return
  if (!isClient) return
  const sheets = document.styleSheets
  if (!sheets) return
  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i]
    if (!sheet) continue
    updateSheetStyles(sheet)
  }
}

function track(id: string, remove = false) {
  const next = (totalSheetSelectors.get(id) || 0) + (remove ? -1 : 1)
  totalSheetSelectors.set(id, next)
  return next
}

function updateSheetStyles(sheet: CSSStyleSheet, remove = false) {
  // avoid errors on cross origin sheets
  // https://stackoverflow.com/questions/49993633/uncaught-domexception-failed-to-read-the-cssrules-property
  let rules: CSSRuleList
  try {
    rules = sheet.cssRules
  } catch {
    return
  }

  const len = rules.length
  const lastScanned = scannedNum.get(sheet) || 0

  if (!remove) {
    // avoid work dumb but works
    if (lastScanned === len) {
      return
    }
  }

  for (let i = lastScanned; i < len; i++) {
    const rule = rules[i]
    const response = getTamaguiSelector(rule)
    if (!response) {
      return
    }

    const [identifier, cssRule] = response

    // track references
    const total = track(identifier, remove)

    if (remove) {
      if (total === 0) {
        delete allSelectors[identifier]
      }
    } else {
      if (!(identifier in allSelectors)) {
        const isTransform = identifier.startsWith('_transform')
        const shouldInsert = isTransform
          ? addTransform(identifier, cssRule.cssText, cssRule)
          : true
        if (shouldInsert) {
          allSelectors[identifier] = cssRule.cssText
        }
      }
    }
  }

  scannedNum.set(sheet, len)
}

function getTamaguiSelector(
  rule: CSSRule | null
): readonly [string, CSSStyleRule] | null {
  if (rule instanceof CSSStyleRule) {
    const text = rule.selectorText
    // .startsWith('._')
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
  if (allRules[identifier]) return false
  allRules[identifier] = rules.join(' ')
  if (identifier.startsWith('_transform')) {
    return addTransform(identifier, rules[0])
  }
  return true
}

// [property, identifier, rules]
export type PartialStyleObject = Pick<StyleObject, 'identifier' | 'property' | 'rules'>
export type RulesToInsert = PartialStyleObject[]

export function insertStyleRules(rulesToInsert: RulesToInsert) {
  if (!rulesToInsert.length) return
  if (isClient && !sheet) {
    if (process.env.NODE_ENV === 'development') throw 'impossible'
    return
  }
  for (const { identifier, rules } of rulesToInsert) {
    if (identifier in allSelectors) continue
    allSelectors[identifier] =
      process.env.NODE_ENV === 'development' ? rules.join('\n') : ' '
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
  return !(styleObject.identifier in allSelectors)
}

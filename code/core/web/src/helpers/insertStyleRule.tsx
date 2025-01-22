import { isClient } from '@tamagui/constants'
import { StyleObjectIdentifier, StyleObjectRules } from '@tamagui/helpers'
import { createVariable } from '../createVariable'
import type {
  DedupedTheme,
  DedupedThemes,
  RulesToInsert,
  ThemeParsed,
  TokensParsed,
} from '../types'

// only cache tamagui styles
// TODO merge totalSelectorsInserted and allSelectors?
const scannedCache = new WeakMap<CSSStyleSheet, string>()
const totalSelectorsInserted = new Map<string, number>()
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

// once react 19 onyl supported we can remove most of this
// gets existing ones (client side)
// takes ~0.1ms for a fairly large page
// used now for three things:
//   1. debugging at dev time
//   2. avoid duplicate insert styles at runtime
//   3. used now for merging transforms atomically

// multiple sheets could have the same ids so we have to count

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

export function scanAllSheets(
  collectThemes = false,
  tokens?: TokensParsed
): DedupedThemes | undefined {
  if (process.env.NODE_ENV === 'test') return
  if (!isClient) return

  let themes: DedupedThemes | undefined

  const sheets = document.styleSheets || []
  const prev = lastScannedSheets
  const current = new Set(sheets as any as CSSStyleSheet[])

  for (const sheet of current) {
    if (sheet) {
      const out = updateSheetStyles(sheet, false, collectThemes, tokens)
      if (out) {
        themes = out
      }
    }
  }

  lastScannedSheets = current

  if (prev) {
    for (const sheet of prev) {
      if (sheet && !current.has(sheet)) {
        updateSheetStyles(sheet, true)
      }
    }
  }

  return themes
}

function track(id: string, remove = false) {
  const next = (totalSelectorsInserted.get(id) || 0) + (remove ? -1 : 1)
  totalSelectorsInserted.set(id, next)
  return next
}

const bailAfterEnv = process.env.TAMAGUI_BAIL_AFTER_SCANNING_X_CSS_RULES
const bailAfter = bailAfterEnv ? +bailAfterEnv : 700

function updateSheetStyles(
  sheet: CSSStyleSheet,
  remove = false,
  collectThemes = false,
  tokens?: TokensParsed
): DedupedThemes | undefined {
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

  const firstSelector = getTamaguiSelector(rules[0], collectThemes)?.[0]
  const lastSelector = getTamaguiSelector(rules[rules.length - 1], collectThemes)?.[0]
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

  let dedupedThemes: DedupedThemes | undefined

  // because end-users can add their own css like .t_dark { --something: #000 }
  // and this actually entirely breaks scanning, we need to ensure we can handle multiple
  // themes, so track that here. also, css processing utils could cause this too
  const nameToTheme: Record<string, ThemeParsed> = {}

  for (let i = 0; i < len; i++) {
    const rule = rules[i]
    if (!(rule instanceof CSSStyleRule)) continue

    const response = getTamaguiSelector(rule, collectThemes)

    if (response) {
      // reset to 0 on any success as eg every other theme scan we get empty
      fails = 0
    } else {
      fails++
      if (fails > bailAfter) {
        // conservatively bail out of non-tamagui sheets
        return
      }
      continue
    }

    const [identifier, cssRule, isTheme] = response

    if (isTheme) {
      const deduped = addThemesFromCSS(cssRule, tokens)
      if (deduped) {
        for (const name of deduped.names) {
          if (nameToTheme[name]) {
            Object.apply(nameToTheme[name], deduped.theme as any)
            deduped.names = deduped.names.filter((x) => x !== name)
          } else {
            nameToTheme[name] = deduped.theme
          }
        }
        dedupedThemes ||= []
        dedupedThemes.push(deduped)
      }
      continue
    }

    if (!process.env.TAMAGUI_REACT_19) {
      // track references
      const total = track(identifier, remove)

      if (remove) {
        if (total === 0) {
          delete allSelectors[identifier]
        }
      } else if (!(identifier in allSelectors)) {
        const isTransform = identifier.startsWith('_transform-')
        const shouldInsert = isTransform
          ? addTransform(identifier, cssRule.cssText, cssRule)
          : true
        if (shouldInsert) {
          allSelectors[identifier] = cssRule.cssText
        }
      }
    }
  }

  scannedCache.set(sheet, cacheKey)

  return dedupedThemes
}

let colorVarToVal: Record<string, string>
let rootComputedStyle: CSSStyleDeclaration | null = null

function addThemesFromCSS(cssStyleRule: CSSStyleRule, tokens?: TokensParsed) {
  const selectors = cssStyleRule.selectorText.split(',')
  if (!selectors.length) return

  if (tokens?.color && !colorVarToVal) {
    colorVarToVal = {}
    for (const key in tokens.color) {
      const token = tokens.color[key]
      colorVarToVal[token.name] = token.val
    }
  }

  const rulesWithBraces = (cssStyleRule.cssText || '').slice(
    cssStyleRule.selectorText.length + 2,
    -1
  )

  const rules = rulesWithBraces.split(';')

  // get theme object parsed
  const values: ThemeParsed = {}
  // build values first
  for (const rule of rules) {
    const sepI = rule.indexOf(':')
    if (sepI === -1) continue
    const varIndex = rule.indexOf('--')
    let key = rule.slice(varIndex === -1 ? 0 : varIndex + 2, sepI)
    if (process.env.TAMAGUI_CSS_VARIABLE_PREFIX) {
      key = key.replace(process.env.TAMAGUI_CSS_VARIABLE_PREFIX, '')
    }
    const val = rule.slice(sepI + 2)
    let value: string
    if (val[0] === 'v' && val.startsWith('var(')) {
      // var()
      const varName = val.slice(6, -1)
      const tokenVal = colorVarToVal[varName]
      // either hydrate it from tokens directly or from computed style on body if no token
      if (tokenVal) {
        value = tokenVal
      } else {
        rootComputedStyle ||= getComputedStyle(document.body)
        value = rootComputedStyle.getPropertyValue('--' + varName)
      }
    } else {
      value = val
    }
    values[key] = createVariable(
      {
        key,
        name: key,
        val: value,
      },
      true
    ) as any
  }

  const names = new Set<string>()

  // loop selectors and build deduped
  for (const selector of selectors) {
    if (selector === ' .tm_xxt') continue
    const lastThemeSelectorIndex = selector.lastIndexOf('.t_')
    const name = selector.slice(lastThemeSelectorIndex).slice(3)
    const [schemeChar] = selector[lastThemeSelectorIndex - 5]
    const scheme = schemeChar === 'd' ? 'dark' : schemeChar === 'i' ? 'light' : ''
    const themeName = scheme && scheme !== name ? `${scheme}_${name}` : name
    if (!themeName || themeName === 'light_dark' || themeName === 'dark_light') {
      continue
    }
    names.add(themeName)
  }

  return {
    names: [...names],
    theme: values,
  } satisfies DedupedTheme
}

const tamaguiSelectorRegex = /^:root\s?\.t_[A-Za-z0-9_\,\s\:\.]+\s+\.tm_xxt\s?$/

function getTamaguiSelector(
  rule: CSSRule | null,
  collectThemes = false
): readonly [string, CSSStyleRule] | [string, CSSStyleRule, true] | undefined {
  if (rule instanceof CSSStyleRule) {
    const text = rule.selectorText

    // only matches t_ starting selector chains
    if (text[0] === ':' && text[1] === 'r' && tamaguiSelectorRegex.test(text)) {
      const id = getIdentifierFromTamaguiSelector(text)
      return collectThemes ? [id, rule, true] : [id, rule]
    }
  } else if (rule instanceof CSSMediaRule) {
    // tamagui only ever inserts 1 rule per media
    if (rule.cssRules.length > 1) return
    return getTamaguiSelector(rule.cssRules[0])
  }
}

const getIdentifierFromTamaguiSelector = (selector: string) => {
  const dotIndex = selector.indexOf(':')
  if (dotIndex > -1) {
    return selector.slice(7, dotIndex)
  }
  return selector.slice(7)
}

let sheet: CSSStyleSheet | null = null

export function updateRules(identifier: string, rules: string[]) {
  if (!process.env.TAMAGUI_REACT_19) {
    if (identifier in allRules) {
      return false
    }
    allRules[identifier] = rules.join(' ')
    if (identifier.startsWith('_transform-')) {
      return addTransform(identifier, rules[0])
    }
    return true
  }
}

let nonce = ''
export function setNonce(_: string) {
  nonce = _
}

export function insertStyleRules(rulesToInsert: RulesToInsert) {
  if (!process.env.TAMAGUI_REACT_19) {
    if (!sheet && isClient && document.head) {
      const styleTag = document.createElement('style')
      if (nonce) {
        styleTag.nonce = nonce
      }
      sheet = document.head.appendChild(styleTag).sheet
    }
    if (!sheet) return

    for (const key in rulesToInsert) {
      const styleObject = rulesToInsert[key]
      const identifier = styleObject[StyleObjectIdentifier]

      if (!shouldInsertStyleRules(identifier)) {
        continue
      }

      const rules = styleObject[StyleObjectRules]
      allSelectors[identifier] = rules.join('\n')
      track(identifier)
      updateRules(identifier, rules)

      for (const rule of rules) {
        if (process.env.NODE_ENV === 'production') {
          try {
            sheet.insertRule(rule, sheet.cssRules.length)
          } catch (err) {
            console.error(`Error inserting CSS`, err)
          }
        } else {
          sheet.insertRule(rule, sheet.cssRules.length)
        }
      }
    }
  }
}

// The way browser or next.js work you end up with CSS being removed *after* the new CSS loads for the upcoming page
// this causes many bugs. We defaulted to "2" here for safety, meaning we sacrificed some performance
// setting TAMAGUI_INSERT_SELECTOR_TRIES=1 will be faster so long as you are concatting your CSS together

const minInsertAmt = process.env.TAMAGUI_INSERT_SELECTOR_TRIES
  ? +process.env.TAMAGUI_INSERT_SELECTOR_TRIES
  : 1

export function shouldInsertStyleRules(identifier: string) {
  if (process.env.TAMAGUI_REACT_19) {
    return true
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    if (process.env.IS_STATIC === 'is_static') {
      return true
    }
    const total = totalSelectorsInserted.get(identifier)

    if (process.env.NODE_ENV === 'development') {
      if (
        totalSelectorsInserted.size >
        +(process.env.TAMAGUI_STYLE_INSERTION_WARNING_LIMIT || 10000)
      ) {
        console.warn(
          `Warning: inserting many CSS rules, you may be animating something and generating many CSS insertions, which can degrade performance. Instead, try using the "disableClassName" property on elements that change styles often. To disable this warning set TAMAGUI_STYLE_INSERTION_WARNING_LIMIT from 50000 to something higher`
        )
      }
    }
    // note we are being conservative allowing duplicates
    return total === undefined || total < minInsertAmt
  }
}

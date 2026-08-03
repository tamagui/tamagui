import {
  isAndroid,
  isIos,
  isTV,
  isWeb,
  supportsDynamicColorIOS,
} from '@tamagui/constants'
import {
  StyleObjectIdentifier,
  StyleObjectRules,
  tokenCategories,
  type StyleObject,
} from '@tamagui/helpers'
import type { ParsedValue } from '@tamagui/style-grammar/runtime'

import { isVariable } from '../createVariable'
import { mediaKeyMatch } from '../hooks/useMedia'
import type { GetStyleState } from '../types'
import { expandStyle } from './expandStyle'
import { getCSSStyleAtomic } from './getCSSStylesAtomic'
import { isColorStyleKey } from './getDynamicVal'
import { shouldInsertStyleRules, updateRules } from './insertStyleRule'
import { mediaObjectToString } from './mediaObjectToString'
import { normalizeColor } from './normalizeColor'
import { parseNativeStyle } from './parseNativeStyle.native'
import { parseNativeTransform } from './parseNativeTransform.native'
import { getTokenCategoryForProperty, tokenCategoryByProperty } from './propMapper'
import { resolveSafeAreaVariable } from './resolveSafeAreaVariable'
import { expandSafeAreaValue, isSafeAreaKey } from './resolveSafeArea'
import { resolveVariableValue } from './resolveVariableValue'
import { transformsToString } from './transformsToString'

export type MergeStyle = (
  state: GetStyleState,
  key: string,
  value: any,
  importance: number,
  disableNormalize?: boolean,
  originalValue?: any
) => void

type Condition = {
  key: string
  active: boolean
  emit: boolean
  selector: string
  wrappers?: string[]
  enter?: true
  exit?: true
  theme?: string
  specificity?: number
  specificityGroup?: string
  unsupportedState?: string
}

type DirectAtomic = {
  baseRules: number
  conditions?: Record<string, { count: number; index: number; default?: boolean }>
  identifier: string
  signature: string
  styleObject: StyleObject
}

type DirectState = GetStyleState & {
  flatAtomics?: Record<string, DirectAtomic>
  flatBoxShadow?: any
  flatDynamicColors?: Record<string, Record<string, any>>
  flatDynamicThemeAccess?: boolean
  flatLegacyTransforms?: Record<string, any>
  flatSpecificity?: Record<string, number>
  flatTextShadow?: Record<string, any>
  flatWebShadow?: Record<string, any>
}

const stateSelectors: Record<string, string> = {
  hover: ':hover',
  press: ':active',
  active: ':active',
  pressed: ':active',
  focus: ':focus',
  'focus-visible': ':focus-visible',
  'focus-within': ':focus-within',
  disabled: '[aria-disabled]',
  open: '[data-state="open"]',
  checked: '[data-state="checked"]',
  highlighted: '[data-highlighted]',
  selected: '[data-state="active"]',
  invalid: '[aria-invalid="true"]',
}

const legacyTransformParts = new Set([
  'matrix',
  'perspective',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scaleZ',
  'skewX',
  'skewY',
])

const webShadowParts = new Set([
  'shadowColor',
  'shadowOffset',
  'shadowOpacity',
  'shadowRadius',
])

const webTextShadowParts = new Set([
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
])

const lineStyles = new Set([
  'none',
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
])

const borderTargets: Record<
  string,
  { width: string[]; style: string[]; color: string[] }
> = {
  border: {
    width: ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth'],
    style: ['borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle'],
    color: ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'],
  },
  borderTop: {
    width: ['borderTopWidth'],
    style: ['borderTopStyle'],
    color: ['borderTopColor'],
  },
  borderRight: {
    width: ['borderRightWidth'],
    style: ['borderRightStyle'],
    color: ['borderRightColor'],
  },
  borderBottom: {
    width: ['borderBottomWidth'],
    style: ['borderBottomStyle'],
    color: ['borderBottomColor'],
  },
  borderLeft: {
    width: ['borderLeftWidth'],
    style: ['borderLeftStyle'],
    color: ['borderLeftColor'],
  },
  outline: {
    width: ['outlineWidth'],
    style: ['outlineStyle'],
    color: ['outlineColor'],
  },
  borderBlock: {
    width: ['borderBlockStartWidth', 'borderBlockEndWidth'],
    style: ['borderBlockStartStyle', 'borderBlockEndStyle'],
    color: ['borderBlockStartColor', 'borderBlockEndColor'],
  },
  borderInline: {
    width: ['borderInlineStartWidth', 'borderInlineEndWidth'],
    style: ['borderInlineStartStyle', 'borderInlineEndStyle'],
    color: ['borderInlineStartColor', 'borderInlineEndColor'],
  },
}

const borderStyleDefaults: Record<string, string> = {
  borderWidth: 'borderStyle',
  borderTopWidth: 'borderTopStyle',
  borderRightWidth: 'borderRightStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderLeftWidth: 'borderLeftStyle',
}

const mediaQueries = new WeakMap<object, Record<string, string>>()
const warned = process.env.NODE_ENV !== 'production' ? new Set<string>() : null

function warnOnce(message: string) {
  if (process.env.NODE_ENV === 'development' && !warned?.has(message)) {
    warned?.add(message)
    console.warn(`[tamagui] ${message}`)
  }
}

function queryFor(state: GetStyleState, name: string): string | undefined {
  let queries = mediaQueries.get(state.conf)
  if (!queries) {
    queries = {}
    const media = state.conf.media || {}
    for (const key in media) queries[key] = mediaObjectToString(media[key])
    mediaQueries.set(state.conf, queries)
  }
  return queries[name]
}

function stateIsActive(state: GetStyleState, name: string): boolean {
  const component = state.componentState
  if (name === 'hover') return !!component.hover
  if (name === 'press') return !!(component.press || component.pressIn)
  if (name === 'focus') return !!component.focus
  if (name === 'focus-visible') return !!component.focusVisible
  if (name === 'focus-within') return !!component.focusWithin
  if (name === 'disabled') return !!(component.disabled || state.props.disabled)
  if (name === 'enter') return !!component.unmounted
  if (name === 'exit') return !!state.styleProps.isExiting
  return false
}

function platformMatches(name: string): boolean {
  if (name === 'web') return isWeb
  if (name === 'native') return !isWeb
  if (name === 'ios') return isIos
  if (name === 'android') return isAndroid
  if (name === 'tvos') return isIos && isTV
  if (name === 'androidtv') return isAndroid && isTV
  return name === 'tv' && isTV
}

function groupCondition(state: GetStyleState, modifier: string, out: Condition) {
  const slash = modifier.indexOf('/')
  let stateName = modifier.slice(6, slash === -1 ? undefined : slash)
  const groupName = slash === -1 ? 'true' : modifier.slice(slash + 1)
  if (stateName === 'active' || stateName === 'pressed') stateName = 'press'
  const selector = stateSelectors[stateName]
  if (!selector || !groupName) return false
  out.selector += `:where(.t_group_${groupName}${selector} *)`
  if (stateName === 'hover') (out.wrappers ||= []).push('@media (hover: hover)')
  const component = state.componentState.group?.[groupName]
  const context = state.flatGroupContext?.[groupName]
  out.active &&= !!(component?.pseudo ?? context?.state.pseudo)?.[stateName]
  ;(state.flatGroupKeys ||= new Set()).add(groupName)
  return true
}

function containerCondition(state: GetStyleState, modifier: string, out: Condition) {
  const slash = modifier.indexOf('/')
  const size = modifier.slice(1, slash === -1 ? undefined : slash)
  const name = slash === -1 ? null : modifier.slice(slash + 1)
  const query = queryFor(state, size)
  if (!query || (name !== null && !name)) return false
  const key = name === null ? '@' : `@${name}`
  ;(out.wrappers ||= []).push(
    name === null ? `@container ${query}` : `@container ${name} ${query}`
  )
  const component = state.componentState.group?.[key]
  const context = state.flatGroupContext?.[key]
  const active = component?.media?.[size]
  out.active &&=
    active === undefined
      ? !!(context?.state.layout && mediaKeyMatch(size, context.state.layout))
      : !!active
  ;(state.flatGroupKeys ||= new Set()).add(key)
  ;(state.flatGroupMedia ||= new Set()).add(size)
  return true
}

function getCondition(state: GetStyleState, source: string): Condition | null {
  const out: Condition = { key: '', active: true, emit: true, selector: '' }
  const canonical: string[] = []
  const specificityGroup: string[] = []
  let start = 0
  for (let index = 0; index <= source.length; index++) {
    if (index !== source.length && source.charCodeAt(index) !== 58) continue
    let modifier = source.slice(start, index)
    start = index + 1
    if (!modifier) return null

    if (modifier.startsWith('group-')) {
      if (!groupCondition(state, modifier, out)) return null
      canonical.push(modifier)
      specificityGroup.push(modifier)
      continue
    }
    if (modifier.charCodeAt(0) === 64) {
      if (!containerCondition(state, modifier, out)) return null
      canonical.push(modifier)
      specificityGroup.push(modifier)
      continue
    }
    if (
      modifier in stateSelectors ||
      modifier === 'enter' ||
      modifier === 'exit' ||
      modifier === 'starting' ||
      modifier === 'ending'
    ) {
      modifier =
        modifier === 'active' || modifier === 'pressed'
          ? 'press'
          : modifier === 'starting'
            ? 'enter'
            : modifier === 'ending'
              ? 'exit'
              : modifier
      canonical.push(modifier)
      specificityGroup.push(modifier)
      const selector = stateSelectors[modifier]
      if (
        !isWeb &&
        modifier !== 'hover' &&
        modifier !== 'press' &&
        modifier !== 'focus' &&
        modifier !== 'focus-visible' &&
        modifier !== 'focus-within' &&
        modifier !== 'disabled' &&
        modifier !== 'enter' &&
        modifier !== 'exit'
      ) {
        out.unsupportedState = modifier
      }
      if (modifier === 'enter' || modifier === 'exit') {
        const cls = modifier === 'enter' ? '.t_unmounted' : '.t_exiting'
        out.selector += `:where(${cls}, ${cls} *)`
        out[modifier] = true
      } else if (selector) {
        out.selector += `:where(${selector})`
      }
      if (modifier === 'hover') (out.wrappers ||= []).push('@media (hover: hover)')
      out.active &&= stateIsActive(state, modifier)
      if (
        modifier === 'hover' ||
        modifier === 'press' ||
        modifier === 'focus' ||
        modifier === 'focus-visible' ||
        modifier === 'focus-within'
      ) {
        ;(state.flatStateKeys ||= new Set()).add(modifier)
      }
      continue
    }
    if (modifier in (state.conf.media || {})) {
      const query = queryFor(state, modifier)
      if (!query) return null
      canonical.push(modifier)
      specificityGroup.push(modifier)
      ;(out.wrappers ||= []).push(`@media ${query}`)
      out.active &&= !!state.flatMediaState?.[modifier]
      ;(state.flatMediaKeys ||= new Set()).add(modifier)
      continue
    }
    if (modifier in (state.conf.themes || {})) {
      canonical.push(modifier)
      specificityGroup.push(modifier)
      out.theme = modifier
      out.selector += `:where(.t_${modifier}, .t_${modifier} *)`
      out.active &&=
        state.flatThemeName === modifier ||
        state.flatThemeName?.startsWith(`${modifier}_`) === true
      continue
    }
    if (
      modifier === 'web' ||
      modifier === 'native' ||
      modifier === 'ios' ||
      modifier === 'android' ||
      modifier === 'tv' ||
      modifier === 'tvos' ||
      modifier === 'androidtv'
    ) {
      canonical.push(modifier)
      const matches = platformMatches(modifier)
      out.active &&= matches
      out.emit &&= matches
      out.specificity = Math.max(
        out.specificity || 0,
        modifier === 'native'
          ? 1
          : modifier === 'androidtv' || modifier === 'tvos'
            ? 3
            : 2
      )
      continue
    }
    return null
  }
  canonical.sort()
  out.key = canonical.join(':')
  if (out.specificity !== undefined) {
    specificityGroup.sort()
    out.specificityGroup = specificityGroup.join(':')
  }
  return out
}

function tokenVariable(state: GetStyleState, property: string, name: string): any {
  let lookupName = name
  if (property === 'fontFamily') return state.conf.fontsParsed[lookupName]?.family
  const fontKey =
    property === 'fontSize'
      ? 'size'
      : property === 'fontWeight'
        ? 'weight'
        : property === 'lineHeight' || property === 'letterSpacing'
          ? property
          : undefined
  if (fontKey) {
    const font =
      state.conf.fontsParsed[state.fontFamily || state.conf.defaultFontToken] ||
      state.conf.fontsParsed[state.conf.defaultFontToken]
    return font?.[fontKey]?.[lookupName]
  }
  const category = getTokenCategoryForProperty(property)
  const dot = lookupName.indexOf('.')
  if (dot !== -1) {
    const prefix = lookupName.slice(0, dot)
    if (!category || prefix === category || prefix === 'color') {
      lookupName = lookupName.slice(dot + 1)
    }
  }
  if (category) {
    const own = state.conf.tokensParsed[category]?.[lookupName]
    if (own) return own
    for (const sibling of ['color', 'space', 'size', 'radius', 'zIndex'] as const) {
      if (sibling !== category && state.conf.tokensParsed[sibling]?.[lookupName]) return
    }
    return (
      state.theme?.[lookupName] ||
      state.conf.themes?.[state.flatThemeName || '']?.[lookupName]
    )
  }
  const first = lookupName.charCodeAt(0)
  if ((first >= 48 && first <= 57) || first === 43 || first === 45 || first === 46) {
    return
  }
  return (
    state.theme?.[lookupName] ||
    state.conf.themes?.[state.flatThemeName || '']?.[lookupName] ||
    state.conf.tokensParsed.space?.[lookupName] ||
    state.conf.tokensParsed.color?.[lookupName]
  )
}

function configuredValue(state: GetStyleState, property: string, raw: string): any {
  let name = raw
  let opacity: number | undefined
  const slash = raw.lastIndexOf('/')
  if (slash > 0) {
    const amount = Number(raw.slice(slash + 1))
    if (Number.isInteger(amount) && amount >= 0 && amount <= 100) {
      name = raw.slice(0, slash)
      opacity = amount
    }
  }

  const safeArea = resolveSafeAreaVariable(name)
  if (safeArea !== undefined) {
    state.flatUsesSafeArea = true
    return safeArea
  }

  const variable = tokenVariable(state, property, name)
  if (!isVariable(variable)) {
    if (
      process.env.NODE_ENV === 'development' &&
      tokenCategoryByProperty[property] &&
      state.conf.tokensParsed.color?.[name]
    ) {
      warnOnce(`"${name}" contributes to "color", not "${property}"; keeping it literal`)
    }
    return raw
  }
  const resolveValues =
    isWeb && !state.flatShouldDoClasses && state.styleProps.resolveValues === 'auto'
      ? 'value'
      : state.styleProps.resolveValues
  let value = resolveVariableValue(property, variable, resolveValues)
  if (opacity !== undefined) {
    value = isWeb
      ? `color-mix(in srgb, ${value} ${opacity}%, transparent)`
      : normalizeColor(value, opacity / 100)
  }
  return value
}

function resolveEmbeddedTokens(state: GetStyleState, property: string, raw: string) {
  return raw.replace(/[$A-Za-z_][\w.$-]*(?:\/\d+)?/g, (word, index) => {
    if (word.charCodeAt(0) !== 36) {
      const before = raw.charCodeAt(index - 1)
      if (
        (before >= 48 && before <= 57) ||
        before === 35 ||
        (before === 45 && raw.charCodeAt(index - 2) === 45) ||
        raw.charCodeAt(index + word.length) === 40
      ) {
        return word
      }
    }
    const value = configuredValue(state, property, word)
    return value === word ? word : String(value)
  })
}

function normalizeTransitionNames(state: GetStyleState, raw: string) {
  let quote = 0
  let depth = 0
  let copyFrom = 0
  let out = ''
  for (let index = 0; index < raw.length; index++) {
    const code = raw.charCodeAt(index)
    if (quote) {
      if (code === 92) index++
      else if (code === quote) quote = 0
      continue
    }
    if (code === 34 || code === 39) {
      quote = code
      continue
    }
    if (code === 40) {
      depth++
      continue
    }
    if (code === 41) {
      depth--
      continue
    }
    if (
      depth ||
      !((code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 95) ||
      (index > 1 && raw.charCodeAt(index - 1) === 45 && raw.charCodeAt(index - 2) === 45)
    ) {
      continue
    }
    let end = index + 1
    while (end < raw.length) {
      const next = raw.charCodeAt(end)
      if (
        (next >= 48 && next <= 57) ||
        (next >= 65 && next <= 90) ||
        (next >= 97 && next <= 122) ||
        next === 45 ||
        next === 95
      ) {
        end++
      } else {
        break
      }
    }
    if (raw.charCodeAt(end) !== 40) {
      const authored = raw.slice(index, end)
      let property = state.conf.shorthands[authored] || authored
      if (property === 'x' || property === 'y') property = 'translate'
      else if (property === 'scaleX' || property === 'scaleY') property = 'scale'
      else if (legacyTransformParts.has(property)) property = 'transform'
      if (property !== authored || /[A-Z]/.test(property)) {
        out += raw.slice(copyFrom, index)
        out += property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
        copyFrom = end
      }
    }
    index = end - 1
  }
  return copyFrom ? out + raw.slice(copyFrom) : raw
}

// one contribution's slice of an atomic identity; accumulated per atomicKey in
// directAtomic, and reproduced standalone by the getSplitStyles class-strip
// path so a surviving base style keeps its server-rendered identifier
export function directStyleSignature(
  property: string,
  value: unknown,
  conditionKey = ''
) {
  return `\u001f${property}\u001f${conditionKey}\u001e${String(value)}`
}

function directAtomic(
  state: DirectState,
  property: string,
  value: any,
  condition: Condition | null,
  isDefault = false
) {
  const atomics = (state.flatAtomics ||= {})
  const atomicKey = property.startsWith('transition') ? 'transition' : property
  const existing = atomics[atomicKey]
  const signature = `${existing?.signature || ''}${directStyleSignature(property, value, condition?.key || '')}`
  const next = getCSSStyleAtomic(
    property,
    value,
    condition?.selector,
    condition?.wrappers,
    signature,
    true,
    atomicKey
  )
  if (!next) return
  const identifier = next[StyleObjectIdentifier]
  const nextRules = next[StyleObjectRules]

  if (!existing) {
    atomics[atomicKey] = {
      baseRules: condition || atomicKey === 'transition' ? 0 : nextRules.length,
      ...((condition || atomicKey === 'transition') && {
        conditions: {
          [atomicKey === 'transition'
            ? `${condition?.key || ''}\0${property}`
            : condition!.key]: {
            count: nextRules.length,
            index: 0,
            default: isDefault,
          },
        },
      }),
      identifier,
      signature,
      styleObject: next,
    }
  } else {
    const oldSelector = `.${existing.identifier}`
    const newSelector = `.${identifier}`
    const rules = existing.styleObject[StyleObjectRules]
    if (!condition && !isDefault && existing.conditions) {
      for (const key in existing.conditions) {
        const entry = existing.conditions[key]
        if (!entry.default) continue
        rules.splice(entry.index, entry.count)
        delete existing.conditions[key]
        for (const otherKey in existing.conditions) {
          const other = existing.conditions[otherKey]
          if (other.index > entry.index) other.index -= entry.count
        }
      }
    }
    if (existing.identifier !== identifier) {
      for (let index = 0; index < rules.length; index++) {
        rules[index] = rules[index].split(oldSelector).join(newSelector)
      }
    }
    if (condition || atomicKey === 'transition') {
      const slot =
        atomicKey === 'transition'
          ? `${condition?.key || ''}\0${property}`
          : condition!.key
      const previous = existing.conditions?.[slot]
      if (previous) {
        rules.splice(previous.index, previous.count)
        if (existing.conditions) {
          for (const key in existing.conditions) {
            const entry = existing.conditions[key]
            if (entry !== previous && entry.index > previous.index) {
              entry.index -= previous.count
            }
          }
        }
        previous.index = rules.length
        previous.count = nextRules.length
        previous.default = isDefault
        rules.push(...nextRules)
      } else {
        ;(existing.conditions ||= {})[slot] = {
          count: nextRules.length,
          index: rules.length,
          default: isDefault,
        }
        rules.push(...nextRules)
      }
    } else {
      const difference = nextRules.length - existing.baseRules
      rules.splice(0, existing.baseRules, ...nextRules)
      if (difference && existing.conditions) {
        for (const key in existing.conditions)
          existing.conditions[key].index += difference
      }
      existing.baseRules = nextRules.length
    }
    existing.identifier = identifier
    existing.signature = signature
    existing.styleObject[StyleObjectIdentifier] = identifier
    existing.styleObject[1] = next[1]
  }
  state.classNames[atomicKey] = identifier
}

function emitBorderStyleDefault(
  state: GetStyleState,
  property: string,
  condition: Condition | null
) {
  if (!isWeb || !state.flatShouldDoClasses || state.styleProps.noNormalize === false) {
    return
  }
  const target = borderStyleDefaults[property]
  if (!target) return
  const atomic = (state as DirectState).flatAtomics?.[target]
  if (
    atomic?.baseRules ||
    (state.classNames[target] && !atomic) ||
    (condition && atomic?.conditions?.[condition.key])
  ) {
    return
  }
  directAtomic(state as DirectState, target, 'solid', condition, true)
}

export function flushDirectStyles(state: GetStyleState, clear = false) {
  const direct = state as DirectState
  const atomics = direct.flatAtomics
  if (!atomics) return
  for (const property in atomics) {
    const styleObject = atomics[property].styleObject
    const identifier = styleObject[StyleObjectIdentifier]
    if (shouldInsertStyleRules(identifier)) {
      updateRules(identifier, styleObject[StyleObjectRules])
      state.flatRulesToInsert![identifier] = styleObject
    }
  }
  if (clear) direct.flatAtomics = undefined
}

export function getDirectDynamicThemeAccess(state: GetStyleState) {
  return (state as DirectState).flatDynamicThemeAccess
}

function emitProperty(
  state: GetStyleState,
  property: string,
  value: any,
  condition: Condition | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  const direct = state as DirectState
  if (condition?.enter) (state.flatEnterKeys ||= new Set()).add(property)
  if (condition?.exit) (state.flatExitKeys ||= new Set()).add(property)

  if (!isWeb && condition?.theme) {
    if (supportsDynamicColorIOS && isColorStyleKey(property)) {
      const schemes = ((direct.flatDynamicColors ||= {})[property] ||= {})
      schemes[condition.theme] =
        typeof originalValue === 'string' && /^[a-z]+$/i.test(originalValue)
          ? originalValue
          : value
      merge(state, property, { dynamic: { ...schemes } }, 1, false, originalValue)
      return
    }
    direct.flatDynamicThemeAccess = true
  }

  if (contextOnly) {
    if (!condition || condition.active) {
      ;(state.overriddenContextProps ||= {})[property] = originalValue
    }
    return
  }

  if (isWeb && state.flatShouldDoClasses) {
    if (!condition) {
      if (state.style) delete state.style[property]
    }
    directAtomic(state as DirectState, property, value, condition)
    return
  }

  if (condition) {
    if (!condition.active) return
    if (condition.specificity !== undefined) {
      const key = `${property}\0${condition.specificityGroup || ''}`
      const previous = direct.flatSpecificity?.[key] || 0
      if (condition.specificity < previous) return
      ;(direct.flatSpecificity ||= {})[key] = condition.specificity
    }
    ;(state.flatActiveConditions ||= {})[property] = true
  } else if (state.flatActiveConditions?.[property]) {
    return
  }
  merge(state, property, value, 1, true, originalValue)
}

function splitComponents(value: string) {
  const parts: string[] = []
  let start = 0
  let quote = 0
  let depth = 0
  for (let index = 0; index <= value.length; index++) {
    const code = index === value.length ? 32 : value.charCodeAt(index)
    if (quote) {
      if (code === 92) index++
      else if (code === quote) quote = 0
      continue
    }
    if (code === 34 || code === 39) quote = code
    else if (code === 40) depth++
    else if (code === 41) depth--
    else if (!depth && code <= 32) {
      if (index > start) parts.push(value.slice(start, index))
      start = index + 1
    }
  }
  return parts
}

function emitBorder(
  state: GetStyleState,
  property: string,
  raw: string,
  condition: Condition | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  if (!isWeb && (property === 'borderBlock' || property === 'borderInline')) {
    if (process.env.NODE_ENV === 'development') {
      warnOnce(`RN has no logical border shorthand "${property}"; dropping it`)
    }
    return
  }
  const targets = borderTargets[property]
  let width: string | undefined
  let style: string | undefined
  let color: string | undefined
  for (const part of splitComponents(raw)) {
    const lower = part.toLowerCase()
    if (lineStyles.has(lower) || (property === 'outline' && lower === 'auto')) {
      style = part
    } else if (
      lower === 'thin' ||
      lower === 'medium' ||
      lower === 'thick' ||
      /^-?(?:\d+\.?\d*|\.\d+)(?:[a-z%]+)?$/i.test(part) ||
      /^(?:calc|var|min|max|clamp)\(/i.test(part)
    ) {
      width = part
    } else {
      color = part
    }
  }
  if (style === 'none' && width === undefined) width = '0'
  if (width !== undefined) {
    for (const target of targets.width) {
      emitResolved(state, target, width, condition, merge, originalValue, contextOnly)
    }
  }
  if (style !== undefined) {
    const styleTargets = !isWeb && property === 'border' ? ['borderStyle'] : targets.style
    for (const target of styleTargets) {
      emitProperty(state, target, style, condition, merge, originalValue, contextOnly)
    }
  }
  if (color !== undefined) {
    for (const target of targets.color) {
      emitResolved(state, target, color, condition, merge, originalValue, contextOnly)
    }
  }
}

function emitTextDecoration(
  state: GetStyleState,
  raw: string,
  condition: Condition | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  for (const part of splitComponents(raw)) {
    const property =
      part === 'solid' ||
      part === 'double' ||
      part === 'dotted' ||
      part === 'dashed' ||
      part === 'wavy'
        ? 'textDecorationStyle'
        : part === 'underline' ||
            part === 'overline' ||
            part === 'line-through' ||
            part === 'none'
          ? 'textDecorationLine'
          : 'textDecorationColor'
    emitResolved(state, property, part, condition, merge, originalValue, contextOnly)
  }
}

function addComposition(state: GetStyleState, property: 'translate' | 'scale') {
  if (state.classNames[property]) return
  const value =
    property === 'translate'
      ? 'var(--t-x, 0px) var(--t-y, 0px)'
      : 'var(--t-scale-x, 1) var(--t-scale-y, 1)'
  const defaults =
    property === 'translate' ? '--t-x:0px;--t-y:0px' : '--t-scale-x:1;--t-scale-y:1'
  const styleObject = getCSSStyleAtomic(property, value, '', undefined, undefined, true)!
  const identifier = styleObject[StyleObjectIdentifier]
  styleObject[StyleObjectRules].unshift(`:where(.${identifier}){${defaults}}`)
  if (shouldInsertStyleRules(identifier)) {
    updateRules(identifier, styleObject[StyleObjectRules])
    state.flatRulesToInsert![identifier] = styleObject
  }
  state.classNames[property] = identifier
}

function emitTransform(
  state: GetStyleState,
  property: string,
  value: any,
  condition: Condition | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  if (!isWeb || !state.flatShouldDoClasses) {
    if (!isWeb && property === 'scale') {
      emitProperty(state, 'scaleX', value, condition, merge, originalValue, contextOnly)
      emitProperty(state, 'scaleY', value, condition, merge, originalValue, contextOnly)
    } else {
      emitProperty(state, property, value, condition, merge, originalValue, contextOnly)
    }
    return
  }

  const targets =
    property === 'scale'
      ? ['--t-scale-x', '--t-scale-y']
      : [
          property === 'x'
            ? '--t-x'
            : property === 'y'
              ? '--t-y'
              : property === 'scaleX'
                ? '--t-scale-x'
                : property === 'scaleY'
                  ? '--t-scale-y'
                  : 'rotate',
        ]
  for (const target of targets) {
    let targetValue = value
    if (typeof targetValue === 'number') {
      if (target === '--t-x' || target === '--t-y') targetValue = `${targetValue}px`
      else if (target === 'rotate') targetValue = `${targetValue}deg`
    }
    emitProperty(state, target, targetValue, condition, merge, originalValue, contextOnly)
    if (target === '--t-x' || target === '--t-y') addComposition(state, 'translate')
    else if (target.startsWith('--t-scale')) addComposition(state, 'scale')
  }
}

function slotValues(parts: string[], count: number): string[] | null {
  const patterns: Record<number, number[]> =
    count === 4
      ? {
          1: [0, 0, 0, 0],
          2: [0, 1, 0, 1],
          3: [0, 1, 2, 1],
          4: [0, 1, 2, 3],
        }
      : { 1: [0, 0], 2: [0, 1] }
  const pattern = patterns[parts.length]
  return pattern ? pattern.map((index) => parts[index]) : null
}

function emitResolved(
  state: GetStyleState,
  property: string,
  raw: string,
  condition: Condition | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  let value = configuredValue(state, property, raw)
  if (value === raw && /[\s,(]/.test(raw)) {
    value = resolveEmbeddedTokens(state, property, raw)
  }
  if ((!isWeb || !state.flatShouldDoClasses) && typeof value === 'string') {
    if (/^-?(?:\d+\.?\d*|\.\d+)(?:px|dp)$/i.test(value)) {
      value = Number.parseFloat(value)
    } else if (value !== '' && Number.isFinite(Number(value))) {
      value = Number(value)
    }
  }
  emitProperty(state, property, value, condition, merge, originalValue, contextOnly)
}

function emitWebShadow(
  state: DirectState,
  property: string,
  value: any,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  const shadow = (state.flatWebShadow ||= {})
  shadow[property] = value
  const offset = shadow.shadowOffset || { width: 0, height: 0 }
  const color = normalizeColor(shadow.shadowColor, shadow.shadowOpacity ?? 1)
  if (!color) return
  const unit = (part: any) => (typeof part === 'number' ? `${part}px` : part || '0px')
  const next = `${unit(offset.width)} ${unit(offset.height)} ${unit(shadow.shadowRadius)} ${color}`
  emitProperty(
    state,
    'boxShadow',
    state.flatBoxShadow ? `${state.flatBoxShadow}, ${next}` : next,
    null,
    merge,
    originalValue,
    contextOnly
  )
}

function emitWebTextShadow(
  state: DirectState,
  property: string,
  value: any,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  const shadow = (state.flatTextShadow ||= {})
  shadow[property] = value
  const offset = shadow.textShadowOffset || { width: 0, height: 0 }
  if (!shadow.textShadowColor) return
  const unit = (part: any) => (typeof part === 'number' ? `${part}px` : part || '0px')
  emitProperty(
    state,
    'textShadow',
    `${unit(offset.width)} ${unit(offset.height)} ${unit(shadow.textShadowRadius)} ${shadow.textShadowColor}`,
    null,
    merge,
    originalValue,
    contextOnly
  )
}

function emitValue(
  state: GetStyleState,
  property: string,
  raw: any,
  condition: Condition | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  if (typeof raw === 'string') raw = raw.trim()

  if (isVariable(raw)) {
    raw = resolveVariableValue(
      property,
      raw,
      isWeb && !state.flatShouldDoClasses && state.styleProps.resolveValues === 'auto'
        ? 'value'
        : state.styleProps.resolveValues
    )
  }

  emitBorderStyleDefault(state, property, condition)

  if (
    typeof raw === 'string' &&
    (property === 'transition' || property === 'transitionProperty')
  ) {
    raw = normalizeTransitionNames(state, raw)
  }

  if (legacyTransformParts.has(property)) {
    if (isWeb && state.flatShouldDoClasses && state.classNames.transform) {
      if (process.env.NODE_ENV === 'development') {
        warnOnce(
          `legacy transform part "${property}" is dropped because "transform" owns the property`
        )
      }
      return
    }
    const value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
    if (isWeb && state.flatShouldDoClasses && !condition) {
      const direct = state as DirectState
      ;(direct.flatLegacyTransforms ||= {})[property] = value
      emitProperty(
        state,
        'transform',
        transformsToString(
          Object.keys(direct.flatLegacyTransforms)
            .sort()
            .map((key) => ({ [key]: direct.flatLegacyTransforms![key] }))
        ),
        null,
        merge,
        originalValue,
        contextOnly
      )
    } else if (condition && isWeb && state.flatShouldDoClasses) {
      emitProperty(
        state,
        'transform',
        `${property}(${value})`,
        condition,
        merge,
        originalValue,
        contextOnly
      )
    } else {
      merge(state, property, value, 1, false, originalValue)
    }
    return
  }

  if (isWeb && webShadowParts.has(property)) {
    const value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
    if (state.flatShouldDoClasses) {
      emitWebShadow(
        state as DirectState,
        property,
        value,
        merge,
        originalValue,
        contextOnly
      )
    } else {
      merge(state, property, value, 1, false, originalValue)
    }
    return
  }

  if (isWeb && webTextShadowParts.has(property)) {
    const value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
    if (state.flatShouldDoClasses) {
      emitWebTextShadow(
        state as DirectState,
        property,
        value,
        merge,
        originalValue,
        contextOnly
      )
    } else {
      merge(state, property, value, 1, false, originalValue)
    }
    return
  }

  if (isWeb && state.flatShouldDoClasses) {
    if (property === 'transform') {
      const direct = state as DirectState
      if (process.env.NODE_ENV === 'development' && direct.flatLegacyTransforms) {
        for (const part in direct.flatLegacyTransforms) {
          warnOnce(
            `legacy transform part "${part}" is dropped because "transform" owns the property`
          )
        }
      }
      direct.flatLegacyTransforms = undefined
      if (state.flatTransforms) {
        if (process.env.NODE_ENV === 'development') {
          for (const part in state.flatTransforms) {
            warnOnce(
              `legacy transform part "${part}" is dropped because "transform" owns the property`
            )
          }
        }
        state.flatTransforms = undefined
      }
    }
  }

  if (
    isWeb &&
    state.flatShouldDoClasses &&
    property === 'transform' &&
    Array.isArray(raw)
  ) {
    raw = transformsToString(raw)
  }

  if (typeof raw === 'string' && property in borderTargets) {
    emitBorder(state, property, raw, condition, merge, originalValue, contextOnly)
    return
  }
  if (typeof raw === 'string' && property === 'textDecoration') {
    emitTextDecoration(state, raw, condition, merge, originalValue, contextOnly)
    return
  }
  if (typeof raw === 'string' && property === 'background') {
    const parts = splitComponents(raw)
    if (parts.length === 1 && !/^(?:url|image-set|.*gradient)\(/i.test(parts[0])) {
      emitResolved(
        state,
        'backgroundColor',
        parts[0],
        condition,
        merge,
        originalValue,
        contextOnly
      )
      return
    }
  }

  if (
    property === 'x' ||
    property === 'y' ||
    property === 'scale' ||
    property === 'scaleX' ||
    property === 'scaleY' ||
    property === 'rotate'
  ) {
    let value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
    if (!isWeb && typeof value === 'string') {
      if (property === 'rotate' && !/^-?(?:\d+\.?\d*|\.\d+)(?:deg|rad)$/i.test(value)) {
        if (process.env.NODE_ENV === 'development') {
          warnOnce(
            `native transform "${property}" cannot represent "${value}"; dropping it`
          )
        }
        if (condition?.active && state.flatTransforms) {
          delete state.flatTransforms[property]
        }
        return
      }
      if (/^-?(?:\d+\.?\d*|\.\d+)(?:px|dp)$/i.test(value)) {
        value = Number.parseFloat(value)
      } else if (Number.isFinite(Number(value))) {
        value = Number(value)
      }
    }
    emitTransform(state, property, value, condition, merge, originalValue, contextOnly)
    return
  }

  if (isWeb && !state.flatShouldDoClasses && !condition && property === 'borderRadius') {
    emitProperty(state, property, raw, condition, merge, originalValue, contextOnly)
    return
  }

  if (
    process.env.TAMAGUI_TARGET === 'native' &&
    property === 'transform' &&
    typeof raw === 'string'
  ) {
    const transform = parseNativeTransform(raw)
    if (transform) {
      emitProperty(
        state,
        property,
        transform,
        condition,
        merge,
        originalValue,
        contextOnly
      )
      return
    }
  }

  let value: any = raw
  if (typeof raw === 'string') {
    value = configuredValue(state, property, raw)
    if (value === raw && /[\s,(]/.test(raw)) {
      value = resolveEmbeddedTokens(state, property, raw)
    }
  }

  if ((!isWeb || !state.flatShouldDoClasses) && typeof value === 'string') {
    if (/^-?(?:\d+\.?\d*|\.\d+)(?:px|dp)$/i.test(value)) {
      value = Number.parseFloat(value)
    } else if (value !== '' && Number.isFinite(Number(value))) {
      value = Number(value)
    }
  }
  if (isWeb && state.flatShouldDoClasses && property === 'boxShadow' && !condition) {
    ;(state as DirectState).flatBoxShadow = value
  }

  if (
    process.env.TAMAGUI_TARGET === 'native' &&
    typeof value === 'string' &&
    (property === 'backgroundImage' ||
      property === 'boxShadow' ||
      property === 'textShadow')
  ) {
    const parsed = parseNativeStyle(property, value)
    if (parsed) {
      if (property === 'textShadow') {
        for (const [key, parsedValue] of parsed) {
          emitProperty(
            state,
            key,
            parsedValue,
            condition,
            merge,
            originalValue,
            contextOnly
          )
        }
      } else {
        emitProperty(
          state,
          property === 'backgroundImage' ? 'experimental_backgroundImage' : property,
          parsed,
          condition,
          merge,
          originalValue,
          contextOnly
        )
      }
      return
    }
  }

  if (!isWeb && property === 'fontVariant' && typeof value === 'string') {
    value = value.split(/[,\s]+/).filter(Boolean)
  }

  const expanded = state.styleProps.noExpand
    ? null
    : expandStyle(property, value, state.conf.settings.styleCompat || 'web')
  if (!expanded) {
    emitProperty(state, property, value, condition, merge, originalValue, contextOnly)
    return
  }

  if (typeof raw === 'string' && expanded.length > 1) {
    const parts = splitComponents(raw)
    const slots = slotValues(parts, expanded.length)
    if (slots) {
      for (let index = 0; index < expanded.length; index++) {
        emitResolved(
          state,
          expanded[index][0],
          slots[index],
          condition,
          merge,
          originalValue,
          contextOnly
        )
      }
      return
    }
  }
  for (let index = 0; index < expanded.length; index++) {
    emitProperty(
      state,
      expanded[index][0],
      expanded[index][1],
      condition,
      merge,
      originalValue,
      contextOnly
    )
  }
}

function emitSegment(
  state: GetStyleState,
  property: string,
  source: string,
  start: number,
  end: number,
  condition: Condition | null,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  while (start < end && source.charCodeAt(start) <= 32) start++
  while (end > start && source.charCodeAt(end - 1) <= 32) end--
  if (start === end) return false
  if (
    !condition ||
    (condition.emit &&
      (condition.active ||
        (isWeb && state.flatShouldDoClasses) ||
        (!isWeb &&
          condition.theme &&
          supportsDynamicColorIOS &&
          isColorStyleKey(property))))
  ) {
    const value = source.slice(start, end)
    emitValue(state, property, value, condition, merge, value, contextOnly)
  }
  return true
}

export function contributeStyleString(
  state: GetStyleState,
  property: string,
  source: string,
  merge: MergeStyle,
  originalValue?: any,
  contextOnly = false
) {
  if (
    isWeb &&
    source.indexOf(':') !== -1 &&
    (webShadowParts.has(property) || legacyTransformParts.has(property))
  ) {
    if (process.env.NODE_ENV === 'development') {
      warnOnce(`conditional "${property}" needs its composite property; dropping it`)
    }
    return true
  }
  if (source.indexOf(':') === -1) {
    emitValue(state, property, source, null, merge, originalValue ?? source, contextOnly)
    return true
  }

  let quote = 0
  let depth = 0
  let wordStart = -1
  let lastColon = -1
  let segmentStart = 0
  let condition: Condition | null = null
  let hasBase = false
  let lifecycle = false

  const boundary = (wordEnd: number) => {
    if (wordStart === -1 || lastColon === -1) return true
    const next = getCondition(state, source.slice(wordStart, lastColon))
    if (!next) return false
    if (process.env.NODE_ENV === 'development' && next.unsupportedState) {
      warnOnce(
        `${property}: "${next.unsupportedState}:" has no native component-state source; dropping the clause`
      )
    }
    const emitted = emitSegment(
      state,
      property,
      source,
      segmentStart,
      wordStart,
      condition,
      merge,
      originalValue,
      contextOnly
    )
    if (!condition && emitted) hasBase = true
    condition = next
    lifecycle ||= !!(next.enter || next.exit)
    segmentStart = lastColon + 1
    wordStart = wordEnd
    lastColon = -1
    return true
  }

  for (let index = 0; index < source.length; index++) {
    const code = source.charCodeAt(index)
    if (quote) {
      if (code === 92) index++
      else if (code === quote) quote = 0
      continue
    }
    if (code === 34 || code === 39) {
      quote = code
      continue
    }
    if (code === 40) {
      depth++
      continue
    }
    if (code === 41) {
      depth--
      continue
    }
    if (depth) continue
    if (code === 59 || code === 123 || code === 125) return true
    if (code <= 32) {
      if (!boundary(-1)) {
        if (property === 'aspectRatio') {
          emitValue(
            state,
            property,
            source,
            null,
            merge,
            originalValue ?? source,
            contextOnly
          )
          return true
        }
        if (process.env.NODE_ENV === 'development') {
          throw new Error(
            `[tamagui] ${property}="${source}" does not parse: unknown modifier`
          )
        }
        return true
      }
      wordStart = -1
      lastColon = -1
    } else {
      if (wordStart === -1) wordStart = index
      if (code === 58) lastColon = index
    }
  }

  if (!boundary(-1)) {
    if (property === 'aspectRatio') {
      emitValue(
        state,
        property,
        source,
        null,
        merge,
        originalValue ?? source,
        contextOnly
      )
      return true
    }
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        `[tamagui] ${property}="${source}" does not parse: unknown modifier`
      )
    }
    return true
  }
  const emitted = emitSegment(
    state,
    property,
    source,
    segmentStart,
    source.length,
    condition,
    merge,
    originalValue,
    contextOnly
  )
  if (!condition && emitted) hasBase = true

  if (
    process.env.NODE_ENV === 'development' &&
    !hasBase &&
    condition &&
    (property in tokenCategories.color || property in tokenCategoryByProperty) &&
    splitComponents(source.slice(segmentStart)).length > 1
  ) {
    warnOnce(
      `${property}="${source}" has multiple values after its first conditional. Write the base value before the first conditional.`
    )
  }

  if (!isWeb && lifecycle && !hasBase) {
    const value =
      property === 'opacity'
        ? 1
        : property === 'scale' || property === 'scaleX' || property === 'scaleY'
          ? 1
          : property === 'rotate'
            ? '0deg'
            : property === 'x' || property === 'y'
              ? 0
              : null
    if (value !== null) {
      emitValue(state, property, value, null, merge, value, contextOnly)
    }
  }
  return true
}

export function contributeFrontendValue(
  state: GetStyleState,
  property: string,
  value: ParsedValue,
  merge: MergeStyle,
  contextOnly = false
) {
  if (value.base !== null) {
    emitValue(state, property, value.base, null, merge, value.base, contextOnly)
  }
  for (const clause of value.clauses) {
    const condition = getCondition(state, clause.modifiers.join(':'))
    if (
      condition &&
      condition.emit &&
      (condition.active || (isWeb && state.flatShouldDoClasses))
    ) {
      emitValue(
        state,
        property,
        clause.payload,
        condition,
        merge,
        clause.payload,
        contextOnly
      )
    }
  }
  return true
}

export function contributeStyleValue(
  state: GetStyleState,
  property: string,
  value: any,
  merge: MergeStyle,
  originalValue?: any,
  contextOnly = false
) {
  if (value === 'safe' && isSafeAreaKey(property)) {
    const expanded = expandSafeAreaValue(property)
    if (expanded) {
      state.flatUsesSafeArea = true
      for (const [key, resolved] of expanded) {
        emitValue(state, key, resolved, null, merge, originalValue ?? value, contextOnly)
      }
      return true
    }
  }
  if (typeof value === 'string') {
    return contributeStyleString(
      state,
      property,
      value,
      merge,
      originalValue,
      contextOnly
    )
  }
  if (value != null) {
    emitValue(state, property, value, null, merge, originalValue ?? value, contextOnly)
    return true
  }
  return false
}

export function clearDirectStyle(state: GetStyleState, property: string) {
  const direct = state as DirectState
  const atomicKey = property.startsWith('transition')
    ? 'transition'
    : webShadowParts.has(property)
      ? 'boxShadow'
      : webTextShadowParts.has(property)
        ? 'textShadow'
        : legacyTransformParts.has(property)
          ? 'transform'
          : property
  if (direct.flatAtomics) delete direct.flatAtomics[atomicKey]
  delete state.classNames[atomicKey]
}

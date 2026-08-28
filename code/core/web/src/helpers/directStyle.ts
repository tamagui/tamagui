import { isWeb, platformMatches, supportsDynamicColorIOS } from '@tamagui/constants'
import { nonAnimatableStyleProps, tokenCategories } from '@tamagui/helpers'
import {
  canonicalStateModifierNames,
  isContainerSizeQueryText,
  isModifierName,
  modifierKindMedia,
  modifierKindPlatform,
  modifierKindState,
  modifierKindTheme,
  scanFlatValue,
  stateModifierSelectors,
  addTransformValue,
  createTransformAccumulator,
  getTransformPartKeys,
  removeTransformValue,
  type ClausePrecedenceKey,
  type FlatValueHandler,
  type ParsedValue,
} from '@tamagui/style-grammar/runtime'

import { isVariable } from '../createVariable'
import { mediaKeyMatch } from '../hooks/useMedia'
import type { GetStyleState } from '../types'
import {
  addComposition,
  canGenerateCSS,
  clearDirectAtomic,
  directAtomic,
  emitBorderStyleDefault,
} from './directStyleCSS'
import { warnOnce, warnRefusedValue } from './warnOnce'
import { expandStyle } from './expandStyle'
import { getConfigRevisionState } from './grammarConfig'
import { isColorStyleKey } from './getDynamicVal'
import { normalizeColor } from './normalizeColor'
import { parseNativeStyle } from './parseNativeStyle.native'
import { parseNativeTransform } from './parseNativeTransform.native'
import { getTokenCategoryForProperty, tokenCategoryByProperty } from './tokenCategories'
import { resolveSafeAreaVariable } from './resolveSafeAreaVariable'
import { expandSafeAreaValue, isSafeAreaKey } from './resolveSafeArea'
import { resolveVariableValue } from './resolveVariableValue'
import { THEME_REF_PREFIX } from './themeRef'
import { transformsToString } from './transformsToString'

export { directStyleSignature, flushDirectStyles } from './directStyleCSS'

export type MergeStyle = (
  state: GetStyleState,
  key: string,
  value: any,
  importance: number,
  disableNormalize?: boolean,
  originalValue?: any
) => void

type DirectState = GetStyleState & {
  flatBoxShadow?: any
  flatDynamicColors?: Record<string, Record<string, any>>
  flatDynamicThemeAccess?: boolean
  flatPrecedence?: Record<string, ClausePrecedenceKey>
  flatTextShadow?: Record<string, any>
  flatWebShadow?: Record<string, any>
}

const directStyleHandler: FlatValueHandler<GetStyleState> = {
  segment(
    state,
    start,
    end,
    isBase,
    valid,
    source,
    chainStart,
    chainEnd,
    chainValid,
    chainCount,
    _result,
    failure,
    failureIndex,
    property,
    merge,
    originalValue,
    contextOnly
  ) {
    if (isBase) {
      if (start === end) return
      if (!valid) {
        if (process.env.NODE_ENV === 'development') {
          warnRefusedValue(
            property,
            source,
            failure === 'invalid-character'
              ? `"${source[failureIndex]}" would end the declaration or rule`
              : failure === 'unterminated-string'
                ? 'an unterminated string'
                : failure === 'unterminated-comment'
                  ? 'an unterminated "/*" comment'
                  : failure === 'stray-comment-close'
                    ? 'a stray "*/"'
                    : 'an unterminated "("'
          )
        }
        return
      }
      const value = source.slice(start, end)
      emitValue(
        state,
        property,
        value,
        0,
        '',
        undefined,
        '',
        '',
        merge,
        value,
        contextOnly
      )
      return 5
    }
    if (!chainValid) {
      if (process.env.NODE_ENV === 'development') {
        warnRefusedValue(
          property,
          source,
          failure === 'invalid-character'
            ? `"${source[failureIndex]}" would end the declaration or rule`
            : failure === 'unterminated-string'
              ? 'an unterminated string'
              : failure === 'unterminated-comment'
                ? 'an unterminated "/*" comment'
                : failure === 'stray-comment-close'
                  ? 'a stray "*/"'
                  : 'an unterminated "("'
        )
      }
      return
    }
    if (start === end) {
      if (process.env.NODE_ENV === 'development') {
        warnRefusedValue(property, source, 'a conditional clause has no value')
      }
      return
    }
    if (property === 'aspectRatio' && chainCount === 1) {
      const left = Number(source.slice(chainStart, chainEnd))
      const right = Number(source.slice(start, end))
      if (
        chainStart < chainEnd &&
        Number.isFinite(left) &&
        left > 0 &&
        Number.isFinite(right) &&
        right > 0
      ) {
        return 12
      }
    }
    const condition = resolveClauseChain(
      state,
      source,
      chainStart,
      chainEnd,
      property,
      undefined,
      valid ? merge : undefined,
      undefined,
      contextOnly,
      start,
      end,
      1
    )
    if (!condition) return
    if (!valid) {
      if (process.env.NODE_ENV === 'development') {
        warnRefusedValue(
          property,
          source,
          failure === 'invalid-character'
            ? `"${source[failureIndex]}" would end the declaration or rule`
            : failure === 'unterminated-string'
              ? 'an unterminated string'
              : failure === 'unterminated-comment'
                ? 'an unterminated "/*" comment'
                : failure === 'stray-comment-close'
                  ? 'a stray "*/"'
                  : 'an unterminated "("'
        )
      }
      return
    }
    return 4 | (condition & 12 ? 2 : 0)
  },
  chain() {
    return true
  },
  end(
    state,
    source,
    result,
    lastPayloadStart,
    chainCount,
    property,
    merge,
    originalValue,
    contextOnly
  ) {
    let hasBase = !!(result & 1)
    if (result & 8 && chainCount === 1) {
      emitValue(
        state,
        property,
        source,
        0,
        '',
        undefined,
        '',
        '',
        merge,
        originalValue ?? source,
        contextOnly
      )
      hasBase = true
    }
    if (
      process.env.NODE_ENV === 'development' &&
      !hasBase &&
      result & 4 &&
      (property in tokenCategories.color || property in tokenCategoryByProperty) &&
      splitComponents(source.slice(lastPayloadStart)).length > 1
    ) {
      warnOnce(
        `${property}="${source}" has multiple values after its first conditional. Write the base value before the first conditional.`
      )
    }
    if ((!canGenerateCSS || !state.flatShouldDoClasses) && result & 2 && !hasBase) {
      const value = implicitLifecycleBase(property)
      if (value !== null) {
        emitValue(
          state,
          property,
          value,
          0,
          '',
          undefined,
          '',
          '',
          merge,
          value,
          contextOnly
        )
      }
    }
  },
}

// enter/exit clauses with no authored base animate from the property's natural
// resting value on the inline-style path (the class path reads it from the
// cascade instead)
function implicitLifecycleBase(property: string): string | number | null {
  return property === 'opacity' ||
    property === 'scale' ||
    property === 'scaleX' ||
    property === 'scaleY'
    ? 1
    : property === 'rotate'
      ? '0deg'
      : property === 'x' || property === 'y'
        ? 0
        : null
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

export function resolveClauseChain(
  state: GetStyleState,
  source: string,
  start: number,
  end: number,
  property?: string,
  raw?: any,
  merge?: MergeStyle,
  originalValue?: any,
  contextOnly = false,
  payloadStart = -1,
  payloadEnd = -1,
  warning = 0
): number {
  const compiled = getConfigRevisionState(state.conf)
  const sourceStart = start
  let key = ''
  let active = true
  let emit = true
  let selector = ''
  let wrappers: string[] | undefined
  let theme = ''
  let enter = false
  let exit = false
  let unsupportedState = ''
  let platformRank = 0
  let depth = 0
  let categoryRank = 0
  let withinRank = 0
  let selfStateSpecificity = 0
  for (let index = start; index <= end; index++) {
    if (index !== end && source.charCodeAt(index) !== 58) continue
    let modifier = source.slice(start, index)
    start = index + 1
    let code = compiled.modifiers[modifier]
    let kind = code & 7
    let rank = code >> 3
    let stateSelector = ''
    let conditionStateName = ''
    let groupName = ''
    let containerSize = ''
    let containerName = ''
    let containerQuery = ''
    if (kind === modifierKindState) {
      modifier = canonicalStateModifierNames[rank]
      stateSelector = stateModifierSelectors[rank]
    } else if (!kind && modifier.startsWith('group-')) {
      const slash = modifier.indexOf('/')
      const authoredState = modifier.slice(6, slash === -1 ? undefined : slash)
      code = compiled.modifiers[authoredState]
      if ((code & 7) !== modifierKindState) kind = 0
      else {
        rank = code >> 3
        groupName = slash === -1 ? 'true' : modifier.slice(slash + 1)
        if (
          rank === 6 ||
          rank === 7 ||
          (slash !== -1 && !isModifierName(groupName, 0, groupName.length))
        ) {
          kind = 0
        } else {
          kind = 5
          const stateName = canonicalStateModifierNames[rank]
          conditionStateName = stateName
          stateSelector = stateModifierSelectors[rank]
          modifier = `group-${stateName}${slash === -1 ? '' : modifier.slice(slash)}`
        }
      }
    } else if (!kind && modifier.charCodeAt(0) === 64) {
      const slash = modifier.indexOf('/')
      containerSize = modifier.slice(1, slash === -1 ? undefined : slash)
      containerName = slash === -1 ? '' : modifier.slice(slash + 1)
      if (
        isModifierName(containerSize, 0, containerSize.length) &&
        (slash === -1 || isModifierName(containerName, 0, containerName.length)) &&
        ((code = compiled.modifiers[containerSize]) & 7) === modifierKindMedia &&
        (containerQuery = compiled.mediaQueries[containerSize]) &&
        isContainerSizeQueryText(containerQuery)
      ) {
        kind = 6
        rank = code >> 3
      }
    }
    if (!kind) {
      if (warning && process.env.NODE_ENV === 'development') {
        warnRefusedValue(
          property!,
          warning === 1 ? source : raw,
          `unknown modifier "${source.slice(sourceStart, end)}"`
        )
      }
      return 0
    }

    let slotStart = 0
    let duplicate = false
    let inserted = !key
    if (!key) key = modifier
    else {
      while (slotStart <= key.length) {
        let slotEnd = key.indexOf(':', slotStart)
        if (slotEnd === -1) slotEnd = key.length
        let order = 0
        const compareLength = Math.min(modifier.length, slotEnd - slotStart)
        for (let offset = 0; offset < compareLength; offset++) {
          order = modifier.charCodeAt(offset) - key.charCodeAt(slotStart + offset)
          if (order) break
        }
        order ||= modifier.length - (slotEnd - slotStart)
        if (!order) {
          duplicate = true
          break
        }
        if (order < 0) {
          key = `${key.slice(0, slotStart)}${modifier}:${key.slice(slotStart)}`
          inserted = true
          break
        }
        if (slotEnd === key.length) break
        slotStart = slotEnd + 1
      }
      if (!duplicate && !inserted) key += `:${modifier}`
    }
    if (duplicate) continue

    if (kind === modifierKindPlatform) {
      if (rank > platformRank) platformRank = rank
      const matches = platformMatches(modifier)
      active &&= matches
      emit &&= matches
      continue
    }
    depth++
    const nextCategory =
      kind === modifierKindMedia
        ? 0
        : kind === 6
          ? 1
          : kind === modifierKindTheme
            ? 2
            : kind === 5
              ? 3
              : 4
    if (nextCategory > categoryRank) {
      categoryRank = nextCategory
      withinRank = rank
    } else if (nextCategory === categoryRank && rank > withinRank) {
      withinRank = rank
    }

    if (kind === modifierKindMedia) {
      const query = compiled.mediaQueries[modifier]
      if (!query) return 0
      ;(wrappers ||= []).push(`@media ${query}`)
      active &&= !!state.flatMediaState?.[modifier]
      ;(state.flatMediaKeys ||= new Set()).add(modifier)
    } else if (kind === modifierKindTheme) {
      theme = modifier
      selector += `:where(.t_${modifier}, .t_${modifier} *)`
      active &&=
        state.flatThemeName === modifier ||
        state.flatThemeName?.startsWith(`${modifier}_`) === true
    } else if (kind === 5) {
      selector += `:where(.t_group_${groupName}${stateSelector} *)`
      if (rank === 0) (wrappers ||= []).push('@media (hover: hover)')
      const component = state.componentState.group?.[groupName]
      const context = state.flatGroupContext?.[groupName]
      active &&= !!(component?.pseudo ?? context?.state.pseudo)?.[conditionStateName]
      ;(state.flatGroupKeys ||= new Set()).add(groupName)
    } else if (kind === 6) {
      const groupKey = `@${containerName}`
      ;(wrappers ||= []).push(
        containerName
          ? `@container ${containerName} ${containerQuery}`
          : `@container ${containerQuery}`
      )
      const component = state.componentState.group?.[groupKey]
      const context = state.flatGroupContext?.[groupKey]
      if (
        process.env.NODE_ENV === 'development' &&
        containerName &&
        !component &&
        !context &&
        state.flatGroupContext?.[containerName]
      ) {
        warnOnce(
          `group-container:${containerName}`,
          `@${containerSize}/${containerName}: targets group="${containerName}", but groups no longer establish query containers. Add container="${containerName}" to that group.`
        )
      }
      const match = component?.media?.[containerSize]
      active &&=
        match === undefined
          ? !!(
              context?.state.layout && mediaKeyMatch(containerSize, context.state.layout)
            )
          : !!match
      ;(state.flatGroupKeys ||= new Set()).add(groupKey)
      ;(state.flatGroupMedia ||= new Set()).add(containerSize)
    } else {
      selfStateSpecificity++
      if (!isWeb && stateSelector[0] === '[' && modifier !== 'disabled') {
        unsupportedState = modifier
      }
      if (stateSelector[0] === '.') {
        selector += `:is(${stateSelector}, ${stateSelector} *)`
        if (rank === 6) enter = true
        else exit = true
      } else {
        selector += stateSelector
      }
      if (rank === 0) (wrappers ||= []).push('@media (hover: hover)')
      const component = state.componentState
      active &&=
        rank === 0
          ? !!component.hover
          : rank === 4
            ? !!(component.press || component.pressIn)
            : rank === 2
              ? !!component.focus
              : rank === 3
                ? !!component.focusVisible
                : rank === 1
                  ? !!component.focusWithin
                  : rank === 5
                    ? !!(component.disabled || state.props.disabled)
                    : rank === 6
                      ? !!component.unmounted
                      : rank === 7
                        ? !!state.styleProps.isExiting
                        : false
      if (stateSelector[0] === ':') {
        ;(state.flatStateKeys ||= new Set()).add(modifier)
      }
    }
  }
  if (depth > 5) {
    throw new Error(
      `a flat value clause supports at most 5 non-platform conditions; received ${depth} in "${source.slice(sourceStart, end)}:"`
    )
  }
  const precedence =
    (platformRank << 26) | (depth << 23) | (categoryRank << 20) | withinRank
  const condition =
    precedence * 256 +
    selfStateSpecificity * 32 +
    16 +
    (active ? 1 : 0) +
    (emit ? 2 : 0) +
    (enter ? 4 : 0) +
    (exit ? 8 : 0)
  if (warning && unsupportedState && process.env.NODE_ENV === 'development') {
    warnOnce(
      `${property}: "${unsupportedState}:" has no native component-state source; dropping the clause`
    )
  }
  if (
    merge &&
    property &&
    condition & 2 &&
    (condition & 1 ||
      (canGenerateCSS && state.flatShouldDoClasses) ||
      (warning === 1 &&
        !isWeb &&
        theme &&
        supportsDynamicColorIOS &&
        isColorStyleKey(property)))
  ) {
    const value = payloadStart === -1 ? raw : source.slice(payloadStart, payloadEnd)
    emitValue(
      state,
      property,
      value,
      condition,
      key,
      wrappers,
      selector,
      theme,
      merge,
      warning === 2 ? originalValue : (originalValue ?? value),
      contextOnly
    )
  }
  return condition
}

interface TokenLookup {
  value: any
  /** The value resolved through the active theme, so it changes when the theme does. */
  fromTheme: boolean
  /** The normalized key the runtime theme object is indexed by. */
  themeKey: string
}

// single reused result object: tokenVariable runs on the style hot path and its
// one caller consumes the result before any re-entry, so this avoids allocating
// per token lookup
const tokenLookup: TokenLookup = { value: undefined, fromTheme: false, themeKey: '' }

function fillTokenLookup(value: any, fromTheme: boolean, themeKey: string): TokenLookup {
  tokenLookup.value = value
  tokenLookup.fromTheme = fromTheme
  tokenLookup.themeKey = themeKey
  return tokenLookup
}

function tokenVariable(
  state: GetStyleState,
  property: string,
  name: string
): TokenLookup | undefined {
  // v3's canonical token representation is unprefixed, but classic `$token`
  // values are still valid input: normalize here so `$background` and
  // `background` resolve identically (themes, tokens, and fonts are all
  // keyed unprefixed)
  let lookupName = name.charCodeAt(0) === 36 ? name.slice(1) : name
  if (property === 'fontFamily') {
    const family = state.conf.fontsParsed[lookupName]?.family
    return family ? fillTokenLookup(family, false, lookupName) : undefined
  }
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
    const value = font?.[fontKey]?.[lookupName]
    return value ? fillTokenLookup(value, false, lookupName) : undefined
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
    if (own) return fillTokenLookup(own, false, lookupName)
    for (const sibling of ['color', 'space', 'size', 'radius', 'zIndex'] as const) {
      if (sibling !== category && state.conf.tokensParsed[sibling]?.[lookupName]) return
    }
  } else {
    const first = lookupName.charCodeAt(0)
    if ((first >= 48 && first <= 57) || first === 43 || first === 45 || first === 46) {
      return
    }
  }
  const theme =
    state.theme?.[lookupName] ||
    state.conf.themes?.[state.flatThemeName || '']?.[lookupName]
  if (theme) return fillTokenLookup(theme, true, lookupName)
  if (category) return
  const token =
    state.conf.tokensParsed.space?.[lookupName] ||
    state.conf.tokensParsed.color?.[lookupName]
  return token ? fillTokenLookup(token, false, lookupName) : undefined
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

  const lookup = tokenVariable(state, property, name)
  if (!lookup || !isVariable(lookup.value)) {
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
  // the static compiler resolves tokens but keeps theme-backed values symbolic
  // so compiled output can read them through the live theme instead of freezing
  // the build machine's first theme. an opacity modifier stays in the sentinel,
  // which the compiler cannot represent and treats as a runtime-path bailout.
  if (resolveValues === 'except-theme' && lookup.fromTheme) {
    return `${THEME_REF_PREFIX}${lookup.themeKey}${opacity !== undefined ? `/${opacity}` : ''}`
  }
  let value = resolveVariableValue(property, lookup.value, resolveValues)
  if (opacity !== undefined) {
    value = isWeb
      ? `color-mix(in srgb, ${value} ${opacity}%, transparent)`
      : normalizeColor(value, opacity / 100)
  }
  return value
}

// a single function-call literal whose arguments contain no letters
// (rgb(99,102,241), hsl(0,100%,50%)) cannot hold token words; color literals
// like these are common enough on hot paths to be worth skipping the word scan
const letterFreeCallPattern = /^[A-Za-z-]+\([^A-Za-z]*\)$/

function resolveEmbeddedTokens(state: GetStyleState, property: string, raw: string) {
  if (letterFreeCallPattern.test(raw)) return raw
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

export function getDirectDynamicThemeAccess(state: GetStyleState) {
  return (state as DirectState).flatDynamicThemeAccess
}

function emitProperty(
  state: GetStyleState,
  property: string,
  value: any,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  const direct = state as DirectState
  if (condition & 4) (state.flatEnterKeys ||= new Set()).add(property)
  if (condition & 8) (state.flatExitKeys ||= new Set()).add(property)

  if (!isWeb && conditionTheme) {
    if (supportsDynamicColorIOS && isColorStyleKey(property)) {
      const schemes = ((direct.flatDynamicColors ||= {})[property] ||= {})
      schemes[conditionTheme] =
        typeof originalValue === 'string' && /^[a-z]+$/i.test(originalValue)
          ? originalValue
          : value
      merge(state, property, { dynamic: { ...schemes } }, 1, false, originalValue)
      return
    }
    direct.flatDynamicThemeAccess = true
  }

  if (contextOnly) {
    if (!condition || condition & 1) {
      ;(state.overriddenContextProps ||= {})[property] = originalValue
    }
    return
  }

  if (
    canGenerateCSS &&
    state.flatShouldDoClasses &&
    !condition &&
    property === 'transform'
  ) {
    if (process.env.NODE_ENV === 'development' && state.transformAccumulator) {
      for (const part of getTransformPartKeys(state.transformAccumulator)) {
        warnOnce(
          `legacy transform part "${part}" is dropped because "transform" owns the property`
        )
      }
    }
    state.transformAccumulator ||= createTransformAccumulator()
    addTransformValue(state.transformAccumulator, property, value)
    return
  }

  const shouldPromoteAnimatedStyle =
    canGenerateCSS &&
    !condition &&
    !state.flatShouldDoClasses &&
    !state.styleProps.noMergeStyle &&
    state.styleProps.isAnimated &&
    !state.animationDriver?.isReactNative &&
    property in nonAnimatableStyleProps

  if (canGenerateCSS && (state.flatShouldDoClasses || shouldPromoteAnimatedStyle)) {
    if (!condition) {
      if (state.style) delete state.style[property]
    }
    directAtomic(
      state as DirectState,
      property,
      value,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector
    )
    return
  }

  if (condition) {
    if (!(condition & 1)) return
    const precedence = Math.floor(condition / 256)
    const previous = direct.flatPrecedence?.[property]
    if (previous !== undefined && precedence < previous) return
    ;(direct.flatPrecedence ||= {})[property] = precedence
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
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
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
      emitResolved(
        state,
        target,
        width,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
    }
  }
  if (style !== undefined) {
    const styleTargets = !isWeb && property === 'border' ? ['borderStyle'] : targets.style
    for (const target of styleTargets) {
      emitProperty(
        state,
        target,
        style,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
    }
  }
  if (color !== undefined) {
    for (const target of targets.color) {
      emitResolved(
        state,
        target,
        color,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
    }
  }
}

function emitTextDecoration(
  state: GetStyleState,
  raw: string,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
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
    emitResolved(
      state,
      property,
      part,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
  }
}

function emitTransform(
  state: GetStyleState,
  property: string,
  value: any,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  if (!canGenerateCSS || !state.flatShouldDoClasses) {
    emitProperty(
      state,
      property,
      value,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
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
    emitProperty(
      state,
      target,
      targetValue,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
    if (target === '--t-x' || target === '--t-y') addComposition(state, 'translate')
    else if (target.startsWith('--t-scale')) addComposition(state, 'scale')
  }
}

function emitResolved(
  state: GetStyleState,
  property: string,
  raw: string,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
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
  emitProperty(
    state,
    property,
    value,
    condition,
    conditionKey,
    conditionWrappers,
    conditionSelector,
    conditionTheme,
    merge,
    originalValue,
    contextOnly
  )
}

function shadowUnit(part: any) {
  return typeof part === 'number' ? `${part}px` : part || '0px'
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
  const next = `${shadowUnit(offset.width)} ${shadowUnit(offset.height)} ${shadowUnit(shadow.shadowRadius)} ${color}`
  emitProperty(
    state,
    'boxShadow',
    state.flatBoxShadow ? `${state.flatBoxShadow}, ${next}` : next,
    0,
    '',
    undefined,
    '',
    '',
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
  emitProperty(
    state,
    'textShadow',
    `${shadowUnit(offset.width)} ${shadowUnit(offset.height)} ${shadowUnit(shadow.textShadowRadius)} ${shadow.textShadowColor}`,
    0,
    '',
    undefined,
    '',
    '',
    merge,
    originalValue,
    contextOnly
  )
}

function emitValue(
  state: GetStyleState,
  property: string,
  raw: any,
  condition: number,
  conditionKey: string,
  conditionWrappers: string[] | undefined,
  conditionSelector: string,
  conditionTheme: string,
  merge: MergeStyle,
  originalValue: any,
  contextOnly: boolean
) {
  if (typeof raw === 'string') {
    raw = raw.trim()
  }

  if (isVariable(raw)) {
    raw = resolveVariableValue(
      property,
      raw,
      isWeb && !state.flatShouldDoClasses && state.styleProps.resolveValues === 'auto'
        ? 'value'
        : state.styleProps.resolveValues
    )
  }

  emitBorderStyleDefault(
    state,
    property,
    condition,
    conditionKey,
    conditionWrappers,
    conditionSelector
  )

  if (
    typeof raw === 'string' &&
    (property === 'transition' || property === 'transitionProperty')
  ) {
    raw = normalizeTransitionNames(state, raw)
  }

  if (legacyTransformParts.has(property)) {
    const value = typeof raw === 'string' ? configuredValue(state, property, raw) : raw
    if (canGenerateCSS && state.flatShouldDoClasses && !condition) {
      state.transformAccumulator ||= createTransformAccumulator()
      addTransformValue(state.transformAccumulator, property, value)
    } else if (condition && canGenerateCSS && state.flatShouldDoClasses) {
      emitProperty(
        state,
        'transform',
        `${property}(${value})`,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
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
    if (canGenerateCSS && state.flatShouldDoClasses) {
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
    if (canGenerateCSS && state.flatShouldDoClasses) {
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

  if (
    canGenerateCSS &&
    state.flatShouldDoClasses &&
    property === 'transform' &&
    Array.isArray(raw)
  ) {
    raw = transformsToString(raw)
  }

  if (typeof raw === 'string' && property in borderTargets) {
    emitBorder(
      state,
      property,
      raw,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
    return
  }
  if (typeof raw === 'string' && property === 'textDecoration') {
    emitTextDecoration(
      state,
      raw,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
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
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
      return
    }
    if (!isWeb) {
      if (process.env.NODE_ENV === 'development') {
        warnOnce(`native background cannot represent "${raw}"; dropping it`)
      }
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
    // a transform going into a real style object rather than a CSS class has to
    // carry numbers: that is every native render and every web render an
    // animation driver drives inline. strings survive only on the class path.
    // a theme-ref sentinel is not a number and must pass through untouched.
    if (
      (!isWeb || !state.flatShouldDoClasses) &&
      typeof value === 'string' &&
      !value.startsWith(THEME_REF_PREFIX)
    ) {
      if (property === 'rotate' && !/^-?(?:\d+\.?\d*|\.\d+)(?:deg|rad)$/i.test(value)) {
        if (process.env.NODE_ENV === 'development') {
          warnOnce(
            `native transform "${property}" cannot represent "${value}"; dropping it`
          )
        }
        if (condition & 1) removeTransformValue(state.transformAccumulator, property)
        return
      }
      if (/^-?(?:\d+\.?\d*|\.\d+)(?:px|dp)$/i.test(value)) {
        value = Number.parseFloat(value)
      } else if (Number.isFinite(Number(value))) {
        value = Number(value)
      }
    }
    emitTransform(
      state,
      property,
      value,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
    return
  }

  if (isWeb && !state.flatShouldDoClasses && !condition && property === 'borderRadius') {
    // css reads the shorthand, so skip the four-corner expansion here. a string
    // value still needs its token resolved, which is what emitResolved does.
    if (typeof raw === 'string') {
      emitResolved(
        state,
        property,
        raw,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
    } else {
      emitProperty(
        state,
        property,
        raw,
        condition,
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
        merge,
        originalValue,
        contextOnly
      )
    }
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
        conditionKey,
        conditionWrappers,
        conditionSelector,
        conditionTheme,
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
  if (
    canGenerateCSS &&
    state.flatShouldDoClasses &&
    property === 'boxShadow' &&
    !condition
  ) {
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
            conditionKey,
            conditionWrappers,
            conditionSelector,
            conditionTheme,
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
          conditionKey,
          conditionWrappers,
          conditionSelector,
          conditionTheme,
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
    emitProperty(
      state,
      property,
      value,
      condition,
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
    return
  }

  if (typeof raw === 'string' && expanded.length > 1) {
    const parts = splitComponents(raw)
    if (parts.length > 0 && parts.length <= (expanded.length === 4 ? 4 : 2)) {
      for (let index = 0; index < expanded.length; index++) {
        const partIndex =
          index === 0 || parts.length === 1
            ? 0
            : index === 1 || (index === 3 && parts.length < 4)
              ? 1
              : index === 2 && parts.length < 3
                ? 0
                : index
        emitResolved(
          state,
          expanded[index][0],
          parts[partIndex],
          condition,
          conditionKey,
          conditionWrappers,
          conditionSelector,
          conditionTheme,
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
      conditionKey,
      conditionWrappers,
      conditionSelector,
      conditionTheme,
      merge,
      originalValue,
      contextOnly
    )
  }
}

export function contributeStyleString(
  state: GetStyleState,
  property: string,
  source: string,
  merge: MergeStyle,
  originalValue?: any,
  contextOnly = false
) {
  // no clause to cut, so the scanner below never runs on this value. nothing
  // validates it either: the `carriesTopLevelInjection` guard that used to
  // refuse a rule-breaking value here was dropped by owner decision, so a value
  // with no colon is emitted verbatim by contract. Keep the two paths in mind
  // together when reading a bug report about one of them.
  if (source.indexOf(':') === -1) {
    emitValue(
      state,
      property,
      source,
      0,
      '',
      undefined,
      '',
      '',
      merge,
      originalValue ?? source,
      contextOnly
    )
    return true
  }

  scanFlatValue(
    source,
    directStyleHandler,
    state,
    property,
    merge,
    originalValue,
    contextOnly
  )
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
    emitValue(
      state,
      property,
      value.base,
      0,
      '',
      undefined,
      '',
      '',
      merge,
      value.base,
      contextOnly
    )
  }
  for (const clause of value.clauses) {
    const source = clause.modifiers.join(':')
    resolveClauseChain(
      state,
      source,
      0,
      source.length,
      property,
      clause.payload,
      merge,
      clause.payload,
      contextOnly
    )
  }
  return true
}

// a flat conditional object either names a `default` or opens with a
// resolvable modifier chain; anything else is a structured leaf value
// (shadowOffset) and stays whole. only the first key is probed, the same way
// the string scanner commits at its first clause
export function isConditionalStyleObject(
  state: GetStyleState,
  value: Record<string, any>,
  property?: string,
  merge?: MergeStyle,
  contextOnly = false
): number {
  if (Object.prototype.hasOwnProperty.call(value, 'default')) return -1
  for (const key in value) {
    const payload = value[key]
    return key.length > 0
      ? resolveClauseChain(
          state,
          key,
          0,
          key.length,
          property,
          payload,
          payload == null ? undefined : merge,
          payload,
          contextOnly,
          -1,
          -1,
          0
        )
      : 0
  }
  return 0
}

export function contributeVariantClauseValue(
  state: GetStyleState,
  property: string,
  value: any,
  conditionSource: string,
  merge: MergeStyle,
  originalValue?: any,
  contextOnly = false
) {
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !isVariable(value) &&
    isConditionalStyleObject(state, value)
  ) {
    // a flat conditional object inside a clause-valued variant: the outer
    // condition prefixes every inner chain (`sm` + `hover` -> `sm:hover`)
    for (const key in value) {
      const payload = value[key]
      if (payload == null) continue
      const source = key === 'default' ? conditionSource : `${conditionSource}:${key}`
      resolveClauseChain(
        state,
        source,
        0,
        source.length,
        property,
        payload,
        merge,
        payload,
        contextOnly,
        -1,
        -1,
        2
      )
    }
    return
  }
  resolveClauseChain(
    state,
    conditionSource,
    0,
    conditionSource.length,
    property,
    value,
    merge,
    originalValue,
    contextOnly,
    -1,
    -1,
    2
  )
}

function contributeStyleObject(
  state: GetStyleState,
  property: string,
  value: Record<string, any>,
  merge: MergeStyle,
  contextOnly: boolean
) {
  const classification = isConditionalStyleObject(
    state,
    value,
    property,
    merge,
    contextOnly
  )
  if (!classification) return false
  let hasBase = false
  const base = value.default
  if (base != null) {
    emitValue(state, property, base, 0, '', undefined, '', '', merge, base, contextOnly)
    hasBase = true
  }
  let conditions = 0
  let useClassification = classification > 0
  for (const key in value) {
    if (key === 'default') continue
    const payload = value[key]
    if (useClassification) {
      if (payload != null) conditions |= classification
      useClassification = false
      continue
    }
    if (payload != null) {
      conditions |= resolveClauseChain(
        state,
        key,
        0,
        key.length,
        property,
        payload,
        merge,
        payload,
        contextOnly,
        -1,
        -1,
        1
      )
    }
  }
  if ((!canGenerateCSS || !state.flatShouldDoClasses) && conditions & 12 && !hasBase) {
    const resting = implicitLifecycleBase(property)
    if (resting !== null) {
      emitValue(
        state,
        property,
        resting,
        0,
        '',
        undefined,
        '',
        '',
        merge,
        resting,
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
  if (
    isWeb &&
    (webShadowParts.has(property) || legacyTransformParts.has(property)) &&
    ((typeof value === 'string' && value.indexOf(':') !== -1) ||
      (value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !isVariable(value) &&
        isConditionalStyleObject(state, value)))
  ) {
    if (process.env.NODE_ENV === 'development') {
      warnOnce(`conditional "${property}" needs its composite property; dropping it`)
    }
    return true
  }
  if (value === 'safe' && isSafeAreaKey(property)) {
    const expanded = expandSafeAreaValue(property)
    if (expanded) {
      state.flatUsesSafeArea = true
      for (const [key, resolved] of expanded) {
        emitValue(
          state,
          key,
          resolved,
          0,
          '',
          undefined,
          '',
          '',
          merge,
          originalValue ?? value,
          contextOnly
        )
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
  if (
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    !isVariable(value) &&
    contributeStyleObject(state, property, value, merge, contextOnly)
  ) {
    return true
  }
  if (value != null) {
    emitValue(
      state,
      property,
      value,
      0,
      '',
      undefined,
      '',
      '',
      merge,
      originalValue ?? value,
      contextOnly
    )
    return true
  }
  return false
}

export function clearDirectStyle(state: GetStyleState, property: string) {
  const atomicKey = property.startsWith('transition')
    ? 'transition'
    : webShadowParts.has(property)
      ? 'boxShadow'
      : webTextShadowParts.has(property)
        ? 'textShadow'
        : legacyTransformParts.has(property)
          ? 'transform'
          : property
  clearDirectAtomic(state, atomicKey)
  if (atomicKey === 'transform') state.transformAccumulator = undefined
  if (state.style) delete state.style[atomicKey]
  delete state.classNames[atomicKey]
}

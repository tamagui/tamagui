import { platformMatches } from '@tamagui/constants'
import { simpleHash } from '@tamagui/helpers'
import {
  canonicalStateModifierNames,
  compileModifierVocabulary,
  configRevisionSymbol,
  isContainerSizeQueryText,
  modifierKindMedia,
  modifierKindPlatform,
  modifierKindState,
  parseFlatValue,
  stateModifierSelectors,
  type CompiledModifierVocabulary,
} from '@tamagui/style-grammar/runtime'

import type { StaticConfig, TamaguiInternalConfig } from '../types'
import { classifyBorderComponents, splitComponents } from './borderComponents'
import { mediaObjectToString } from './mediaObjectToString'
import { getTokenCategoryForProperty, type RuntimeTokenCategory } from './tokenCategories'
import { expandSafeAreaValue } from './resolveSafeArea'
import { resolveSafeAreaVariable } from './resolveSafeAreaVariable'
import { resolveStyleStaticConfig } from './styleStaticConfigCore'
import type { StyleStaticConfig } from './styleStaticConfig'

export type ConfigRevisionPart =
  | 'media'
  | 'themeNames'
  | 'themeVariables'
  | 'tokens'
  | 'fonts'
  | 'shorthands'

export type ConfigRevisionParts = Readonly<Record<ConfigRevisionPart, string>>

export interface ConfigRevisionSnapshot {
  revision: string
  parts: ConfigRevisionParts
}

export interface ConfigRevisionState {
  revision: number
  modifiers: CompiledModifierVocabulary
  mediaQueries: Readonly<Record<string, string>>
  resolveCondition(name: string): ConditionModifier | null
  tokenCategory(property: string): RuntimeTokenCategory | undefined
  expandSafeArea: typeof expandSafeAreaValue
  safeAreaVariable: typeof resolveSafeAreaVariable
  parseFlatValue: typeof parseFlatValue
  styleStaticConfig(
    staticConfig: StaticConfig,
    conf: TamaguiInternalConfig
  ): StyleStaticConfig
  propertyKind(property: string): number
  compositeValue(
    property: string,
    raw: string,
    context: any,
    resolve: (context: any, property: string, raw: string) => any
  ): string | undefined
  normalizeTransition(value: string): string
  embeddedTokens(value: string, resolve: (token: string) => any): string
  snapshot?: ConfigRevisionSnapshot
}

export type ConditionModifier = [
  name: string,
  kind: number,
  rank: number,
  selectorOrQuery?: string,
  groupOrSize?: string,
  containerName?: string,
  platformActive?: boolean,
]

type ConfigWithRevision = TamaguiInternalConfig & {
  [configRevisionSymbol]?: ConfigRevisionState
}

export function prepareConfigRevision(
  config: TamaguiInternalConfig
): ConfigRevisionState {
  const target = config as ConfigWithRevision
  const previous = target[configRevisionSymbol]
  const captured = previous
    ? { ...previous, revision: previous.revision + 1 }
    : ({ revision: 1 } as ConfigRevisionState)
  if (previous) {
    target[configRevisionSymbol] = captured
  } else {
    Object.defineProperty(config, configRevisionSymbol, {
      configurable: true,
      writable: true,
      value: captured,
    })
  }

  // read each authored grammar section once. everything after this point is
  // derived from these call-stack locals.
  const media = config.media || {}
  const themes = config.themes || {}

  const mediaNames = Object.keys(media)
  const themeNames = Object.keys(themes)
  const modifiers = compileModifierVocabulary({ mediaNames, themeNames })
  const mediaQueries = Object.create(null) as Record<string, string>
  for (const name of mediaNames) {
    mediaQueries[name] = mediaObjectToString(media[name])
  }
  const conditionModifiers = Object.create(null) as Record<
    string,
    ConditionModifier | null
  >
  for (const name in modifiers) {
    const code = modifiers[name]
    const kind = code & 7
    const rank = code >> 3
    conditionModifiers[name] =
      kind === modifierKindState
        ? [canonicalStateModifierNames[rank], kind, rank, stateModifierSelectors[rank]]
        : kind === modifierKindMedia
          ? [name, kind, rank, mediaQueries[name]]
          : kind === modifierKindPlatform
            ? [name, kind, rank, undefined, undefined, undefined, platformMatches(name)]
            : [name, kind, rank]
  }
  const resolveCondition = (authored: string): ConditionModifier | null => {
    const cached = conditionModifiers[authored]
    if (cached !== undefined) return cached
    let result: ConditionModifier | null = null
    if (authored.startsWith('group-')) {
      const slash = authored.indexOf('/')
      const state = authored.slice(6, slash === -1 ? undefined : slash)
      const code = modifiers[state] || 0
      const rank = code >> 3
      const groupName = slash === -1 ? 'true' : authored.slice(slash + 1)
      if (
        (code & 7) === modifierKindState &&
        rank !== 6 &&
        rank !== 7 &&
        (slash === -1 || /^[\w-]+$/.test(groupName))
      ) {
        result = [
          `group-${canonicalStateModifierNames[rank]}${slash === -1 ? '' : authored.slice(slash)}`,
          5,
          rank,
          stateModifierSelectors[rank],
          groupName,
          canonicalStateModifierNames[rank],
        ]
      }
    } else if (authored.charCodeAt(0) === 64) {
      const slash = authored.indexOf('/')
      const size = authored.slice(1, slash === -1 ? undefined : slash)
      const containerName = slash === -1 ? '' : authored.slice(slash + 1)
      const code = modifiers[size] || 0
      const query = mediaQueries[size]
      if (
        /^[\w-]+$/.test(size) &&
        (slash === -1 || /^[\w-]+$/.test(containerName)) &&
        (code & 7) === modifierKindMedia &&
        isContainerSizeQueryText(query)
      ) {
        result = [authored, 6, code >> 3, query, size, containerName]
      }
    }
    return (conditionModifiers[authored] = result)
  }
  const propertyKinds: Record<string, number> = {
    shadowColor: 1,
    shadowOffset: 2,
    shadowOpacity: 3,
    shadowRadius: 4,
    matrix: 5,
    perspective: 5,
    rotateX: 5,
    rotateY: 5,
    rotateZ: 5,
    scaleZ: 5,
    skewX: 5,
    skewY: 5,
    textShadowColor: 6,
    textShadowOffset: 6,
    textShadowRadius: 6,
    border: 7,
    borderTop: 7,
    borderRight: 7,
    borderBottom: 7,
    borderLeft: 7,
    borderBlock: 7,
    borderInline: 7,
    outline: 7,
    padding: 8,
    paddingBlock: 8,
    paddingInline: 8,
    margin: 8,
    marginBlock: 8,
    marginInline: 8,
    inset: 8,
    insetBlock: 8,
    insetInline: 8,
    borderRadius: 8,
  }
  const propertyKind = (property: string) => propertyKinds[property] || 0
  const tokenCategory = (property: string): RuntimeTokenCategory | undefined =>
    config.tokensParsed[property]
      ? property
      : getTokenCategoryForProperty(property)
  // transition strings are re-normalized on every render of every animated
  // element; the result only depends on this revision's shorthands
  const normalizedTransitions = new Map<string, string>()
  const next: ConfigRevisionState = {
    revision: captured.revision,
    modifiers,
    mediaQueries,
    resolveCondition,
    tokenCategory,
    expandSafeArea: expandSafeAreaValue,
    safeAreaVariable: resolveSafeAreaVariable,
    parseFlatValue,
    styleStaticConfig: (staticConfig, conf) =>
      resolveStyleStaticConfig(staticConfig, conf, captured.revision),
    propertyKind,
    compositeValue: (property, raw, context, resolve) => {
      const kind = propertyKinds[property]
      if (kind < 7) return
      if (kind === 7) {
        const { width, style, color } = classifyBorderComponents(
          raw,
          property === 'outline'
        )
        if (style === 'none' && !color) return 'none'
        const prefix = property === 'outline' ? 'outline' : 'border'
        return [
          width && resolve(context, `${prefix}Width`, width),
          style,
          color && resolve(context, `${prefix}Color`, color),
        ]
          .filter(Boolean)
          .join(' ')
      }
      // a one-component shorthand (margin="4px") has nothing to distribute;
      // the split is on whitespace, so without any there is nothing to match out
      if (!/\s/.test(raw)) return
      const parts = splitComponents(raw)
      if (parts.length > 1) {
        let value = ''
        for (const part of parts) {
          value += `${value ? ' ' : ''}${resolve(context, property, part)}`
        }
        return value
      }
    },
    normalizeTransition: (raw) => {
      const known = normalizedTransitions.get(raw)
      if (known !== undefined) return known
      const out = raw.replace(
        /\/\*[\s\S]*?\*\/|(["'])(?:\\.|(?!\1)[^\\])*\1|[A-Za-z_][\w-]*/g,
        (authored, quote, offset) => {
          if (
            quote ||
            raw.charCodeAt(offset + authored.length) === 40 ||
            (raw.charCodeAt(offset - 1) === 45 && raw.charCodeAt(offset - 2) === 45)
          ) {
            return authored
          }
          let property = config.shorthands[authored] || authored
          if (property === 'x' || property === 'y') property = 'translate'
          else if (property === 'scaleX' || property === 'scaleY') property = 'scale'
          else if (propertyKind(property) === 5) property = 'transform'
          return property.replace(/[A-Z]/g, '-$&').toLowerCase()
        }
      )
      if (normalizedTransitions.size > 2048) normalizedTransitions.clear()
      normalizedTransitions.set(raw, out)
      return out
    },
    embeddedTokens: (raw, resolve) =>
      raw.replace(
        /\/\*[\s\S]*?\*\/|(["'])(?:\\.|(?!\1)[^\\])*\1|[$A-Za-z_][\w.$-]*(?:\/\d+)?/g,
        (word, quote, offset) => {
          const before = raw.charCodeAt(offset - 1)
          return quote ||
            (word[0] !== '$' &&
              ((before >= 48 && before <= 57) ||
                before === 35 ||
                (before === 45 && raw.charCodeAt(offset - 2) === 45) ||
                raw.charCodeAt(offset + word.length) === 40))
            ? word
            : resolve(word)
        }
      ),
  }

  // a getter above may have synchronously mutated and rebuilt this config.
  // only the build that still owns the captured record may publish.
  if (target[configRevisionSymbol] === captured) {
    target[configRevisionSymbol] = next
    return next
  }
  return target[configRevisionSymbol]!
}

export function getConfigRevisionState(
  config: TamaguiInternalConfig
): ConfigRevisionState {
  return (config as ConfigWithRevision)[configRevisionSymbol]!
}

export function getConfigRevisionSnapshot(
  config: TamaguiInternalConfig
): ConfigRevisionSnapshot {
  const state = getConfigRevisionState(config)
  if (state.snapshot) return state.snapshot

  const media = config.media || {}
  const themes = config.themes || {}
  const tokensParsed =
    config.tokensParsed || ({} as TamaguiInternalConfig['tokensParsed'])
  const fontsParsed = config.fontsParsed || {}
  const shorthands = config.shorthands || {}
  const sections: Record<ConfigRevisionPart, string[]> = {
    media: [],
    themeNames: [],
    themeVariables: [],
    tokens: [],
    fonts: [],
    shorthands: [],
  }
  for (const name of Object.keys(media).sort()) {
    sections.media.push(`m:${name}=${mediaObjectToString(media[name])}`)
  }
  const themeNames = Object.keys(themes).sort()
  sections.themeNames.push(`t:${themeNames.join(',')}`)
  const themeKeys = new Set<string>()
  for (const name of themeNames) {
    for (const key of Object.keys(themes[name] || {})) themeKeys.add(key)
  }
  sections.themeVariables.push(`v:${[...themeKeys].sort().join(',')}`)
  for (const category of Object.keys(tokensParsed).sort()) {
    const tokens = tokensParsed[category]
    sections.tokens.push(
      `${category}:${tokens ? Object.keys(tokens).sort().join(',') : ''}`
    )
  }
  for (const family of Object.keys(fontsParsed).sort()) {
    const font = fontsParsed[family]
    sections.fonts.push(`f:${family}=${font ? Object.keys(font).sort().join(',') : ''}`)
  }
  sections.shorthands.push(
    `s:${Object.keys(shorthands)
      .sort()
      .map((key) => `${key}>${shorthands[key]}`)
      .join(',')}`
  )

  const snapshot: ConfigRevisionSnapshot = {
    revision: simpleHash(Object.values(sections).flat().join('|'), 'strict') || '0',
    parts: Object.fromEntries(
      Object.entries(sections).map(([name, values]) => [
        name,
        simpleHash(values.join('|'), 'strict') || '0',
      ])
    ) as Record<ConfigRevisionPart, string>,
  }
  if ((config as ConfigWithRevision)[configRevisionSymbol] === state) {
    state.snapshot = snapshot
  }
  return snapshot
}

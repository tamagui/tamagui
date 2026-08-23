import { simpleHash } from '@tamagui/helpers'
import {
  compileModifierVocabulary,
  configRevisionSymbol,
  createClausePrecedenceOrder,
  type ClausePrecedenceOrder,
  type CompiledModifierVocabulary,
} from '@tamagui/style-grammar/runtime'

import type { TamaguiInternalConfig } from '../types'
import { mediaObjectToString } from './mediaObjectToString'

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
  precedenceOrder: ClausePrecedenceOrder
  snapshot?: ConfigRevisionSnapshot
}

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
  const precedenceOrder = createClausePrecedenceOrder(mediaNames)
  const mediaQueries = Object.create(null) as Record<string, string>
  for (const name of mediaNames) {
    mediaQueries[name] = mediaObjectToString(media[name])
  }
  const next: ConfigRevisionState = {
    revision: captured.revision,
    modifiers,
    mediaQueries,
    precedenceOrder,
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
  for (const category of ['color', 'space', 'size', 'radius', 'zIndex']) {
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

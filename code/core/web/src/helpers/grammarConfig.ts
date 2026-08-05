import { simpleHash } from '@tamagui/helpers'

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

const revisions = new WeakMap<TamaguiInternalConfig, ConfigRevisionSnapshot>()

export function getConfigRevisionSnapshot(
  config: TamaguiInternalConfig
): ConfigRevisionSnapshot {
  const cached = revisions.get(config)
  if (cached) return cached

  const sections: Record<ConfigRevisionPart, string[]> = {
    media: [],
    themeNames: [],
    themeVariables: [],
    tokens: [],
    fonts: [],
    shorthands: [],
  }
  const media = config.media || {}
  for (const key of Object.keys(media).sort()) {
    sections.media.push(`m:${key}=${mediaObjectToString(media[key])}`)
  }
  const themes = config.themes || {}
  const themeNames = Object.keys(themes).sort()
  sections.themeNames.push(`t:${themeNames.join(',')}`)
  const themeKeys = new Set<string>()
  for (const name of themeNames) {
    for (const key of Object.keys(themes[name] || {})) themeKeys.add(key)
  }
  sections.themeVariables.push(`v:${[...themeKeys].sort().join(',')}`)
  for (const category of ['color', 'space', 'size', 'radius', 'zIndex']) {
    const tokens = config.tokensParsed[category]
    sections.tokens.push(
      `${category}:${tokens ? Object.keys(tokens).sort().join(',') : ''}`
    )
  }
  for (const family of Object.keys(config.fontsParsed || {}).sort()) {
    const font = config.fontsParsed[family]
    sections.fonts.push(`f:${family}=${font ? Object.keys(font).sort().join(',') : ''}`)
  }
  const shorthands = config.shorthands || {}
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
  revisions.set(config, snapshot)
  return snapshot
}

import { describe, expect, test } from 'vitest'
import { defaultConfig } from '../../config/src/v5-base'
import { bundledDefaultGrammarConfig } from '../src/to-tailwind-default-config'

const stripDollar = (name: string) => (name[0] === '$' ? name.slice(1) : name)
const namesOf = (source: Record<string, unknown> | undefined) =>
  Object.keys(source || {}).map(stripDollar)
const sortedUnique = (names: Iterable<string>) => [...new Set(names)].sort()

describe('to-tailwind bundled default names', () => {
  test('matches every canonical v5 config name without runtime config dependencies', () => {
    const config = defaultConfig as any
    const actualTokenNames: Record<string, string[]> = {}
    for (const category of ['space', 'size', 'radius', 'zIndex', 'color']) {
      actualTokenNames[category] = namesOf(config.tokens?.[category])
    }

    const fontFamily: string[] = []
    const fontSize = new Set<string>()
    const lineHeight = new Set<string>()
    const letterSpacing = new Set<string>()
    for (const familyName in config.fonts) {
      fontFamily.push(stripDollar(familyName))
      const font = config.fonts[familyName]
      for (const name of namesOf(font?.size)) fontSize.add(name)
      for (const name of namesOf(font?.lineHeight)) lineHeight.add(name)
      for (const name of namesOf(font?.letterSpacing)) letterSpacing.add(name)
    }

    const color = new Set(actualTokenNames.color)
    for (const themeName in config.themes) {
      for (const name of namesOf(config.themes[themeName])) color.add(name)
    }
    actualTokenNames.color = [...color]
    actualTokenNames.fontFamily = fontFamily
    actualTokenNames.fontSize = [...fontSize]
    actualTokenNames.lineHeight = [...lineHeight]
    actualTokenNames.letterSpacing = [...letterSpacing]

    expect(bundledDefaultGrammarConfig.shorthands).toEqual(config.shorthands)
    expect(sortedUnique(bundledDefaultGrammarConfig.mediaNames)).toEqual(
      sortedUnique(Object.keys(config.media))
    )
    expect(sortedUnique(bundledDefaultGrammarConfig.themeNames)).toEqual(
      sortedUnique(Object.keys(config.themes))
    )
    for (const category in actualTokenNames) {
      expect(
        sortedUnique(
          bundledDefaultGrammarConfig.tokenNames[
            category as keyof typeof bundledDefaultGrammarConfig.tokenNames
          ]
        )
      ).toEqual(sortedUnique(actualTokenNames[category]))
    }
  })
})

process.env.TAMAGUI_TARGET = 'web'

import { simpleHash } from '@tamagui/helpers'
import { describe, expect, test } from 'vitest'

import { createTamagui } from '../web/src'

// one color, four spellings, plus a genuinely different color as the control
const NAVY = '#1a2b3c'
const NAVY_RGB = 'rgb(26, 43, 60)'
const NAVY_RGBA = 'rgba(26,43,60,1)'
const NAVY_HEX8 = '#1a2b3cff'
const OTHER = '#1a2b3d'

const WHITE_HEX = '#fff'
const WHITE_NAME = 'white'
const WHITE_HSL = 'hsl(0, 0%, 100%)'

const makeConfig = () =>
  createTamagui({
    tokens: {
      color: {},
      space: { 4: 10 },
      size: { 4: 10 },
      radius: { 4: 10 },
      zIndex: { 4: 10 },
    },
    themes: {
      collapse: {
        background: NAVY,
        color: NAVY_RGB,
        borderColor: NAVY_RGBA,
        outlineColor: NAVY_HEX8,
        shadowColor: OTHER,
        placeholderColor: WHITE_HEX,
        borderColorHover: WHITE_NAME,
        borderColorPress: WHITE_HSL,
      },
    },
  })

const ruleFor = (config: ReturnType<typeof makeConfig>, themeName: string) => {
  const rule = config.themeConfig
    .getThemeRulesSets()
    .find((set) => set.includes(`.t_${themeName}`))
  if (!rule) throw new Error(`no css rule set for theme ${themeName}`)
  return rule
}

const declaredValue = (rule: string, themeKey: string) => {
  const match = rule.match(new RegExp(`--${simpleHash(themeKey, 40)}:([^;]+);`))
  if (!match) throw new Error(`no declaration for theme key ${themeKey}`)
  return match[1]
}

describe('theme variable collapsing', () => {
  test('equivalent color spellings share one variable, different colors do not', () => {
    const config = makeConfig()
    const rule = ruleFor(config, 'collapse')

    const navy = declaredValue(rule, 'background')
    expect(declaredValue(rule, 'color')).toBe(navy)
    expect(declaredValue(rule, 'borderColor')).toBe(navy)
    expect(declaredValue(rule, 'outlineColor')).toBe(navy)

    // the control: one hex digit apart is a different color and keeps its own
    // variable, so a canonicalizer that collapsed everything would fail here
    expect(declaredValue(rule, 'shadowColor')).not.toBe(navy)

    const white = declaredValue(rule, 'placeholderColor')
    expect(declaredValue(rule, 'borderColorHover')).toBe(white)
    expect(declaredValue(rule, 'borderColorPress')).toBe(white)
    expect(white).not.toBe(navy)
  })

  test('the collapsed variable keeps the authored spelling, it is not rewritten', () => {
    const config = makeConfig()
    const css = config.getCSS()
    const rule = ruleFor(config, 'collapse')
    const navyVar = declaredValue(rule, 'background').replace(/^var\(--(.+)\)$/, '$1')

    expect(css).toContain(`--${navyVar}:${NAVY}`)
    // the longer equivalent spellings are gone entirely, and no rgba() rewrite
    // of the authored value took their place
    expect(css).not.toContain(NAVY_RGB)
    expect(css).not.toContain(NAVY_RGBA)
  })

  test('a color that parses to the same integer as a token value does not take it over', () => {
    // rgba(0, 0, 0, 0.039) parses to the 32-bit integer 10, which is also the
    // literal value of the space token below
    const config = createTamagui({
      tokens: {
        color: {},
        space: { 4: 10 },
        size: { 4: 20 },
        radius: { 4: 30 },
        zIndex: { 4: 40 },
      },
      themes: {
        collide: {
          background: 'rgba(0, 0, 0, 0.039)',
          borderWidth: 10,
        },
      },
    })
    const rule = ruleFor(config, 'collide')
    // an auto variable of its own, not the space token's
    expect(declaredValue(rule, 'background')).toMatch(/^var\(--t\d+\)$/)
    // and a theme value that really is the token's value still reuses it
    expect(declaredValue(rule, 'borderWidth')).toBe(
      config.tokensParsed.space['4'].variable
    )
  })
})

import { describe, expect, test } from 'vitest'

import { defaultConfig } from '../config/src/v6'
import { View, createTamagui, styled } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

const negativeTrueKey = `-${'true'}`

describe('default token config', () => {
  test('has no true token keys', () => {
    const tokenCategories = ['size', 'space', 'radius', 'zIndex'] as const

    for (const category of tokenCategories) {
      const tokens = defaultConfig.tokens[category]
      if (tokens) {
        expect(tokens).not.toHaveProperty('true')
        expect(tokens).not.toHaveProperty(negativeTrueKey)
      }
    }

    for (const font of Object.values(defaultConfig.fonts)) {
      expect(font.size).not.toHaveProperty('true')
    }
  })

  test('emits every numeric token category with a css unit', () => {
    // outside quirks mode a unitless length is invalid, so the browser drops
    // the whole declaration: `width:var(--c-width-10)` against
    // `--c-width-10:40` leaves the element at auto width and the token silently
    // does nothing. every numeric category has to be listed in UNIT_CATEGORIES
    // in createTamagui; zIndex is the one that is unitless by definition.
    const conf = createTamagui(defaultConfig)
    const css: string = conf.getCSS()
    const unitless: string[] = []
    const seen = new Set<string>()

    for (const [category, tokens] of Object.entries(conf.tokensParsed as any)) {
      if (category === 'zIndex') continue
      for (const variable of Object.values(tokens as any) as any[]) {
        // 0 is valid unitless, so it cannot tell a missing unit from a good one
        if (typeof variable?.val !== 'number' || variable.val === 0) continue
        const decl = `--${variable.name}:`
        const at = css.indexOf(decl)
        if (at === -1) continue
        seen.add(category)
        // the last declaration in a block has no trailing `;`
        const from = at + decl.length
        const ends = [css.indexOf(';', from), css.indexOf('}', from)].filter(
          (i) => i !== -1
        )
        const value = css.slice(from, Math.min(...ends)).trim()
        if (!/^-?[\d.]+px$/.test(value)) unitless.push(`${decl}${value}`)
      }
    }

    // the dimensional categories the tailwind scales added, named so this stays
    // a real check rather than passing on a config that never had them
    for (const category of [
      'size',
      'space',
      'radius',
      'width',
      'maxWidth',
      'flexBasis',
    ]) {
      expect(seen, `no ${category} tokens reached the css`).toContain(category)
    }
    expect(unitless).toEqual([])
  })

  test('resolves boolean style tokens through the built-in key', () => {
    createTamagui(defaultConfig)
    let seenSize: unknown

    const SizedView = styled(View, {
      variants: {
        size: styled.dynamic<any>((val) => {
          seenSize = val
          return {
            width: val,
          }
        }),
      } as const,
    })

    simplifiedGetSplitStyles(SizedView, {
      size: true,
    })

    expect(seenSize).toBe(true)
  })
})

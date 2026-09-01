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

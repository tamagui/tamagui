import { describe, expect, test } from 'vitest'

import { defaultConfig as v5Config } from '../config/src/v5-base'
import { defaultConfig as v6Config } from '../config/src/v6'
import { View, createTamagui, styled } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

const negativeTrueKey = `-${'true'}`

const configs = [
  ['v5', v5Config],
  ['v6', v6Config],
] as const

describe('versioned token configs', () => {
  test.each(configs)('%s has no true token keys', (_, config) => {
    const tokenCategories = ['size', 'space', 'radius', 'zIndex'] as const

    for (const category of tokenCategories) {
      const tokens = config.tokens[category]
      if (tokens) {
        expect(tokens).not.toHaveProperty('true')
        expect(tokens).not.toHaveProperty(negativeTrueKey)
      }
    }

    for (const font of Object.values(config.fonts)) {
      expect(font.size).not.toHaveProperty('true')
    }
  })

  test.each(configs)(
    '%s resolves boolean style tokens through the built-in key',
    (_, config) => {
      createTamagui(config)
      let seenSize: unknown

      const SizedView = styled(View, {
        variants: {
          size: {
            Size: (val) => {
              seenSize = val
              return {
                width: val,
              }
            },
          },
        } as const,
      })

      simplifiedGetSplitStyles(SizedView, {
        size: true,
      })

      expect(seenSize).toBe('4')
    }
  )
})

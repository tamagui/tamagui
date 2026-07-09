import { describe, expect, test } from 'vitest'

import { config as v3Config } from '../config/src/v3'
import { defaultConfig as v4Config } from '../config/src/v4'
import { defaultConfig as v5Config } from '../config/src/v5-base'
import { View, createTamagui, styled } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

const prefixedTrueKey = `$${'true'}`
const negativeTrueKey = `-${'true'}`

const configs = [
  ['v3', v3Config],
  ['v4', v4Config],
  ['v5', v5Config],
] as const

describe('v3 token configs', () => {
  test.each(configs)('%s has no true token keys', (_, config) => {
    const tokenCategories = ['size', 'space', 'radius', 'zIndex'] as const

    for (const category of tokenCategories) {
      expect(config.tokens[category]).not.toHaveProperty('true')
      expect(config.tokens[category]).not.toHaveProperty(prefixedTrueKey)
      expect(config.tokens[category]).not.toHaveProperty(negativeTrueKey)
    }

    for (const font of Object.values(config.fonts)) {
      expect(font.size).not.toHaveProperty('true')
      expect(font.size).not.toHaveProperty(prefixedTrueKey)
    }
  })

  test.each(configs)(
    '%s resolves boolean size through settings.defaultSize',
    (_, config) => {
      const tamaguiConfig = createTamagui(config)
      let seenSize: unknown

      const SizedView = styled(View, {
        variants: {
          size: {
            '...size': (val) => {
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

      expect(seenSize).toBe(tamaguiConfig.settings.defaultSize)
    }
  )
})

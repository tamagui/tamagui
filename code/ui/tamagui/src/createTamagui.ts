import { createTamagui as createTamaguiCore } from '@tamagui/core'

/**
 * Adds some helpful validation at dev time only for `tamagui` specifically
 **/

export const createTamagui: typeof createTamaguiCore =
  process.env.NODE_ENV !== 'development'
    ? createTamaguiCore
    : (conf) => {
        const tamaguiConfig = createTamaguiCore(conf)

        // others must define subset of size tokens
        const expected = Object.keys(tamaguiConfig.tokensParsed.size)
        for (const name of ['radius', 'zIndex'] as const) {
          const tokenSet = tamaguiConfig.tokensParsed[name]
          const received = Object.keys(tokenSet)
          const hasSomeOverlap = received.some((rk) => expected.includes(rk))
          if (!hasSomeOverlap) {
            throw new Error(`
createTamagui() invalid tokens.${name}:

Received: ${received.join(', ')}

Expected a subset of: ${expected.join(', ')}

`)
          }
        }

        return tamaguiConfig
      }

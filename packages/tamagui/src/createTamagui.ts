import { createTamagui as createTamaguiCore } from '@tamagui/core'

/**
 * Adds some helpful validation at dev time only for `tamagui` specifically
 **/

export const createTamagui: typeof createTamaguiCore =
  process.env.NODE_ENV !== 'development'
    ? createTamaguiCore
    : (conf) => {
        const sizeTokenKeys = [
          '$0',
          '$1',
          '$2',
          '$3',
          '$4',
          '$5',
          '$6',
          '$7',
          '$8',
          '$9',
          '$10',
          '$true',
        ]

        const hasKeys = (expectedKeys: string[], obj: Record<any, any>) => {
          return expectedKeys.every((k) => typeof obj[k] !== 'undefined')
        }

        const tamaguiConfig = createTamaguiCore(conf)

        // size and space should be fully defined
        for (const name of ['size', 'space'] as const) {
          const tokenSet = tamaguiConfig.tokensParsed[name]
          if (!tokenSet) {
            throw new Error(
              `Expected tokens for "${name}" in ${Object.keys(
                tamaguiConfig.tokensParsed,
              ).join(', ')}`,
            )
          }
          if (!hasKeys(sizeTokenKeys, tokenSet)) {
            throw new Error(`
createTamagui() missing definition for expected tokens.${name}:

Received: ${Object.keys(tokenSet).join(', ')}

Expected: ${sizeTokenKeys.join(', ')}

`)
          }
        }

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

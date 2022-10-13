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

        const parsed = createTamaguiCore(conf)

        // size and space should be fully defined
        for (const name of ['size', 'space'] as const) {
          const tokenSet = parsed.tokensParsed[name]
          if (!hasKeys(sizeTokenKeys, tokenSet)) {
            throw new Error(`
createTamagui() missing definition for expected tokens.${name}:

Expected keys for: ${sizeTokenKeys.join(', ')}

Received: ${Object.keys(tokenSet).join(', ')}

`)
          }
        }

        // others must define subset of size tokens
        const userTokenKeys = Object.keys(parsed.tokensParsed.size)
        for (const name of ['radius', 'zIndex'] as const) {
          const tokenSet = parsed.tokensParsed[name]
          const givenKeys = Object.keys(tokenSet)
          const missing = givenKeys.find((key) => !userTokenKeys.includes(key))
          if (missing?.length) {
            throw new Error(`
createTamagui() invalid tokens.${name}:

Expected subset of: ${userTokenKeys.join(', ')}

Received: ${givenKeys.join(', ')}

Missing: ${missing}

`)
          }
        }

        return parsed
      }

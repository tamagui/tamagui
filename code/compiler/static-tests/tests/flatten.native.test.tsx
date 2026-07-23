import * as React from 'react'
import { describe, expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

Error.stackTraceLimit = Number.Infinity
process.env.TAMAGUI_TARGET = 'native'

window['React'] = React

describe('flatten-tests', () => {
  test(`flattened without extra attributes`, async () => {
    const output = await extractForNative(`
      import { YStack } from 'tamagui'
      import { useMedia } from 'tamagui'

      export function Test(isLoading) {
        const media = useMedia()

        return (
          <YStack
            y={10}
            x={20}
            rotate="10deg"
          />
        )
      }
    `)

    expect(output?.code).toContain('<__TamaguiNativeView')
    expect(output?.code).toContain(
      '"transform":[{"translateY":10},{"translateX":20},{"rotate":"10deg"}]'
    )
  })

  test('flattened media queries', async () => {
    const output = await extractForNative(`
      import { YStack } from 'tamagui'
      import { useMedia } from 'tamagui'

      export function Test(isLoading) {
        const media = useMedia()

        return (
          <YStack
            y={10}
            x={20}
            rotate="10deg"
            {...media.sm && {
              scale: 2,
              borderRadius: 10,
              backgroundColor: isLoading ? 'red' : 'blue'
            }}
          />
        )
      }
    `)

    const code = output?.code ?? ''

    expect(code).toMatchSnapshot()

    expect(code).toContain('...media.sm &&')
    expect(code).toContain("backgroundColor: isLoading ? 'red' : 'blue'")
    expect(code).toContain('<YStack')
  })

  test(`work with experimentalFlattenThemesOnNative`, async () => {
    const output = await extractForNative(`
      import { YStack } from 'tamagui'

      export function Test(isLoading) {
        return (
          <YStack
            y={10}
            x={20}
            rotate="10deg"
            backgroundColor="$background"
          />
        )
      }
    `)

    expect(output?.code).toMatchSnapshot()
  })

  test(`work with experimentalFlattenThemesOnNative + ternary`, async () => {
    const output = await extractForNative(`
      import { View } from 'tamagui'

      export function Test() {
        return (
          <View backgroundColor={showBackground ? '$color1' : '$color2'} />
        )
      }
    `)

    expect(output?.code).toMatchSnapshot()
  })

  test(`allow invalid identifier`, async () => {
    const output = await extractForNative(`
        import { View } from 'tamagui'
        export function Test() {
          return (
            <View backgroundColor='$invalid-identifier' />
          )
        }
      `)

    expect(output?.code).contains("backgroundColor='$invalid-identifier'")
  })

  test(`bails on runtime event handlers — a bare RN View ignores onPress`, async () => {
    const output = await extractForNative(`
      import { View } from 'tamagui'
      export function Test() {
        return (
          <View
            width={60}
            backgroundColor="rgb(1,2,3)"
            onPress={() => console.info('pressed')}
          />
        )
      }
    `)
    const code = output?.code ?? ''
    expect(code).toContain('onPress')
    expect(code).toContain('<View')
    expect(code).not.toContain('__TamaguiNativeView')
  })

  test(`preserves the complete runtime candidate on pressStyle bailout`, async () => {
    const output = await extractForNative(`
      import { View } from 'tamagui'
      export function Test() {
        return (
          <View
            width={60}
            height={40}
            backgroundColor="rgb(1,2,3)"
            hoverStyle={{ opacity: 0.5 }}
            pressStyle={{ opacity: 0.8 }}
          />
        )
      }
    `)
    const code = output?.code ?? ''
    expect(code).toContain('width={60}')
    expect(code).toContain('backgroundColor="rgb(1,2,3)"')
    expect(code).toContain('pressStyle')
    expect(code).toContain('hoverStyle')
    expect(code).toContain('<View')
    expect(code).not.toContain('__TamaguiNativeView')
  })

  test(`keeps theme tokens inline on a pseudo-style bailout`, async () => {
    const output = await extractForNative(`
      import { View } from 'tamagui'
      export function Test() {
        return (
          <View
            width={60}
            height={40}
            backgroundColor="$gray2"
            pressStyle={{ opacity: 0.8 }}
          />
        )
      }
    `)
    const code = output?.code ?? ''
    expect(code).toContain('width={60}')
    expect(code).toContain('backgroundColor="$gray2"')
    expect(code).toContain('pressStyle')
    expect(code).not.toContain('__TamaguiNativeView')
  })

  // TODO make this work:
  // test.skip(`keeps style object a single object case 2`, async () => {
  //   const output = await extractForNative(`
  //     import { View } from 'tamagui'

  //     export function Test() {
  //       return (
  //         <View position="absolute" key={0} right="$2" top="$2" />
  //       )
  //     }
  //   `)

  //   // just one sheet
  //   expect(output?.code).toContain(`style={_sheet["0"]}`)
  // })
})

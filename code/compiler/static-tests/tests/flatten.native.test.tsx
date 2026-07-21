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

    expect(output?.code).toContain(`<__ReactNativeView style={_sheet["0"]} />`)
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

    const startStr = `ReactNativeStyleSheet.create(`
    const start = code.indexOf(startStr)
    const end = code.indexOf(`});`)
    const defs = code.slice(start + startStr.length, end + 1)
    const sheetStyles = JSON.parse(defs)

    expect(sheetStyles['0']).toEqual({
      transform: [
        {
          translateY: 10,
        },
        {
          translateX: 20,
        },
        {
          rotate: '10deg',
        },
      ],
      flexDirection: 'column',
    })

    expect(sheetStyles['1']).toEqual({
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      transform: [
        {
          scale: 2,
        },
      ],
    })

    expect(sheetStyles['2']).toEqual({
      backgroundColor: 'red',
    })

    expect(sheetStyles['3']).toEqual({
      backgroundColor: 'blue',
    })
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

    expect(output?.code).contains('theme["invalid-identifier"].get()')
  })

  // partial-flatten on native deopt: a component that must stay on the runtime path
  // (pressStyle) still gets its pure-static props pre-merged into one `style={…}`,
  // skipping the runtime per-prop loop. dead native hoverStyle is dropped.
  test(`partial-flattens static props on pressStyle deopt`, async () => {
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
    // static props merged into a single style object
    expect(code).toContain('"width": 60')
    expect(code).toContain('"backgroundColor": "rgb(1,2,3)"')
    // pseudo stays on the runtime component
    expect(code).toContain('pressStyle')
    // dead native hover is dropped entirely
    expect(code).not.toContain('hoverStyle')
    // still the runtime tamagui View (deopted), not folded to a raw RN view
    expect(code).toContain('<View style=')
  })

  test(`preserves hoverStyle when partial-flattening for macOS`, async () => {
    const output = await extractForNative(
      `
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
      `,
      'macos'
    )
    const code = output?.code ?? ''

    expect(code).toContain('"width": 60')
    expect(code).toContain('hoverStyle')
    expect(code).toContain('pressStyle')
    expect(code).toContain('<View style=')
  })

  // theme tokens must NOT be baked into the flattened static style — they stay inline
  // so the runtime resolves them per-theme (theme switching keeps working).
  test(`keeps theme tokens inline when partial-flattening`, async () => {
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
    // static numeric props flatten
    expect(code).toContain('"width": 60')
    // the theme token is NOT hardcoded into the static style object
    expect(code).not.toContain('"backgroundColor": "$gray2"')
    // it remains an inline prop the runtime resolves per-theme
    expect(code).toContain('backgroundColor="$gray2"')
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

import { transform } from 'esbuild'
import { createRequire } from 'node:module'
import * as React from 'react'
import TestRenderer, { act } from 'react-test-renderer'
import { describe, expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

Error.stackTraceLimit = Number.Infinity
process.env.TAMAGUI_TARGET = 'native'

window['React'] = React

describe('flatten-tests', () => {
  test('reuses a lowered static style across native renders', async () => {
    const output = await extractForNative(`
      import { View } from 'tamagui'

      export function Test({ revision }) {
        return (
          <View
            testID={revision ? 'after' : 'before'}
            width={20}
            height={20}
            backgroundColor="rgb(1,2,3)"
          />
        )
      }
    `)
    const executable = await transform(output.code, {
      format: 'cjs',
      jsx: 'automatic',
      loader: 'tsx',
      platform: 'node',
      target: 'node20',
    })
    const compiledModule = { exports: {} as Record<string, unknown> }
    const require = createRequire(import.meta.url)
    new Function('require', 'module', 'exports', executable.code)(
      require,
      compiledModule,
      compiledModule.exports
    )
    const Test = compiledModule.exports.Test as React.ComponentType<{
      revision: number
    }>
    let rendered: TestRenderer.ReactTestRenderer
    await act(async () => {
      rendered = TestRenderer.create(<Test revision={0} />)
    })
    const before = rendered!.root.find((node) => node.type === 'View')
    expect(before.props.style).toEqual({
      width: 20,
      height: 20,
      backgroundColor: 'rgb(1,2,3)',
    })
    const beforeStyle = before.props.style

    await act(async () => {
      rendered!.update(<Test revision={1} />)
    })
    const after = rendered!.root.find((node) => node.type === 'View')
    expect(after.props.style).toBe(beforeStyle)

    await act(async () => {
      rendered!.unmount()
    })
  })

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
    // extraction uses the same authored-order accumulator as runtime
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
            backgroundColor="background"
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
          <View backgroundColor={showBackground ? 'color1' : 'color2'} />
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
            <View backgroundColor='invalid-identifier' />
          )
        }
      `)

    expect(output?.code).toContain('<__TamaguiNativeView')
    expect(output?.code).toContain('"backgroundColor":')
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

  test(`bails on pointer event handlers — usePointerEvents maps them to touch at runtime`, async () => {
    const output = await extractForNative(`
      import { View } from 'tamagui'
      export function Test() {
        return (
          <View
            width={60}
            backgroundColor="rgb(1,2,3)"
            onPointerDown={() => console.info('down')}
          />
        )
      }
    `)
    const code = output?.code ?? ''
    expect(code).toContain('onPointerDown')
    expect(code).toContain('<View')
    expect(code).not.toContain('__TamaguiNativeView')
  })

  test(`bails on asChild — the runtime renders a Slot, not a host view`, async () => {
    const output = await extractForNative(`
      import { View } from 'tamagui'
      export function Test() {
        return (
          <View asChild width={60} backgroundColor="rgb(1,2,3)">
            <View width={10} height={10} />
          </View>
        )
      }
    `)
    const code = output?.code ?? ''
    const outer = code.slice(code.indexOf('return ('))
    expect(outer.match(/<(__TamaguiNativeView|View)\b/)?.[1]).toBe('View')
    expect(code).toContain('asChild')
  })

  test(`bails on the container props — they provide the '@' context descendants read`, async () => {
    for (const prop of [
      'container',
      'container="side"',
      'containerName="side"',
      'containerType="size"',
    ]) {
      const output = await extractForNative(`
        import { View } from 'tamagui'
        export function Test() {
          return (
            <View ${prop} width={60} backgroundColor="rgb(1,2,3)">
              <View width={10} height={10} />
            </View>
          )
        }
      `)
      const code = output?.code ?? ''
      const outer = code.slice(code.indexOf('return ('))
      expect(outer.match(/<(__TamaguiNativeView|View)\b/)?.[1]).toBe('View')
    }
  })

  test(`preserves the complete runtime candidate on a state-clause bailout`, async () => {
    const output = await extractForNative(`
      import { View } from 'tamagui'
      export function Test() {
        return (
          <View
            width={60}
            height={40}
            backgroundColor="rgb(1,2,3)"
            opacity="hover:0.5 press:0.8"
          />
        )
      }
    `)
    const code = output?.code ?? ''
    expect(code).toContain('width={60}')
    expect(code).toContain('backgroundColor="rgb(1,2,3)"')
    expect(code).toContain('hover:0.5 press:0.8')
    expect(code).toContain('<View')
    expect(code).not.toContain('__TamaguiNativeView')
  })

  test(`keeps theme tokens inline on a state-clause bailout`, async () => {
    const output = await extractForNative(`
      import { View } from 'tamagui'
      export function Test() {
        return (
          <View
            width={60}
            height={40}
            backgroundColor="gray2"
            opacity="press:0.8"
          />
        )
      }
    `)
    const code = output?.code ?? ''
    expect(code).toContain('width={60}')
    expect(code).toContain('backgroundColor="gray2"')
    expect(code).toContain('press:0.8')
    expect(code).not.toContain('__TamaguiNativeView')
  })

  // TODO make this work:
  // test.skip(`keeps style object a single object case 2`, async () => {
  //   const output = await extractForNative(`
  //     import { View } from 'tamagui'

  //     export function Test() {
  //       return (
  //         <View position="absolute" key={0} right="2" top="2" />
  //       )
  //     }
  //   `)

  //   // just one sheet
  //   expect(output?.code).toContain(`style={_sheet["0"]}`)
  // })
})

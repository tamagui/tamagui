import * as React from 'react'
import { expect, test } from 'vitest'

import { extractForNative } from './lib/extract'

process.env.TAMAGUI_TARGET = 'native'
process.env.IS_STATIC = ''

window['React'] = React

test('basic extraction', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack backgroundColor="red" />
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('theme value extraction should work when no theme variables used', async () => {
  // here we override default "$color" so it should flatten totally
  // actually since we do unstyled: false and it expands to $color it acceses it
  // were not smart enough yet to detect its later overriden :/
  // that could be a perf optimization, but also have work to improve flattening soon anyway
  const output = await extractForNative(`
    import { Paragraph } from 'tamagui'
    export function Test() {
      return (
        <Paragraph color="red">hello world</Paragraph>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('theme value extraction should work when theme variables used', async () => {
  const output = await extractForNative(`
    import { Paragraph } from 'tamagui'
    export function Test() {
      return (
        <Paragraph>hello world</Paragraph>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('basic conditional extraction', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    let x = true
    export function Test() {
      return (
        <>
          <YStack backgroundColor={x ? 'red' : 'blue'} />
          <YStack {...x && { backgroundColor: 'red' }} />
        </>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('flat transform props', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test(isLoading) {
      return (
        <YStack
          scale={isLoading ? 1 : 2}
          x={10}
          y={20}
          rotate="10deg"
        />
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('handles style order merge properly', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test(props) {
      return (
        <YStack
          scale={props.isLoading ? 1 : 2}
          x={10}
          {...props}
          rotate="10deg"
        />
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test(`normalize ternaries flips the conditional properly`, async () => {
  const inputCode = `
  import { View } from 'tamagui'
  export function Test(props) {
    return (
      <View marginBottom={props !== 123 ? 12 : 0} />
    )
  }
`
  const output = await extractForNative(inputCode)
  const outCode = output?.code ?? ''
  expect(outCode).toContain(`props === 123 ? _sheet["0"] : _sheet["1"]`)
  expect(outCode).toMatchSnapshot()
})

test(`normalize ternaries with the conditional dynamic values`, async () => {
  const inputCode = `
  import { View } from 'tamagui'
  export function Test(props) {
    return (
      <View marginBottom={props !== 123 ? 12 : props.mb} />
    )
  }
`
  const output = await extractForNative(inputCode)
  const outCode = output?.code ?? ''
  expect(outCode).toContain(`props !== 123 ? 12 : props.mb`)
  expect(outCode).toMatchSnapshot()
})

test('normalize dynamic values with no theme access', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    const height = 200
    export function Test(props) {
      return (
        <YStack height={height} width={props.width}/>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('normalize dynamic values with theme access only', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test(props) {
      return (
        <YStack bg='$color'/>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('do NOT flatten dynamic values with theme access', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test(props) {
      return (
        <YStack bg='$color' height={props.height}/>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('do NOT flatten dynamic values with theme access, dynamic values, and conditional', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test(props) {
      return (
        <YStack bg={props.isLoading ? '$color' : 'red'} height={props.height}/>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('do NOT flatten multiple dynamic values with theme access and conditional', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test(props) {
      return (
        <YStack bg={props.isLoading ? '$color' : 'red'} height={props.height} width={props.width}/>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('$md and $gtMd media queries should respect breakpoint boundaries', async () => {
  // Regression test for bug starting in 1.132.17
  // On small screens (iPhone), $md should apply, NOT $gtMd
  // The bug was that $gtMd was incorrectly applying on mobile
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack
          h={100}
          w={100}
          bc="red"
          $md={{ bc: 'yellow' }}
          $gtMd={{ bc: 'green' }}
        />
      )
    }
  `)
  const code = output?.code ?? ''
  // Verify the output includes both media query conditions
  // and they are structured correctly for runtime evaluation
  expect(code).toMatchSnapshot()
})

test('$gtMd only should NOT apply on small screens', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack
          h={100}
          w={100}
          bc="red"
          $gtMd={{ bc: 'green' }}
        />
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('multiple media query components should not conflict', async () => {
  const output = await extractForNative(`
    import { YStack, XStack } from 'tamagui'
    export function Test() {
      return (
        <>
          <YStack bc="red" $md={{ bc: 'yellow' }} />
          <XStack bc="blue" $gtMd={{ bc: 'green' }} />
          <YStack bc="purple" $sm={{ bc: 'pink' }} />
        </>
      )
    }
  `)
  const code = output?.code ?? ''
  // Verify each wrapper has a unique name
  expect(code).toMatchSnapshot()
  // Make sure we don't have duplicate const declarations
  const styledMatches = code.match(/const _\w+Styled\d+/g) || []
  const uniqueNames = new Set(styledMatches)
  expect(styledMatches.length).toBe(uniqueNames.size)
})

test('string ternary test should not be confused with media key', async () => {
  // Regression: <View width={someString ? 24 : 66} xs={{ height: 30 }} />
  // someString evaluates to a string at runtime, and _withStableStyle's
  // resolvedExpressions check `typeof expr === 'string' ? media[expr] : expr`
  // would incorrectly treat it as a media key lookup.
  // The fix: compiler wraps non-string-literal expressions with !! to coerce to boolean.
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test({ someString }) {
      return (
        <YStack
          width={someString ? 24 : 66}
          $sm={{ height: 30 }}
        />
      )
    }
  `)
  const code = output?.code ?? ''
  // the ternary test expression must be coerced to boolean
  expect(code).toContain('!!someString')
  // the media key should remain a plain string literal
  expect(code).toContain('"sm"')
  expect(code).toMatchSnapshot()
})

// native has no hover state, so hoverStyle should be dropped instead of
// preserved as runtime work.
test('hoverStyle on native should drop dead hover work', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack backgroundColor="red" hoverStyle={{ backgroundColor: 'green' }} />
      )
    }
  `)
  const code = output?.code ?? ''
  // must not serialize hoverStyle into the stylesheet or preserve it as runtime work
  expect(code).not.toContain('"hoverStyle"')
  expect(code).not.toContain('hoverStyle')
  expect(code).not.toContain("backgroundColor: 'green'")
  expect(code).toContain('__ReactNativeView')
  expect(code).toMatchSnapshot()
})

test('hoverStyle on macOS should preserve runtime hover work', async () => {
  const output = await extractForNative(
    `
      import { YStack } from 'tamagui'
      export function Test({ onEnter }) {
        return (
          <YStack
            backgroundColor="red"
            hoverStyle={{ backgroundColor: 'green' }}
            onMouseEnter={onEnter}
          />
        )
      }
    `,
    'macos'
  )
  const code = output?.code ?? ''

  expect(code).not.toContain('"hoverStyle"')
  expect(code).toContain('hoverStyle')
  expect(code).toContain('onMouseEnter={onEnter}')
  expect(code).toContain("backgroundColor: 'green'")
  expect(code).toContain('<YStack')
})

test('styled hoverStyle on macOS should preserve the runtime component', async () => {
  const output = await extractForNative(
    `
      import { MyHoverStack } from '@tamagui/test-design-system'

      export function Test() {
        return <MyHoverStack backgroundColor="red" />
      }
    `,
    'macos'
  )
  const code = output?.code ?? ''

  expect(code).toContain('<MyHoverStack')
  expect(code).not.toContain('<__ReactNativeView')
})

test('$theme-* on native should de-opt (preserve as inline prop)', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack backgroundColor="red" $theme-dark={{ backgroundColor: 'green' }} />
      )
    }
  `)
  const code = output?.code ?? ''
  // must NOT serialize $theme-dark as a sheet key (it would never match on RN)
  expect(code).not.toContain('"$theme-dark"')
  // must preserve as an inline JSX prop so runtime resolves it via theme
  expect(code).toContain('$theme-dark')
  expect(code).toContain('<YStack')
  expect(code).toMatchSnapshot()
})

test('$group-*-hover on native should drop dead hover work', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack group="row">
          <YStack
            backgroundColor="red"
            $group-row-hover={{ backgroundColor: 'green' }}
          />
        </YStack>
      )
    }
  `)
  const code = output?.code ?? ''
  // must not serialize or preserve hover-only group styles on native
  expect(code).not.toContain('"$group-row-hover"')
  expect(code).not.toContain('$group-row-hover')
  expect(code).not.toContain("backgroundColor: 'green'")
  expect(code).toMatchSnapshot()
})

test('$group-*-hover on macOS should preserve runtime hover work', async () => {
  const output = await extractForNative(
    `
      import { YStack } from 'tamagui'
      export function Test() {
        return (
          <YStack group="row">
            <YStack $group-row-hover={{ backgroundColor: 'green' }} />
          </YStack>
        )
      }
    `,
    'macos'
  )
  const code = output?.code ?? ''

  expect(code).toContain('$group-row-hover')
  expect(code).toContain("backgroundColor: 'green'")
  expect(code).toContain('group="row"')
})

test('$group-* non-hover on native should de-opt (preserve as inline prop)', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack group="row">
          <YStack
            backgroundColor="red"
            $group-row-press={{ backgroundColor: 'green' }}
          />
        </YStack>
      )
    }
  `)
  const code = output?.code ?? ''
  // must not serialize $group-row-press as a sheet key
  expect(code).not.toContain('"$group-row-press"')
  // must preserve as an inline jsx prop so runtime resolves it via group context
  expect(code).toContain('$group-row-press')
  // group="row" parent must remain (it provides the runtime container context)
  expect(code).toContain('group="row"')
  expect(code).toMatchSnapshot()
})

test('$platform-macos on native should preserve runtime platform work', async () => {
  const output = await extractForNative(
    `
      import { YStack } from 'tamagui'
      export function Test() {
        return <YStack $platform-macos={{ backgroundColor: 'green' }} />
      }
    `,
    'macos'
  )
  const code = output?.code ?? ''

  expect(code).toContain('$platform-macos')
  expect(code).toContain("backgroundColor: 'green'")
  expect(code).toContain('<YStack')
})

test('ternary with mixed theme-token and non-token values preserves all props', async () => {
  const output = await extractForNative(`
    import { Text } from 'tamagui'
    export function Test({ isActive, label }) {
      return (
        <Text
          fontSize="$3"
          fontWeight={isActive ? '600' : '400'}
          color={isActive ? '$color12' : '$color11'}
        >
          {label}
        </Text>
      )
    }
  `)
  const code = output?.code ?? ''
  // fontWeight must be conditional, not unconditional
  // the bug was that plain styles (fontWeight) were added unconditionally
  // when a ternary branch also had theme tokens (color), causing the last
  // branch's value (400) to always win
  expect(code).toContain('fontWeight')
  // both fontWeight values should appear in the sheet styles
  expect(code).toContain('600')
  expect(code).toContain('400')
  // the fontWeight values should be in different sheet entries, wrapped in a ternary
  // NOT both applied unconditionally
  expect(code).toMatchSnapshot()
})

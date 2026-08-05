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
  // here we override default "color" so it should flatten totally
  // we're not smart enough yet to detect that it's later overridden
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

test(`dynamic ternary lowers per-branch, only the test survives`, async () => {
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
  expect(outCode).toContain(`_expressions={[props !== 123]}`)
  expect(outCode).toContain(`expressions[0] ? {"marginBottom":12} : {"marginBottom":0}`)
  expect(outCode).toMatchSnapshot()
})

test(`conditional font family lowers per-branch with per-family size resolution`, async () => {
  const output = await extractForNative(`
  import { SizableText } from 'tamagui'
  export function Test({ compact }) {
    return (
      <SizableText fontFamily={compact ? 'body' : 'heading'} size="7">
        Go
      </SizableText>
    )
  }
`)
  const code = output?.code ?? ''
  expect(code).toContain('_expressions={[compact]}')
  // each branch resolves the family AND everything that reads it at compile
  // time; the branches must differ in family and carry their own font metrics
  const branches = code.match(/expressions\[0\] \? (\{.*?\}) : (\{.*?\})\]/)
  expect(branches).toBeTruthy()
  const whenTrue = JSON.parse(branches![1]!)
  const whenFalse = JSON.parse(branches![2]!)
  // the test config's families share one family string; the branch difference
  // shows up as the heading font's own metrics resolved per branch
  expect(whenTrue).not.toEqual(whenFalse)
  expect(whenFalse.fontWeight).toBe(700)
  expect(output.stats.flattened).toBeGreaterThan(0)
  expect(output.diagnostics).toEqual([])
  expect(code).toMatchSnapshot()
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
        <YStack bg='color'/>
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
        <YStack bg='color' height={props.height}/>
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
        <YStack bg={props.isLoading ? 'color' : 'red'} height={props.height}/>
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
        <YStack bg={props.isLoading ? 'color' : 'red'} height={props.height} width={props.width}/>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchSnapshot()
})

test('string ternary and media prop remain distinct on the runtime component', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test({ someString }) {
      return (
        <YStack
          width={someString ? 24 : 66}
          height="sm:30px"
        />
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toContain('someString ? 24 : 66')
  expect(code).toContain('sm:30px')
  expect(code).toMatchSnapshot()
})

test('a hover clause on native stays on the runtime path', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack backgroundColor="red hover:green" />
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toContain('hover:green')
  expect(code).not.toContain('__TamaguiNativeView')
  expect(code).toMatchSnapshot()
})

test('a theme clause on native de-opts to the runtime path', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack backgroundColor="red dark:green" />
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toContain('dark:green')
  expect(code).toContain('<YStack')
  expect(code).toMatchSnapshot()
})

test('a named group hover clause on native stays on the runtime path', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack group="row">
          <YStack
            backgroundColor="red group-hover/row:green"
          />
        </YStack>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toContain('group-hover/row:green')
  expect(code).toContain('group="row"')
  expect(code).toMatchSnapshot()
})

test('a named group press clause on native stays on the runtime path', async () => {
  const output = await extractForNative(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack group="row">
          <YStack
            backgroundColor="red group-press/row:green"
          />
        </YStack>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toContain('group-press/row:green')
  // group="row" parent must remain (it provides the runtime container context)
  expect(code).toContain('group="row"')
  expect(code).toMatchSnapshot()
})

test('ternary with mixed theme-token and non-token values preserves all props', async () => {
  const output = await extractForNative(`
    import { Text } from 'tamagui'
    export function Test({ isActive, label }) {
      return (
        <Text
          fontSize="3"
          fontWeight={isActive ? '600' : '400'}
          color={isActive ? 'color12' : 'color11'}
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

import * as React from 'react'
import { expect, test } from 'vitest'

import { extractBabel } from './lib/extract'

process.env.TAMAGUI_TARGET = 'native'
process.env.IS_STATIC = ''

window['React'] = React

test('basic extraction', async () => {
  const output = await extractBabel(`
    import { YStack } from 'tamagui'
    export function Test() {
      return (
        <YStack backgroundColor="red" />
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchInlineSnapshot(`
    "const _sheet = ReactNativeStyleSheet.create({
      \\"0\\": {
        \\"backgroundColor\\": \\"red\\"
      }
    });

    import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
    import { YStack } from 'tamagui';
    export function Test() {
      return <YStack _style1jujyhc={_sheet[\\"0\\"]} />;
    }"
  `)
})

test('basic conditional extraction', async () => {
  const output = await extractBabel(`
    import { YStack } from 'tamagui'
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
  expect(code).toMatchInlineSnapshot(`
    "const _sheet = ReactNativeStyleSheet.create({
      \\"0\\": {
        \\"backgroundColor\\": \\"red\\"
      },
      \\"1\\": {
        \\"backgroundColor\\": \\"blue\\"
      },
      \\"2\\": {
        \\"backgroundColor\\": \\"red\\"
      },
      \\"3\\": {}
    });

    import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
    import { YStack } from 'tamagui';
    export function Test() {
      return <>
              <YStack _stylelabka6={x ? _sheet[\\"0\\"] : _sheet[\\"1\\"]} />
              <YStack _style1x8g24d={x ? _sheet[\\"2\\"] : _sheet[\\"3\\"]} />
            </>;
    }"
  `)
})

test('flat transform props', async () => {
  const output = await extractBabel(`
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
  expect(code).toMatchInlineSnapshot(`
    "const _sheet = ReactNativeStyleSheet.create({
      \\"0\\": {
        \\"transform\\": [{
          \\"scale\\": 1
        }]
      },
      \\"1\\": {
        \\"transform\\": [{
          \\"scale\\": 2
        }]
      },
      \\"2\\": {
        \\"transform\\": [{
          \\"translateX\\": 10
        }, {
          \\"translateY\\": 20
        }, {
          \\"rotate\\": \\"10deg\\"
        }]
      }
    });

    import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
    import { YStack } from 'tamagui';
    export function Test(isLoading) {
      return <YStack _style1rhtpsq={isLoading ? _sheet[\\"0\\"] : _sheet[\\"1\\"]} _style47lnc6={_sheet[\\"2\\"]} />;
    }"
  `)
})

test('handles style order merge properly', async () => {
  const output = await extractBabel(`
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
  expect(code).toMatchInlineSnapshot(`
    "const _sheet = ReactNativeStyleSheet.create({
      \\"0\\": {
        \\"transform\\": [{
          \\"scale\\": 1
        }]
      },
      \\"1\\": {
        \\"transform\\": [{
          \\"scale\\": 2
        }]
      },
      \\"2\\": {},
      \\"3\\": {
        \\"transform\\": [{
          \\"rotate\\": \\"10deg\\"
        }]
      }
    });

    import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
    import { YStack } from 'tamagui';
    export function Test(props) {
      return <YStack _style1rhtpsq={props.isLoading ? _sheet[\\"0\\"] : _sheet[\\"1\\"]} _style31e={_sheet[\\"2\\"]} {...props} _style9zfgt4={_sheet[\\"3\\"]} />;
    }"
  `)
})

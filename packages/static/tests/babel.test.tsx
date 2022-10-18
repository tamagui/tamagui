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
        \\"backgroundColor\\": \\"red\\",
        \\"flexDirection\\": \\"column\\",
        \\"flexShrink\\": 0,
        \\"alignItems\\": \\"stretch\\"
      }
    });
    import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
    import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
    import { YStack } from 'tamagui';
    export function Test() {
      return <__ReactNativeView style={[_sheet[\\"0\\"]]} />;
    }"
  `)
})

test('theme value extraction should work when no theme variables used', async () => {
  // here we override default "$color" so it should flatten totally
  const output = await extractBabel(`
    import { Paragraph } from 'tamagui'
    export function Test() {
      return (
        <Paragraph color="red">hello world</Paragraph>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchInlineSnapshot(`
    "const _sheet = ReactNativeStyleSheet.create({
      \\"0\\": {
        \\"color\\": \\"red\\",
        \\"fontFamily\\": \\"Inter\\",
        \\"fontWeight\\": \\"500\\",
        \\"letterSpacing\\": 0,
        \\"fontSize\\": 14,
        \\"lineHeight\\": 25,
        \\"display\\": \\"flex\\"
      }
    });
    import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
    import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
    import { Paragraph } from 'tamagui';
    export function Test() {
      return <__ReactNativeText style={[_sheet[\\"0\\"]]}>hello world</__ReactNativeText>;
    }"
  `)
})

test('theme value extraction should NOT work when theme variables used', async () => {
  // here we DO NOT override default "$color" so it WONT flatten
  const output = await extractBabel(`
    import { Paragraph } from 'tamagui'
    export function Test() {
      return (
        <Paragraph>hello world</Paragraph>
      )
    }
  `)
  const code = output?.code ?? ''
  expect(code).toMatchInlineSnapshot(`
    "const _sheet = ReactNativeStyleSheet.create({
      \\"0\\": {
        \\"color\\": \\"rgba(23,23,23,1.00)\\",
        \\"fontWeight\\": \\"500\\",
        \\"letterSpacing\\": 0,
        \\"fontSize\\": 14,
        \\"lineHeight\\": 25,
        \\"display\\": \\"flex\\"
      }
    });
    import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
    import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
    import { Paragraph } from 'tamagui';
    export function Test() {
      return <Paragraph _style1onns4v={_sheet[\\"0\\"]}>hello world</Paragraph>;
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
        \\"flexDirection\\": \\"column\\",
        \\"flexShrink\\": 0,
        \\"alignItems\\": \\"stretch\\"
      },
      \\"1\\": {
        \\"backgroundColor\\": \\"red\\"
      },
      \\"2\\": {
        \\"backgroundColor\\": \\"blue\\"
      },
      \\"3\\": {
        \\"flexDirection\\": \\"column\\",
        \\"flexShrink\\": 0,
        \\"alignItems\\": \\"stretch\\"
      },
      \\"4\\": {
        \\"backgroundColor\\": \\"red\\"
      },
      \\"5\\": {}
    });
    import { StyleSheet as ReactNativeStyleSheet } from 'react-native';
    import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
    import { YStack } from 'tamagui';
    export function Test() {
      return <>
              <__ReactNativeView style={[_sheet[\\"0\\"], x ? _sheet[\\"1\\"] : _sheet[\\"2\\"]]} />
              <__ReactNativeView style={[_sheet[\\"3\\"], x ? _sheet[\\"4\\"] : _sheet[\\"5\\"]]} />
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
        \\"flexDirection\\": \\"column\\",
        \\"flexShrink\\": 0,
        \\"alignItems\\": \\"stretch\\"
      },
      \\"1\\": {
        \\"transform\\": [{
          \\"scale\\": 1
        }]
      },
      \\"2\\": {
        \\"transform\\": [{
          \\"scale\\": 2
        }]
      },
      \\"3\\": {
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
    import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
    import { YStack } from 'tamagui';
    export function Test(isLoading) {
      return <__ReactNativeView style={[_sheet[\\"0\\"], isLoading ? _sheet[\\"1\\"] : _sheet[\\"2\\"], _sheet[\\"3\\"]]} />;
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
    import { View as __ReactNativeView, Text as __ReactNativeText } from 'react-native';
    import { YStack } from 'tamagui';
    export function Test(props) {
      return <YStack _style1rhtpsq={props.isLoading ? _sheet[\\"0\\"] : _sheet[\\"1\\"]} _style31e={_sheet[\\"2\\"]} {...props} _style9zfgt4={_sheet[\\"3\\"]} />;
    }"
  `)
})

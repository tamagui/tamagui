import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import {
  ButtonDemo,
  CheckboxDemo,
  GroupDemo,
  InputsDemo,
  ProgressDemo,
  SelectDemo,
  SwitchDemo,
  TabsDemo,
  TabsAdvancedDemo,
} from '@tamagui/demos'
import { useState } from 'react'
import { SolitoImage } from 'solito/image'
import {
  Button,
  Popover,
  ScrollView,
  TamaguiProvider,
  XStack,
  YStack,
  styled,
  withStaticProperties,
} from 'tamagui'

import config from './tamagui.config'

// useful for debugging why things render:
// import './wdyr'

// webpack fix..
if (typeof require !== 'undefined') {
  globalThis['React'] = require('react')
}

/**
the ideal is:

- styled(a, b) - b accepts any subset of a.props
- returns type where props defined in b become nullable

 */
const Image = styled(
  SolitoImage,
  {
    alt: '',
    resizeMode: 'contain',
    src: '',
    style: {},
  },
  {
    inlineProps: new Set(['width', 'height']),
    acceptsClassName: true,
  }
)

export const Sandbox = () => {
  return (
    <SandboxFrame>
      {/* keep indent */}
      <SandboxDefault />

      {/* <TestPopoverContentStyledPlusAnimations /> */}
    </SandboxFrame>
  )
}

function TestPopoverContentStyledPlusAnimations() {
  return (
    <Popover size="$5">
      <Popover.Trigger asChild>
        <Button>go</Button>
      </Popover.Trigger>

      <PopoverStyledContent debug="verbose">
        <Popover.Arrow bw={1} boc="$borderColor" />
      </PopoverStyledContent>
    </Popover>
  )
}

const PopoverStyledContent = styled(Popover.Content, {
  name: 'PopoverContent2',
  debug: 'verbose',
  elevate: true,
  bordered: true,
  p: '$3',
  br: '$3',
  enterStyle: {
    o: 0,
    y: -10,
    x: 0,
  },
  exitStyle: {
    o: 0,
    y: -10,
    x: 0,
  },
  x: 0,
  y: 0,
  o: 1,
  animation: [
    'quick',
    {
      opacity: {
        overshootClamping: true,
      },
    },
  ],
})

console.log('PopoverStyledContent', PopoverStyledContent)

const SandboxFrame = (props: { children: any }) => {
  const [theme, setTheme] = useState('light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <link href="/fonts/inter.css" rel="stylesheet" />

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `
            html, body, #root { overflow: hidden; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; }
          `,
        }}
      />

      {props.children}

      {/*  */}
      <button
        style={{
          position: 'absolute',
          bottom: 30,
          left: 20,
          fontSize: 30,
        }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        🌗
      </button>
    </TamaguiProvider>
  )
}

function SandboxDefault() {
  const demos = (
    <>
      <TabsAdvancedDemo />
    </>
  )

  return (
    <XStack bc="$backgroundStrong" fullscreen ai="center" jc="center">
      <ScrollView fullscreen horizontal>
        <ScrollView fullscreen>
          <SolitoImageExample />

          <YStack>
            <XStack gap={20} px="$4" flexWrap="wrap">
              {demos}
            </XStack>
            <XStack theme="alt1" gap={20} px="$4" flexWrap="wrap">
              {demos}
            </XStack>
            <XStack px="$4" theme="blue" gap={20} flexWrap="wrap">
              {demos}
            </XStack>
            <XStack px="$4" theme="blue_alt1" gap={20} flexWrap="wrap">
              {demos}
            </XStack>
          </YStack>
        </ScrollView>
      </ScrollView>
    </XStack>
  )
}

// function TestUseStyle() {
//   console.log('wtf', Square.staticConfig.validStyles)
//   const style = useStyle(Square, {
//     backgroundColor: 'red',
//   })

//   console.log('style', style, Square.staticConfig.validStyles)

//   return null
// }

// function TestUseMediaRenders() {
//   const media = useMedia()

//   console.warn('render')

//   return <H1>{media.sm ? 'sm' : 'not sm'}</H1>
// }

// function TestUseTheme() {
//   const u = useTheme()
//   console.log(u.color)
//   return null
// }

const SolitoImageExample = () => (
  <Image
    alt=""
    style={{}}
    resizeMode="contain"
    width={40}
    height={40}
    src="/favicon.svg"
    bc="$color"
  />
)

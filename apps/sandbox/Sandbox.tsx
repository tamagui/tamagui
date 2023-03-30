import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import {
  ButtonDemo,
  CheckboxDemo,
  GroupDemo,
  InputsDemo,
  ListItemDemo,
  ProgressDemo,
  SelectDemo,
  SwitchDemo,
  TabsAdvancedDemo,
  TabsDemo,
} from '@tamagui/demos'
import { useState } from 'react'
import { SolitoImage } from 'solito/image'
import {
  Button,
  Input,
  ScrollView,
  Stack,
  TamaguiProvider,
  ToastProvider,
  XStack,
  YStack,
  styled,
  withStaticProperties,
} from 'tamagui'

import { SandboxThemeChange } from './SandboxThemeChange'
// import { SandboxCustomStyledAnimatedPopover } from './SandboxCustomStyledAnimatedPopover'
// import { SandboxCustomStyledAnimatedTooltip } from './SandboxCustomStyledAnimatedTooltip'
// import { SandboxStyledOverridePseudo } from './SandboxStyledOverridePsuedo'
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

const Button2 = styled(Button, {
  variants: {
    ok: {
      true: {
        pressStyle: {
          backgroundColor: 'red',
        },
      },
    },
  },
})

export const Sandbox = () => {
  return (
    <SandboxFrame>
      {/* this comment keeps indent */}

      <SandboxThemeChange />

      {/* TODO fix/convert into tests */}
      {/* <SandboxStyledOverridePseudo /> */}
      {/* <SandboxCustomStyledAnimatedTooltip /> */}
      {/* <SandboxCustomStyledAnimatedPopover /> */}
    </SandboxFrame>
  )
}

const SandboxFrame = (props: { children: any }) => {
  const [theme, setTheme] = useState('light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <ToastProvider swipeDirection="horizontal">
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
      </ToastProvider>
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

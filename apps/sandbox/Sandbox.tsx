// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { ButtonNewDemo, TabsAdvancedDemo } from '@tamagui/demos'
import { AnimationsDemo } from '@tamagui/demos'
import { ToastProvider } from '@tamagui/toast'
import { useState } from 'react'
import {
  Button,
  ScrollView,
  Separator,
  TamaguiProvider,
  Theme,
  XStack,
  YStack,
} from 'tamagui'

import config from './tamagui.config'

// useful for debugging why things render:
// import './wdyr'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

export const Sandbox = () => {
  const componentName = new URLSearchParams(window.location.search).get('test')
  const Component = componentName
    ? require(`./usecases/${componentName}`).default
    : SandboxInner

  console.log(`render once`)

  return (
    <SandboxFrame>
      {/* this comment keeps indent */}

      {/* <SwitchDemo /> */}

      {/* <ButtonDemo /> */}
      <Component />
      {/* TODO fix/convert into tests */}
      {/* <SandboxAnimationThemeChange /> */}
      {/* <SandboxThemeChange /> */}
      {/* <SandboxStyledOverridePseudo /> */}
      {/* <SandboxCustomStyledAnimatedTooltip /> */}
      {/* <SandboxCustomStyledAnimatedPopover /> */}
    </SandboxFrame>
  )
}

const SandboxInner = () => {
  return <ButtonNewDemo />
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
            html, body, #root { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; }
          `,
          }}
        />

        <XStack fullscreen backgroundColor="red">
          <YStack f={1} h="100%" bg="$background">
            {props.children}
          </YStack>
          <Separator vertical />
          <Theme name="dark">
            <YStack f={1} h="100%" bg="$background">
              {props.children}
            </YStack>
          </Theme>
        </XStack>

        <button
          style={{
            position: 'fixed',
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

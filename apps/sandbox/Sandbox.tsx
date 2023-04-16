// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { ButtonDemo, ButtonNewDemo, SwitchDemo, TabsAdvancedDemo } from '@tamagui/demos'
// import { SandboxCustomStyledAnimatedPopover } from './SandboxCustomStyledAnimatedPopover'
// import { SandboxCustomStyledAnimatedTooltip } from './SandboxCustomStyledAnimatedTooltip'
// import { SandboxStyledOverridePseudo } from './SandboxStyledOverridePsuedo'
import { AnimationsDemo } from '@tamagui/demos'
import { ToastProvider } from '@tamagui/toast'
import { useState } from 'react'
import { Button, ScrollView, Separator, TamaguiProvider, XStack, YStack } from 'tamagui'
import { Theme } from 'tamagui'

import { SandboxThemeChange } from './SandboxThemeChange'
import config from './tamagui.config'

// useful for debugging why things render:
// import './wdyr'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

const SandboxAnimationThemeChange = () => {
  const [x, setX] = useState('blue')

  return (
    <Theme name={x as any}>
      <Button onPress={() => setX(x === 'blue' ? 'red' : 'blue')}>cahnge</Button>
      <AnimationsDemo />
    </Theme>
  )
}

const SandboxActiveTheme = () => {
  return (
    <>
      <Button theme="active" hoverStyle={{ scale: 2 }} animation="quick">
        active
      </Button>

      <Button debug="verbose" hoverStyle={{ scale: 1 }} animation="quick">
        regular
      </Button>

      <SwitchDemo />

      <Theme name="blue">
        <Button theme="active" hoverStyle={{ scale: 1 }} animation="quick">
          active
        </Button>

        <Button hoverStyle={{ scale: 1 }} animation="quick">
          regular
        </Button>

        <SwitchDemo />
      </Theme>
    </>
  )
}

export const Sandbox = () => {
  console.log(`render once`)

  return (
    <SandboxFrame>
      {/* this comment keeps indent */}

      {/* <SwitchDemo /> */}

      {/* <SandboxActiveTheme /> */}

      {/* <ButtonDemo /> */}
      <ButtonNewDemo />
      {/* TODO fix/convert into tests */}
      {/* <SandboxAnimationThemeChange /> */}
      {/* <SandboxThemeChange /> */}
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

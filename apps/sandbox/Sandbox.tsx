// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { ToastProvider } from '@tamagui/toast'
import { useState } from 'react'
import { Separator, Square, TamaguiProvider, Theme, XStack, YStack } from 'tamagui'

import config from './tamagui.config'

// useful for debugging why things render:
// import './wdyr'

export const Sandbox = () => {
  const componentName = new URLSearchParams(window.location.search).get('test')
  const Component = componentName
    ? require(`./usecases/${componentName}`).default
    : SandboxInner

  return (
    <SandboxFrame>
      {/* this comment keeps indent */}
      <Component />
    </SandboxFrame>
  )
}

const SandboxInner = () => {
  return <Square animation="bouncy" size={100} bc="red" />
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
          <YStack ai="center" jc="center" f={1} h="100%" bg="$background">
            {props.children}
          </YStack>
          <Separator vertical />
          <Theme name="dark">
            <YStack ai="center" jc="center" f={1} h="100%" bg="$background">
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

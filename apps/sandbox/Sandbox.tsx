import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { AnimationsDemo, ToggleGroupDemo } from '@tamagui/demos'
import * as Demos from '@tamagui/demos'
import { ToastProvider } from '@tamagui/toast'
import { useState } from 'react'
import {
  Paragraph,
  Separator,
  Square,
  TamaguiProvider,
  Theme,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import config from './tamagui.config'

// useful for debugging why things render:
// import './wdyr'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

export const Sandbox = () => {
  const demoComponentName = new URLSearchParams(window.location.search).get('demo')
  const useCaseComponentName = new URLSearchParams(window.location.search).get('test')
  const Component = demoComponentName
    ? Demos[demoComponentName]
    : useCaseComponentName
    ? require(`./usecases/${useCaseComponentName}`).default
    : SandboxInner
  return (
    <SandboxFrame>
      {/* this comment keeps indent */}
      <Component />
    </SandboxFrame>
  )
}

const SandboxInner = () => {
  return <ToggleGroupDemo />
  return <Square animation="bouncy" size={100} bc="red" />
}

const SandboxFrame = (props: { children: any }) => {
  const [theme, setTheme] = useState(
    new URLSearchParams(window.location.search).get('theme') === 'dark' ? 'dark' : 'light'
  )
  const [screenshot, setScreenshot] = useState(
    new URLSearchParams(window.location.search).has('screenshot')
  )
  const showThemeSwitch = !screenshot
  const splitView = new URLSearchParams(window.location.search).get('splitView')

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

        <XStack fullscreen>
          <YStack ai="center" jc="center" f={1} h="100%">
            {props.children}
          </YStack>

          {splitView ? (
            <>
              <Separator vertical />
              <Theme name="dark">
                <YStack
                  ai="center"
                  jc="center"
                  f={1}
                  h="100%"
                  bg={screenshot ? 'transparent' : '$background'}
                >
                  {props.children}
                </YStack>
              </Theme>
            </>
          ) : null}
        </XStack>

        {showThemeSwitch && (
          <div
            style={{
              position: 'fixed',
              bottom: 30,
              left: 20,
              fontSize: 30,
            }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            🌗
          </div>
        )}
      </ToastProvider>
    </TamaguiProvider>
  )
}

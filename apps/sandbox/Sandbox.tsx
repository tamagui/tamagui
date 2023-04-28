import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import * as Demos from '@tamagui/demos'
import { ToastProvider } from '@tamagui/toast'
import { Suspense, lazy, useState } from 'react'
import { Separator, Square, TamaguiProvider, Theme, XStack, YStack } from 'tamagui'

import config from './tamagui.config'

// useful for debugging why things render:
// import './wdyr'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

export const Sandbox = () => {
  const componentName = new URLSearchParams(window.location.search).get('test')
  const demoName = new URLSearchParams(window.location.search).get('demo')
  const Component = componentName
    ? // vite wants a .js ending here, but webpack doesn't :/
      lazy(() => import(`./usecases/${componentName}`))
    : demoName
    ? Demos[`${demoName}Demo`]
    : SandboxInner

  return (
    <SandboxFrame>
      <Suspense fallback="Loading...">
        {/* <Square
          animation="quick"
          debug="verbose"
          size={100}
          bc="red"
          enterStyle={{ y: -10 }}
          y={10}
        /> */}
        <Component />
      </Suspense>
    </SandboxFrame>
  )
}

const SandboxInner = () => {
  return <Square animation="bouncy" size={100} bc="red" />
}

const SandboxFrame = (props: { children: any }) => {
  const [theme, setTheme] = useState('light')
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
          <YStack ai="center" jc="center" f={1} h="100%" bg="$background">
            {props.children}
          </YStack>

          {splitView ? (
            <>
              <Separator vertical />
              <Theme name="dark">
                <YStack ai="center" jc="center" f={1} h="100%" bg="$background">
                  {props.children}
                </YStack>
              </Theme>
            </>
          ) : null}
        </XStack>

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
      </ToastProvider>
    </TamaguiProvider>
  )
}

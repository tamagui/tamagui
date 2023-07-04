import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import * as Demos from '@tamagui/demos'
import { ToastViewport } from '@tamagui/toast'
import { useState } from 'react'
import { Separator, Theme, XStack, YStack } from 'tamagui'

import { Provider } from './provider'
import { Sandbox } from './Sandbox'
import * as TestCases from './usecases'

// useful for debugging why things render:
// import './wdyr'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

export default function App() {
  const kitchenSink = new URLSearchParams(window.location.search).get('kitchen')
  const demoComponentName = new URLSearchParams(window.location.search).get('demo')
  const useCaseComponentName = new URLSearchParams(window.location.search).get('test')
  const Component = kitchenSink
    ? // solito breaking
      () => null //require('../kitchen-sink/src/features/home/screen').HomeScreen
    : demoComponentName
    ? Demos[
        demoComponentName.endsWith('Demo')
          ? demoComponentName
          : `${demoComponentName}Demo`
      ]
    : useCaseComponentName
    ? TestCases[useCaseComponentName]
    : Sandbox

  return (
    <SandboxFrame>
      <Component />
    </SandboxFrame>
  )
}

const SandboxFrame = (props: { children: any }) => {
  const [theme, setTheme] = useState(
    new URLSearchParams(window.location.search).get('theme') === 'dark' ? 'dark' : 'light'
  )
  const [screenshot] = useState(
    new URLSearchParams(window.location.search).has('screenshot')
  )
  const showThemeSwitch = !screenshot
  const splitView = new URLSearchParams(window.location.search).get('splitView')

  return (
    <Provider defaultTheme={theme as any}>
      <link href="/fonts/inter.css" rel="stylesheet" />

      {screenshot && (
        <style
          type="text/css"
          dangerouslySetInnerHTML={{
            __html: `
            html, body, #root { background-color: transparent !important; }
          `,
          }}
        />
      )}

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `
            html, body, #root { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; }
          `,
        }}
      />

      <Theme name={screenshot ? 'blue' : undefined}>
        <XStack w="100%" h="100%" fullscreen>
          <YStack f={1}>{props.children}</YStack>

          {splitView ? (
            <>
              <Separator vertical />
              <Theme name="dark">
                <YStack f={1} bg={screenshot ? 'transparent' : '$background'}>
                  {props.children}
                </YStack>
              </Theme>
            </>
          ) : null}
        </XStack>
      </Theme>
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
    </Provider>
  )
}

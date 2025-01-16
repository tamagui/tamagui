import '@tamagui/core/reset.css'

import * as Demos from '@tamagui/demos'
import React from 'react'
import { Separator, Theme, XStack, YStack } from 'tamagui'
import { Provider } from './provider'
import { Sandbox } from './Sandbox'
import * as TestCases from './usecases'

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

  console.log('rendering')

  return (
    <SandboxFrame centered={!!demoComponentName}>
      <Component />
    </SandboxFrame>
  )
}

const SandboxFrame = (props: { children: any; centered?: boolean }) => {
  const params = new URLSearchParams(window.location.search)
  const [theme, setTheme] = React.useState(
    params.get('theme') === 'dark' ? 'dark' : 'light'
  )
  const [screenshot] = React.useState(params.has('screenshot'))
  const showThemeSwitch = !screenshot
  const splitView = params.has('splitView')
  const centered = props.centered ?? params.has('centered')

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
          <YStack
            {...(centered && {
              ai: 'center',
              jc: 'center',
            })}
            f={1}
            h="100%"
          >
            {props.children}
          </YStack>

          {splitView ? (
            <>
              <Separator vertical />
              <Theme name="dark">
                <YStack
                  f={1}
                  {...(centered && {
                    ai: 'center',
                    jc: 'center',
                    h: '100%',
                  })}
                  bg={screenshot ? 'transparent' : '$background'}
                >
                  {props.children}
                </YStack>
              </Theme>
            </>
          ) : null}
        </XStack>
      </Theme>
      {showThemeSwitch && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
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

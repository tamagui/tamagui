import '@tamagui/core/reset.css'

import { useState } from 'react'
import { Separator, Theme, XStack, YStack } from 'tamagui'

import { Provider } from './components/provider/Provider'
import { list } from './sections/elements/list'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

export default function App() {
  return <Frame>{list()}</Frame>
}

const Frame = (props: { children: any }) => {
  const params = new URLSearchParams(window.location.search)
  const [theme, setTheme] = useState(params.get('theme') === 'dark' ? 'dark' : 'light')
  const [screenshot] = useState(params.has('screenshot'))
  const showThemeSwitch = !screenshot
  const splitView = params.has('splitView')
  const centered = params.has('centered')

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
            html, body, #root { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center;}
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

import '@tamagui/core/reset.css'

import { useState } from 'react'
import { Separator, Theme, View, XStack, YStack } from 'tamagui'
import { useSchemeSetting } from '@vxrn/color-scheme'

import { Provider } from '../src/components/provider/Provider'
import { datepickers } from '../src/sections/elements/datepickers'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

export default function App() {
  return <Frame>{datepickers()}</Frame>
}

const Frame = (props: { children: any }) => {
  const params = new URLSearchParams(window.location.search)
  const [{ scheme: theme }] = useSchemeSetting()

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

      <YStack fullscreen w="100%" ai="center">
        <Theme name={screenshot ? 'whale' : undefined}>
          <View py="$12" w="100%" h="full" maxWidth={1280}>
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
          </View>
        </Theme>
      </YStack>
    </Provider>
  )
}

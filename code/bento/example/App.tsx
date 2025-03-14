import '@tamagui/core/reset.css'

import { useState } from 'react'
import { Separator, Theme, View, XStack, YStack } from 'tamagui'
import { useSchemeSetting } from '@vxrn/color-scheme'

import { Provider } from '../src/components/provider/Provider'
import { accordions as Accordions } from '../src/sections/elements'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

const App = (props: { children: any }) => {
  const [{ scheme: theme }] = useSchemeSetting()

  return (
    <Provider defaultTheme={theme as any}>
      <link href="/fonts/inter.css" rel="stylesheet" />

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `
            html, body, #root { height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center;}
          `,
        }}
      />

      <YStack fullscreen w="100%" ai="center">
        <View py="$12" w="100%" h="full" maxWidth={1280}>
          <YStack w="100%">
            <Accordions isProUser={false} showAppropriateModal={() => {}} />
          </YStack>
        </View>
      </YStack>
    </Provider>
  )
}

export default App

import '@tamagui/core/reset.css'

import { View, YStack } from 'tamagui'
import { useSchemeSetting } from '@vxrn/color-scheme'

import { Provider } from '../src/components/provider/Provider'
import { list as List } from '../src/sections/elements/list'

if (typeof require !== 'undefined') {
  globalThis['React'] = require('react') // webpack
}

const App = () => {
  const params = new URLSearchParams(window.location.search)
  const [{ scheme: theme }] = useSchemeSetting()

  const centered = params.has('centered')

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
          <YStack
            {...(centered && {
              ai: 'center',
              jc: 'center',
            })}
            f={1}
            h="100%"
          ></YStack>
        </View>
      </YStack>
    </Provider>
  )
}

export default App

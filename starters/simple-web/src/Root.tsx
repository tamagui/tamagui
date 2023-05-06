import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import { Button, TamaguiProvider, YStack } from 'tamagui'

import config from './tamagui.config'

export const Root = () => {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <YStack f={1} ai="center" jc="center">
        <Button>Hello world</Button>
      </YStack>
    </TamaguiProvider>
  )
}

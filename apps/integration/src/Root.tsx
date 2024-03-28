import '@tamagui/core/reset.css'

import { H1, TamaguiProvider, YStack } from 'tamagui'
import { LinearGradient } from 'tamagui/linear-gradient'

import config from './tamagui.config'

export const Root = () => {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <YStack f={1} ai="center" jc="center">
        <H1>Hello world</H1>
        <LinearGradient zIndex={-1} fullscreen colors={['red', 'blue']} />
      </YStack>
    </TamaguiProvider>
  )
}

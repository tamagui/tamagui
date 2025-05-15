import '@tamagui/core/reset.css'

import { Text, TamaguiProvider, View } from '@tamagui/core'
import { LinearGradient } from '@tamagui/linear-gradient'

import config from './tamagui.config'

export const Root = () => {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <View fd="column" f={1} ai="center" jc="center">
        <Text tag="h1">Hello world</Text>
        <LinearGradient zIndex={-1} fullscreen colors={['red', 'blue']} />
      </View>
    </TamaguiProvider>
  )
}

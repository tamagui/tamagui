import '@tamagui/core/reset.css'

import { styled, Text, TamaguiProvider, View } from '@tamagui/core'
import { LinearGradient } from '@tamagui/linear-gradient'

import config from './tamagui.config'
import { HmrCandidate } from './HmrCandidate'

const ScannerOwnedFrame = styled(View, 'grid grid-cols-[77px]', {
  name: 'ScannerOwnedFrame',
})

export const Root = () => {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <View flexDirection="column" flex={1} alignItems="center" justifyContent="center">
        <Text render="h1">Hello world</Text>
        <View id="hybrid-cascade" backgroundColor="$dark9" className="bg-blue-500 p-4">
          <Text>Tailwind wins after Tamagui</Text>
        </View>
        <View
          id="hybrid-grid"
          data-state="open"
          className="@container grid w-[400px] grid-cols-2 gap-3 backdrop-blur-sm data-[state=open]:opacity-75 [&>span]:text-red-500"
        >
          <Text id="hybrid-arbitrary-child">Arbitrary child selector</Text>
          <View
            id="hybrid-container-child"
            className="grid grid-cols-1 translate-x-[13px] @[320px]:grid-cols-3"
          />
        </View>
        <ScannerOwnedFrame id="hybrid-scanner-owned" />
        <HmrCandidate />
        <LinearGradient
          zIndex={-1}
          position="absolute"
          inset={0}
          colors={['red', 'blue']}
        />
      </View>
    </TamaguiProvider>
  )
}

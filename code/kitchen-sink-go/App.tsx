import { TamaguiProvider, Theme, View, Text, Button, H1, YStack, XStack } from 'tamagui'
import config from './tamagui.config'

export function App() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <YStack f={1} ai="center" jc="center" bg="$background" gap="$4" p="$4">
        <H1>Tamagui Expo Go Test</H1>
        <Text>If you can see this, themes are working.</Text>

        <XStack gap="$2">
          <Button>Button 1</Button>
          <Button theme="blue">Blue</Button>
        </XStack>

        <Theme name="dark">
          <YStack bg="$background" p="$4" br="$4" gap="$2">
            <Text col="$color">Dark theme nested</Text>
            <Button size="$3">Dark Button</Button>
          </YStack>
        </Theme>

        <View bg="$blue5" p="$4" br="$4">
          <Text col="white">Token colors work</Text>
        </View>
      </YStack>
    </TamaguiProvider>
  )
}

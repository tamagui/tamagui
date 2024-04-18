import { config } from '@tamagui/config/v3'
import { ExternalLink } from '@tamagui/lucide-icons'
import { useState } from 'react'
import {
  Anchor,
  Button,
  H1,
  Paragraph,
  TamaguiProvider,
  XStack,
  YStack,
  createTamagui,
} from 'tamagui'

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui(config)

// make TypeScript type everything based on your config
type Conf = typeof tamaguiConfig
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

// or
// import tamaguiConfig from "../tamagui.config.ts";

function App() {
  const [count, setCount] = useState(0)

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <YStack fullscreen ai="center" jc="center" gap="$8" mx="$10" bg="$alt1">
        <H1>Vite + React + Tamagui</H1>
        <Button onClick={() => setCount((count) => count + 1)}>
          <Paragraph>count is {count}</Paragraph>
        </Button>

        <XStack ai="center" fw="wrap" gap="$1.5" pos="absolute" b="$8">
          <Paragraph fos="$5">Add</Paragraph>

          <Paragraph fos="$5" px="$2" py="$1" col="$blue10Light" bg="$blue5Light" br="$3">
            tamagui.config.ts
          </Paragraph>

          <Paragraph fos="$5">to root and follow the</Paragraph>

          <XStack
            ai="center"
            gap="$1.5"
            px="$2"
            py="$1"
            col="$purple10Light"
            bg="$purple5Light"
            br="$3"
            hoverStyle={{ bg: '$purple6Light' }}
          >
            <Anchor
              href="https://tamagui.dev/docs/core/configuration"
              textDecoration="none"
              col="$purple10Light"
              fos="$5"
            >
              Configuration guide
            </Anchor>
            <ExternalLink size="$1" col="$purple10Light" />
          </XStack>

          <Paragraph fos="$5">to configure your themes and tokens.</Paragraph>
        </XStack>
      </YStack>
    </TamaguiProvider>
  )
}

export default App

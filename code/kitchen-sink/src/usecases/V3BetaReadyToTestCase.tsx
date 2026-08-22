import { View as TailwindView } from '@tamagui/tailwind'
import { useState } from 'react'
import { Button, Text, View, XStack, YStack } from 'tamagui'

export function V3BetaReadyToTestCase() {
  const [transitioned, setTransitioned] = useState(false)

  return (
    <YStack width="100%" height="100%" overflow="auto" items="center" p="4">
      <YStack width="100%" maxWidth={800} gap="6" pb="10">
        <YStack gap="2">
          <Text fontSize="8" fontWeight="700">
            Tamagui V3 beta
          </Text>
          <Text color="color10">
            Runtime checks for flat values, Tailwind class strings, and transitions.
          </Text>
        </YStack>

        <YStack gap="3">
          <Text fontSize="6" fontWeight="700">
            1. Flat value strings
          </Text>
          <Text>
            The first tile is red, turns blue on hover, and has 18px padding at this
            viewport. The second has a later green base shorthand, while its inherited
            blue hover clause survives.
          </Text>
          <XStack gap="4" flexWrap="wrap">
            <View
              data-testid="v3-flat-value"
              width={180}
              height={96}
              p="4 sm:6"
              bg="red hover:blue"
              rounded="12"
            />
            <View
              data-testid="v3-flat-merge"
              width={180}
              height={96}
              backgroundColor="red hover:blue"
              bg="green"
              rounded="12"
            />
          </XStack>
        </YStack>

        <YStack gap="3">
          <Text fontSize="6" fontWeight="700">
            2. Tailwind class strings
          </Text>
          <Text>
            This tile starts half opaque with 18px padding and turns solid blue on hover.
            The kitchen-sink config makes md a max-width condition, so it is 240px wide at
            1020px and below and 160px above that.
          </Text>
          <TailwindView
            testID="v3-tailwind-value"
            className="w-[160px] md:w-[240px] h-[96px] p-4 rounded-[12px] bg-[red] hover:bg-[blue] opacity-50 hover:opacity-100"
          />
          <Text color="color10">
            This webpack page proves Tamagui-owned candidates. Official Tailwind
            passthrough classes require a Vite consumer using @tamagui/tailwind/vite.
          </Text>
        </YStack>

        <YStack gap="3">
          <Text fontSize="6" fontWeight="700">
            3. Transition targets
          </Text>
          <Text>
            Click repeatedly, including once before the motion finishes. Color, padding,
            width, and radius should all move smoothly in both directions. Hovering the
            tile does not trigger this transition.
          </Text>
          <View
            data-testid="v3-transition-value"
            height={96}
            bg={transitioned ? 'green' : 'red'}
            p={`${transitioned ? '6' : '2'}`}
            width={transitioned ? 320 : 160}
            borderRadius={transitioned ? 48 : 8}
            transition="bg 300ms ease, p 300ms ease, width 300ms ease, rounded 300ms ease"
          />
          <Button
            testID="v3-transition-toggle"
            onPress={() => setTransitioned((x) => !x)}
          >
            Toggle transition
          </Button>
        </YStack>
      </YStack>
    </YStack>
  )
}

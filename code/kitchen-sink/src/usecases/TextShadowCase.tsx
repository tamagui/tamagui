import { Text, YStack } from 'tamagui'

export function TextShadowCase() {
  return (
    <YStack padding="$4" gap="$4">
      <Text
        id="text-shadow-basic"
        fontSize="$8"
        color="$color"
        textShadowColor="$shadowColor"
        textShadowOffset={{ width: 2, height: 2 }}
        textShadowRadius={4}
      >
        Basic Text Shadow
      </Text>

      <Text
        id="text-shadow-color"
        fontSize="$8"
        color="$color"
        textShadowColor="red"
        textShadowOffset={{ width: 1, height: 1 }}
        textShadowRadius={2}
      >
        Red Text Shadow
      </Text>

      <Text
        id="text-shadow-large"
        fontSize="$10"
        color="$color"
        textShadowColor="rgba(0,0,0,0.5)"
        textShadowOffset={{ width: 4, height: 4 }}
        textShadowRadius={8}
      >
        Large Shadow
      </Text>
    </YStack>
  )
}

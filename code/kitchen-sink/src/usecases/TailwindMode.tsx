import { View, Text, YStack, XStack } from 'tamagui'

// test tailwind className syntax
// note: this requires styleMode: 'tailwind' in config

const BasicClass = () => (
  <View
    id="tailwind-basic"
    className="w-100 h-50 bg-red"
  />
)

const HoverClass = () => (
  <View
    id="tailwind-hover"
    className="w-100 h-50 bg-green hover:bg-blue"
  />
)

const MediaClass = () => (
  <View
    id="tailwind-media"
    className="w-100 h-50 bg-yellow sm:bg-purple"
  />
)

const TokenClass = () => (
  <View
    id="tailwind-token"
    className="w-100 h-50 bg-$background"
  />
)

const CombinedClass = () => (
  <View
    id="tailwind-combined"
    className="w-100 h-50 bg-gray sm:hover:bg-orange"
  />
)

const MixedClasses = () => (
  <View
    id="tailwind-mixed"
    className="my-custom-class w-100 h-50 bg-pink another-class"
  />
)

export function TailwindMode() {
  return (
    <YStack padding={20} gap={20}>
      <Text>Tailwind className Mode Tests</Text>

      <YStack gap={10}>
        <Text>Basic: w-100 h-50 bg-red</Text>
        <BasicClass />
      </YStack>

      <YStack gap={10}>
        <Text>Hover: hover:bg-blue</Text>
        <HoverClass />
      </YStack>

      <YStack gap={10}>
        <Text>Media: sm:bg-purple</Text>
        <MediaClass />
      </YStack>

      <YStack gap={10}>
        <Text>Token: bg-$background</Text>
        <TokenClass />
      </YStack>

      <YStack gap={10}>
        <Text>Combined: sm:hover:bg-orange</Text>
        <CombinedClass />
      </YStack>

      <YStack gap={10}>
        <Text>Mixed with regular classes</Text>
        <MixedClasses />
      </YStack>
    </YStack>
  )
}

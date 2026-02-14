import { View, Text, YStack, XStack } from 'tamagui'

// test tailwind className syntax
// note: this requires styleMode: 'tailwind' in config
// uses v4 shorthands: bg, m, p, rounded, etc. (no w/h - use full prop names)

const BasicClass = () => (
  <View id="tailwind-basic" className="width-100 height-50 bg-red" />
)

const HoverClass = () => (
  <View id="tailwind-hover" className="width-100 height-50 bg-green hover:bg-blue" />
)

const MediaClass = () => (
  <View id="tailwind-media" className="width-100 height-50 bg-yellow sm:bg-purple" />
)

const TokenClass = () => (
  <View id="tailwind-token" className="width-100 height-50 bg-customBlue" />
)

const CombinedClass = () => (
  <View
    id="tailwind-combined"
    className="width-100 height-50 bg-gray sm:hover:bg-orange"
  />
)

const MixedClasses = () => (
  <View
    id="tailwind-mixed"
    className="my-custom-class width-100 height-50 bg-pink another-class"
  />
)

// visual comparison - tailwind syntax vs regular tamagui syntax (should be identical)
const TailwindVisualBasic = () => (
  <View
    id="tailwind-visual-basic"
    className="width-100 height-100 bg-red rounded-8 p-10"
  />
)

const RegularVisualBasic = () => (
  <View
    id="regular-visual-basic"
    width={100}
    height={100}
    backgroundColor="red"
    borderRadius={8}
    padding={10}
  />
)

const TailwindVisualHover = () => (
  <View
    id="tailwind-visual-hover"
    className="width-100 height-100 bg-green hover:bg-blue"
  />
)

const RegularVisualHover = () => (
  <View
    id="regular-visual-hover"
    width={100}
    height={100}
    backgroundColor="green"
    hoverStyle={{ backgroundColor: 'blue' }}
  />
)

// token-based visual comparisons - use a distinctive token (not $background which is white-on-white)
const TailwindVisualToken = () => (
  <View
    id="tailwind-visual-token"
    className="width-100 height-100 bg-customBlue rounded-8 p-10"
  />
)

const RegularVisualToken = () => (
  <View
    id="regular-visual-token"
    width={100}
    height={100}
    backgroundColor="$customBlue"
    borderRadius={8}
    padding={10}
  />
)

// media query visual comparison
const TailwindVisualMedia = () => (
  <View id="tailwind-visual-media" className="width-100 height-100 bg-red sm:bg-green" />
)

const RegularVisualMedia = () => (
  <View
    id="regular-visual-media"
    width={100}
    height={100}
    backgroundColor="red"
    $sm={{ backgroundColor: 'green' }}
  />
)

export function TailwindMode() {
  return (
    <YStack padding={20} gap={20}>
      <Text>Tailwind className Mode Tests</Text>

      <YStack gap={10}>
        <Text>Basic: width-100 height-50 bg-red</Text>
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
        <Text>Token: bg-customBlue (auto-resolves to $customBlue)</Text>
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

      {/* visual comparison rows - tailwind vs regular should be identical */}
      <YStack gap={8}>
        <Text fontWeight="bold">Visual: Basic (tailwind vs regular)</Text>
        <XStack gap={20} id="tailwind-basic-comparison">
          <TailwindVisualBasic />
          <RegularVisualBasic />
        </XStack>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="bold">Visual: Hover (tailwind vs regular)</Text>
        <XStack gap={20} id="tailwind-hover-comparison">
          <TailwindVisualHover />
          <RegularVisualHover />
        </XStack>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="bold">Visual: Token $customBlue (tailwind vs regular)</Text>
        <XStack gap={20} id="tailwind-token-comparison">
          <TailwindVisualToken />
          <RegularVisualToken />
        </XStack>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="bold">Visual: Media Query (tailwind vs regular)</Text>
        <XStack gap={20} id="tailwind-media-comparison">
          <TailwindVisualMedia />
          <RegularVisualMedia />
        </XStack>
      </YStack>
    </YStack>
  )
}

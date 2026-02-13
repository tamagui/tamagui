import { View, Text, XStack, YStack, styled, Button } from 'tamagui'

// test components with both syntaxes - should render identically

// base styles
const RegularBase = () => (
  <View
    id="regular-base"
    width={100}
    height={100}
    backgroundColor="rgb(255,0,0)"
    padding={10}
    borderRadius={8}
  />
)

const FlatBase = () => (
  <View
    id="flat-base"
    {...{
      '$width': 100,
      '$height': 100,
      '$bg': 'rgb(255,0,0)',
      '$p': 10,
      '$rounded': 8,
    } as any}
  />
)

// hover styles
const RegularHover = () => (
  <View
    id="regular-hover"
    width={100}
    height={100}
    backgroundColor="rgb(0,255,0)"
    hoverStyle={{ backgroundColor: 'rgb(0,0,255)' }}
  />
)

const FlatHover = () => (
  <View
    id="flat-hover"
    width={100}
    height={100}
    {...{
      '$bg': 'rgb(0,255,0)',
      '$hover:bg': 'rgb(0,0,255)',
    } as any}
  />
)

// press styles
const RegularPress = () => (
  <View
    id="regular-press"
    width={100}
    height={100}
    backgroundColor="rgb(0,255,0)"
    pressStyle={{ backgroundColor: 'rgb(255,0,0)' }}
  />
)

const FlatPress = () => (
  <View
    id="flat-press"
    width={100}
    height={100}
    {...{
      '$bg': 'rgb(0,255,0)',
      '$press:bg': 'rgb(255,0,0)',
    } as any}
  />
)

// media query styles
const RegularMedia = () => (
  <View
    id="regular-media"
    width={100}
    height={100}
    backgroundColor="rgb(255,0,0)"
    $sm={{ backgroundColor: 'rgb(0,255,0)' }}
    $md={{ backgroundColor: 'rgb(0,0,255)' }}
  />
)

const FlatMedia = () => (
  <View
    id="flat-media"
    width={100}
    height={100}
    {...{
      '$bg': 'rgb(255,0,0)',
      '$sm:bg': 'rgb(0,255,0)',
      '$md:bg': 'rgb(0,0,255)',
    } as any}
  />
)

// combined media + hover
const RegularMediaHover = () => (
  <View
    id="regular-media-hover"
    width={100}
    height={100}
    backgroundColor="rgb(255,0,0)"
    $sm={{ hoverStyle: { backgroundColor: 'rgb(0,0,255)' } }}
  />
)

const FlatMediaHover = () => (
  <View
    id="flat-media-hover"
    width={100}
    height={100}
    {...{
      '$bg': 'rgb(255,0,0)',
      '$sm:hover:bg': 'rgb(0,0,255)',
    } as any}
  />
)

// styled component with variants
const StyledButton = styled(View, {
  width: 120,
  height: 44,
  backgroundColor: 'rgb(100,100,255)',
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
  hoverStyle: { backgroundColor: 'rgb(80,80,200)' },
  pressStyle: { backgroundColor: 'rgb(60,60,180)', scale: 0.98 },
})

const StyledButtonFlat = styled(View, {
  '$width': 120,
  '$height': 44,
  '$bg': 'rgb(100,100,255)',
  '$rounded': 8,
  '$ai': 'center',
  '$jc': 'center',
  '$hover:bg': 'rgb(80,80,200)',
  '$press:bg': 'rgb(60,60,180)',
  '$press:scale': 0.98,
} as any)

// complex multi-prop
const RegularComplex = () => (
  <View
    id="regular-complex"
    width={150}
    height={150}
    backgroundColor="rgb(200,200,200)"
    padding={16}
    margin={8}
    borderRadius={12}
    borderWidth={2}
    borderColor="rgb(100,100,100)"
    hoverStyle={{
      backgroundColor: 'rgb(180,180,180)',
      borderColor: 'rgb(80,80,80)',
    }}
  />
)

const FlatComplex = () => (
  <View
    id="flat-complex"
    {...{
      '$width': 150,
      '$height': 150,
      '$bg': 'rgb(200,200,200)',
      '$p': 16,
      '$m': 8,
      '$rounded': 12,
      '$borderWidth': 2,
      '$borderColor': 'rgb(100,100,100)',
      '$hover:bg': 'rgb(180,180,180)',
      '$hover:borderColor': 'rgb(80,80,80)',
    } as any}
  />
)

export function FlatModeVisual() {
  return (
    <YStack padding={20} gap={40}>
      {/* each row has regular on left, flat on right - should be identical */}

      <YStack gap={8}>
        <Text fontWeight="bold">Base Styles (should be identical)</Text>
        <XStack gap={20} id="base-comparison">
          <RegularBase />
          <FlatBase />
        </XStack>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="bold">Hover Styles (should be identical)</Text>
        <XStack gap={20} id="hover-comparison">
          <RegularHover />
          <FlatHover />
        </XStack>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="bold">Press Styles (should be identical)</Text>
        <XStack gap={20} id="press-comparison">
          <RegularPress />
          <FlatPress />
        </XStack>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="bold">Media Query Styles (should be identical)</Text>
        <XStack gap={20} id="media-comparison">
          <RegularMedia />
          <FlatMedia />
        </XStack>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="bold">Media + Hover Combined (should be identical)</Text>
        <XStack gap={20} id="media-hover-comparison">
          <RegularMediaHover />
          <FlatMediaHover />
        </XStack>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="bold">Styled Components (should be identical)</Text>
        <XStack gap={20} id="styled-comparison">
          <StyledButton id="regular-styled" />
          <StyledButtonFlat id="flat-styled" />
        </XStack>
      </YStack>

      <YStack gap={8}>
        <Text fontWeight="bold">Complex Multi-prop (should be identical)</Text>
        <XStack gap={20} id="complex-comparison">
          <RegularComplex />
          <FlatComplex />
        </XStack>
      </YStack>
    </YStack>
  )
}

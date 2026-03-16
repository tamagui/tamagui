import { View, Text, XStack, YStack, styled } from 'tamagui'

// styled component with flat props for testing
const StyledFlat = styled(View, {
  $bg: 'rgb(255,0,0)',
  $p: 10,
  $rounded: 8,
} as any)

const StyledFlatHover = styled(View, {
  $bg: 'rgb(0,255,0)',
  '$hover:bg': 'rgb(0,0,255)',
} as any)

const StyledFlatMedia = styled(View, {
  $bg: 'rgb(255,0,0)',
  '$sm:bg': 'rgb(0,255,0)',
} as any)

const StyledFlatCombined = styled(View, {
  $bg: 'rgb(255,0,0)',
  '$sm:hover:bg': 'rgb(0,0,255)',
} as any)

export function FlatMode() {
  return (
    <YStack padding={20} gap={20}>
      {/* base flat props */}
      <View
        id="flat-base"
        width={100}
        height={100}
        {...({ $bg: 'rgb(255,0,0)' } as any)}
      />

      {/* flat with token */}
      <View
        id="flat-token"
        width={100}
        height={100}
        {...({ $bg: '$background' } as any)}
      />

      {/* flat pseudo */}
      <View
        id="flat-hover"
        width={100}
        height={100}
        {...({
          $bg: 'rgb(0,255,0)',
          '$hover:bg': 'rgb(0,0,255)',
        } as any)}
      />

      {/* flat press */}
      <View
        id="flat-press"
        width={100}
        height={100}
        {...({
          $bg: 'rgb(0,255,0)',
          '$press:bg': 'rgb(255,0,0)',
        } as any)}
      />

      {/* flat media - will be green on sm+ */}
      <View
        id="flat-media-sm"
        width={100}
        height={100}
        {...({
          $bg: 'rgb(255,0,0)',
          '$sm:bg': 'rgb(0,255,0)',
        } as any)}
      />

      {/* control: regular syntax for comparison */}
      <View
        id="control-media-sm"
        width={100}
        height={100}
        backgroundColor="rgb(255,0,0)"
        $sm={{ backgroundColor: 'rgb(0,255,0)' }}
      />

      {/* flat combined media + hover */}
      <View
        id="flat-sm-hover"
        width={100}
        height={100}
        {...({
          $bg: 'rgb(255,0,0)',
          '$sm:hover:bg': 'rgb(0,0,255)',
        } as any)}
      />

      {/* flat theme */}
      <View
        id="flat-dark"
        width={100}
        height={100}
        {...({
          $bg: 'rgb(255,0,0)',
          '$dark:bg': 'rgb(0,0,0)',
        } as any)}
      />

      {/* flat platform */}
      <View
        id="flat-web"
        width={100}
        height={100}
        backgroundColor="rgb(255,0,0)"
        {...({
          '$web:cursor': 'pointer',
        } as any)}
      />

      {/* styled component with flat props */}
      <StyledFlat id="styled-flat" width={100} height={100} />

      {/* mixed flat and object syntax */}
      <View
        id="flat-mixed"
        width={100}
        height={100}
        backgroundColor="rgb(255,0,0)"
        hoverStyle={{ opacity: 0.8 }}
        {...({
          '$press:bg': 'rgb(0,255,0)',
        } as any)}
      />

      {/* multiple flat props */}
      <View
        id="flat-multiple"
        width={100}
        height={100}
        {...({
          $bg: 'rgb(255,0,0)',
          $p: 20,
          $m: 10,
          $rounded: 8,
        } as any)}
      />

      {/* flat props with full names and valid shorthands */}
      <View
        id="flat-shorthands"
        {...({
          $width: 100,
          $height: 100,
          $bg: 'rgb(0,255,0)',
          $opacity: 0.8,
        } as any)}
      />
    </YStack>
  )
}

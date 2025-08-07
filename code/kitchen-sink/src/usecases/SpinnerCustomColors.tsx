import { Spinner, YStack, H2, SizableText } from 'tamagui'

export const SpinnerCustomColors = () => {
  return (
    <YStack gap="$4" padding="$4">
      <H2>Spinner with Custom Color Tokens</H2>

      <YStack gap="$4">
        <SizableText>Default Spinner</SizableText>
        <Spinner id="spinner-default" />
      </YStack>

      <YStack gap="$4">
        <SizableText>Custom Red Spinner</SizableText>
        <Spinner id="spinner-custom-red" color="$customRed" />
      </YStack>

      <YStack gap="$4">
        <SizableText>Custom Blue Spinner</SizableText>
        <Spinner id="spinner-custom-blue" color="$customBlue" />
      </YStack>

      <YStack gap="$4">
        <SizableText>Custom Green Spinner</SizableText>
        <Spinner id="spinner-custom-green" color="$customGreen" />
      </YStack>

      <YStack gap="$4">
        <SizableText>Test Something Different Color</SizableText>
        <Spinner id="spinner-test-different" color="$testsomethingdifferent" />
      </YStack>
    </YStack>
  )
}

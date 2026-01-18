import { Spinner, YStack } from 'tamagui'

export function SpinnerDemo() {
  return (
    <YStack p="$3" gap="$4" items="center">
      <Spinner size="small" color="$green10" />
      <Spinner size="large" color="$yellow10" />
    </YStack>
  )
}

import { Spinner, YStack } from 'tamagui'

export function SpinnerDemo() {
  return (
    <YStack padding="$3" space="$4" alignItems="center">
      <Spinner size="small" color="$green10" />
      <Spinner size="large" color="$orange10" />
    </YStack>
  )
}

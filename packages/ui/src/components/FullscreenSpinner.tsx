import { Spinner, SpinnerProps, YStack } from 'tamagui'

export const FullscreenSpinner = (props: SpinnerProps) => {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Spinner {...props} />
    </YStack>
  )
}

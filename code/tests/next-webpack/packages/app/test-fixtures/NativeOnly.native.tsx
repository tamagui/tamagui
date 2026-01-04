import { YStack, Button } from '@my/ui'

export function NativeOnly() {
  return (
    <YStack flex={1} gap="$6" bg="$orange5">
      <Button>Native Only File</Button>
    </YStack>
  )
}

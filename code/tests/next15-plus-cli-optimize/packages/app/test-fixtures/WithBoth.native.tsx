import { YStack, Button } from '@my/ui'

export function WithBoth() {
  return (
    <YStack flex={1} gap="$8" bg="$red5">
      <Button>Native Specific</Button>
    </YStack>
  )
}

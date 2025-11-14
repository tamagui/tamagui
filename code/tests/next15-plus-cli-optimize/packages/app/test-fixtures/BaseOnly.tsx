import { YStack, Button } from '@my/ui'

export function BaseOnly() {
  return (
    <YStack flex={1} gap="$4" bg="$background">
      <Button>Test</Button>
    </YStack>
  )
}

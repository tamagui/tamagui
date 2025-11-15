import { YStack, Button } from '@my/ui'

export function WithBoth() {
  return (
    <YStack flex={1} gap="$8" bg="$blue5">
      <Button>Web Specific</Button>
    </YStack>
  )
}

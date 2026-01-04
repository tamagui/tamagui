import { YStack, Button } from '@my/ui'

export function WithWeb() {
  return (
    <YStack flex={1} gap="$8" bg="$blue5">
      <Button>Web Specific</Button>
    </YStack>
  )
}

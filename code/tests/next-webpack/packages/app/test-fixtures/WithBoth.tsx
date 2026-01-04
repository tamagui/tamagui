import { YStack, Button } from '@my/ui'

export function WithBoth() {
  return (
    <YStack flex={1} gap="$4">
      <Button>Base File Should Not Be Modified</Button>
    </YStack>
  )
}

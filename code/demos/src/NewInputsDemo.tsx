import type { SizeTokens } from 'tamagui'
import { Button, Input, TextArea, XStack, YStack } from 'tamagui'

export function NewInputsDemo() {
  return (
    <YStack width={200} minH={250} overflow="hidden" gap="$2" m="$3" p="$2">
      <InputDemo size="$2" />
      <InputDemo size="$3" />
      <InputDemo size="$4" />
      <TextArea placeholder="Enter your details..." />
    </YStack>
  )
}

function InputDemo(props: { size: SizeTokens }) {
  return (
    <XStack items="center" gap="$2">
      <Input flex={1} size={props.size} placeholder={`Size ${props.size}...`} />
      <Button size={props.size}>Go</Button>
    </XStack>
  )
}

import type { InputSize } from 'tamagui'
import { Button, Input, TextArea, Theme, XStack, YStack } from 'tamagui'

export function NewInputsDemo() {
  return (
    <YStack width={200} minH={250} overflow="hidden" gap="2" m="3" p="2">
      <InputDemo size="xs" />
      <InputDemo size="sm" />
      <InputDemo size="md" />
      <TextArea theme="surface1" placeholder="Enter your details..." />
    </YStack>
  )
}

function InputDemo(props: { size: InputSize }) {
  return (
    <XStack items="center" gap="2">
      <Input
        theme="surface1"
        flex={1}
        size={props.size}
        placeholder={`Size ${props.size}...`}
      />
      <Button size={props.size}>Go</Button>
    </XStack>
  )
}

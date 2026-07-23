import type { SizeTokens } from 'tamagui'
import { Input, TextArea, XStack, YStack } from 'tamagui'
import { Button } from './Button'

export function InputsDemo() {
  return (
    <YStack width={200} minH={250} overflow="hidden" gap="$2" m="$3" p="$2">
      <InputDemo size="$2" />
      <InputDemo size="$3" />
      <InputDemo size="$4" />
      <TextArea theme="surface1" placeholder="Enter your details..." />
    </YStack>
  )
}

function InputDemo(props: { size: SizeTokens }) {
  return (
    <XStack items="center" gap="$2">
      <Input
        theme="surface1"
        flex={1}
        size={props.size}
        placeholder={`Size ${props.size}...`}
      />
      <Button size={props.size === '$2' ? 'small' : 'medium'}>Go</Button>
    </XStack>
  )
}

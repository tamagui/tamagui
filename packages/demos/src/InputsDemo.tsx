import { Button, Input, SizeTokens, TextArea, XStack, YStack } from 'tamagui'

export function InputsDemo() {
  return (
    <YStack space="$2" margin="$3" padding="$2">
      <InputDemo size="$2" />
      <InputDemo size="$3" />
      <InputDemo size="$4" />
      <Input>
        <Input.Start>Start</Input.Start>
        <Input.Start>Start2</Input.Start>
        <Input.End>End</Input.End>
      </Input>

      <Input>
        <Input.Start>Start</Input.Start>
        <Input.Start>Start2</Input.Start>
        <Input.End.Button>End</Input.End.Button>
        <Input.End.Button>End 2</Input.End.Button>
      </Input>
      <TextArea placeholder="Enter your details..." />
    </YStack>
  )
}

function InputDemo(props: { size: SizeTokens }) {
  return (
    <XStack alignItems="center" space="$2">
      <Input flex={1} size={props.size} placeholder={`Size ${props.size}...`} />
      <Button size={props.size}>Go</Button>
    </XStack>
  )
}

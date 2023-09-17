import { useState } from 'react'
import { Button, Input, Paragraph, SizeTokens, TextArea, XStack, YStack } from 'tamagui'

export function InputsDemo() {
  const [toggleButton, setToggleButton] = useState(false)
  return (
    <YStack space="$2" margin="$3" padding="$2">
      <InputDemo size="$2" />
      <InputDemo size="$3" />
      <InputDemo size="$4" />
      <Input size="$2">
        <Input.Start>
          <Paragraph>Start</Paragraph>
        </Input.Start>
        <Input.Start>
          <Paragraph>Start2</Paragraph>
        </Input.Start>
        <Input.End>
          <Paragraph>End</Paragraph>
        </Input.End>
      </Input>
      <Input placeholder="Test adornments...">
        <Input.Start>
          <Paragraph>Start</Paragraph>
        </Input.Start>
        <Input.Start>
          <Paragraph>Start2</Paragraph>
        </Input.Start>
        <Input.End>
          <Paragraph>Test</Paragraph>
        </Input.End>
        <Input.End.Button
          bg={toggleButton ? 'blue' : 'red'}
          onPress={() => setToggleButton(!toggleButton)}
        >
          <Paragraph>End</Paragraph>
        </Input.End.Button>
        <Input.End>
          <Paragraph>Test 2</Paragraph>
        </Input.End>
        <Input.End.Button onPress={() => setToggleButton(!toggleButton)}>
          <Paragraph>End 2</Paragraph>
        </Input.End.Button>
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

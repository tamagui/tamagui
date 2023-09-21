import { useState } from 'react'
import {
  Button,
  Group,
  Input,
  Paragraph,
  SizeTokens,
  TextArea,
  XStack,
  YStack,
} from 'tamagui'

export function InputsDemo() {
  const [toggleButton, setToggleButton] = useState(false)
  return (
    <YStack space="$2" margin="$3" padding="$2">
      <InputDemo size="$2" />
      <InputDemo size="$3" />
      <InputDemo size="$4" />
      <Input size="$5">
        <Input.Start>
          <Paragraph>Start</Paragraph>
        </Input.Start>
        <Input.Start>
          <Paragraph>Start2</Paragraph>
        </Input.Start>
        <Input.Control />
        <Input.End>
          <Paragraph>End</Paragraph>
        </Input.End>
      </Input>
      <Input placeholder="Test adornments..." size="$2">
        <Input.Start>
          <Group orientation="horizontal">
            <Group.Item>
              <Button>First</Button>
            </Group.Item>
            <Group.Item>
              <Button>Second</Button>
            </Group.Item>
            <Group.Item>
              <Button>Third</Button>
            </Group.Item>
          </Group>
        </Input.Start>
        <Input.Control />
        <Input.End>
          <Button>End Button</Button>
          <Button>End Button 2</Button>
          <Button>End Button 3</Button>
        </Input.End>
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

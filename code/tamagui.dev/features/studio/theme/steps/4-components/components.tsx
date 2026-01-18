import {
  Button,
  Card,
  Input,
  Switch,
  TextArea,
  XStack,
  YStack,
  SizableText,
} from 'tamagui'
import type { ReactNode } from 'react'

export type PreviewComponent = {
  name: string
  component: () => ReactNode
}

export const components: PreviewComponent[] = [
  {
    name: 'Button',
    component: () => (
      <XStack gap="$3" flexWrap="wrap">
        <Button>Default</Button>
        <Button theme="blue">Active</Button>
        <Button disabled>Disabled</Button>
        <Button size="$2">Small</Button>
        <Button size="$5">Large</Button>
      </XStack>
    ),
  },
  {
    name: 'Card',
    component: () => (
      <Card borderWidth={1} borderColor="$borderColor" p="$4" width={300} elevation="$2">
        <Card.Header p="$3">
          <XStack justify="space-between" items="center">
            <YStack gap="$1">
              <SizableText size="$5" fontWeight="600">
                Card Title
              </SizableText>
              <SizableText size="$3" color="$color10">
                Card subtitle goes here
              </SizableText>
            </YStack>
          </XStack>
        </Card.Header>
        <Card.Footer p="$3">
          <XStack gap="$3" justify="flex-end">
            <Button size="$3">Cancel</Button>
            <Button size="$3" theme="blue">
              Save
            </Button>
          </XStack>
        </Card.Footer>
      </Card>
    ),
  },
  {
    name: 'Input',
    component: () => (
      <YStack gap="$3" width={300}>
        <Input placeholder="Default input" />
        <Input placeholder="With value" value="Hello world" />
        <Input placeholder="Disabled" disabled />
        <Input placeholder="Invalid" theme="red" />
      </YStack>
    ),
  },
  {
    name: 'Switch',
    component: () => (
      <XStack gap="$4" items="center">
        <Switch />
        <Switch defaultChecked />
        <Switch disabled />
        <Switch disabled defaultChecked />
      </XStack>
    ),
  },
  {
    name: 'TextArea',
    component: () => (
      <YStack gap="$3" width={300}>
        <TextArea placeholder="Enter your message..." />
        <TextArea
          placeholder="With value"
          value="This is a longer text that demonstrates how the TextArea component handles multiple lines of content."
          rows={4}
        />
      </YStack>
    ),
  },
]

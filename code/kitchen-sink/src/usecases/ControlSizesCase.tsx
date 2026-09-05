import { ChevronRight } from '@tamagui/lucide-icons-2'
import {
  Avatar,
  Button,
  Checkbox,
  Input,
  Label,
  ListItem,
  Paragraph,
  RadioGroup,
  Select,
  Square,
  Switch,
  Tabs,
  ToggleGroup,
  XStack,
  YStack,
} from 'tamagui'

/**
 * Every named size on every sized control, rendered so a test can measure
 * that frames fit their text, that controls agree on a height at the same
 * size, and that icons are the size's icon px.
 */
export const CONTROL_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export function ControlSizesCase() {
  return (
    <YStack padding="4" gap="4">
      {/* unsized: must equal md */}
      <Row name="default" size={undefined} />
      {CONTROL_SIZES.map((size) => (
        <Row key={size} name={size} size={size} />
      ))}

      {/* a token key is v2's index into every scale: under v6 `4` is 16px */}
      <XStack gap="3" items="center">
        <Button testID="sizes-button-token-4" size="4">
          Token 4
        </Button>
        <Square testID="sizes-square-5" size="5" backgroundColor="blue-500" />
        <Square testID="sizes-square-md" size="md" backgroundColor="blue-500" />
      </XStack>
    </YStack>
  )
}

function Row({ name, size }: { name: string; size?: (typeof CONTROL_SIZES)[number] }) {
  return (
    <XStack gap="3" items="center" flexWrap="wrap">
      <Paragraph width={60}>{name}</Paragraph>
      <Button testID={`sizes-button-${name}`} size={size} icon={ChevronRight}>
        Button
      </Button>
      <Input testID={`sizes-input-${name}`} size={size} defaultValue="Input" />
      <Select size={size} defaultValue="one">
        <Select.Trigger testID={`sizes-select-${name}`} width={160}>
          <Select.Value />
        </Select.Trigger>
        <Select.Content>
          <Select.Viewport>
            <Select.Item value="one">
              <Select.ItemText>one</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select>
      <Tabs size={size} defaultValue="a">
        <Tabs.List>
          <Tabs.Tab testID={`sizes-tab-${name}`} value="a">
            Tab
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <ToggleGroup type="single">
        <ToggleGroup.Item testID={`sizes-toggle-${name}`} value="a" size={size}>
          <ChevronRight />
        </ToggleGroup.Item>
      </ToggleGroup>
      <Checkbox testID={`sizes-checkbox-${name}`} size={size} />
      <RadioGroup value="a">
        <RadioGroup.Item testID={`sizes-radio-${name}`} size={size} value="a" />
      </RadioGroup>
      <Switch testID={`sizes-switch-${name}`} size={size}>
        <Switch.Thumb />
      </Switch>
      <Label testID={`sizes-label-${name}`} size={size}>
        Label
      </Label>
      <Avatar testID={`sizes-avatar-${name}`} size={size} circular>
        <Avatar.Fallback backgroundColor="blue-500" />
      </Avatar>
      <ListItem
        testID={`sizes-listitem-${name}`}
        size={size}
        title="Item"
        subTitle="Sub"
        width={140}
      />
    </XStack>
  )
}

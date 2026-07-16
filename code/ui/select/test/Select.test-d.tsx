import { Select } from '@tamagui/select'
import { styled } from 'tamagui'

const Trigger = styled(Select.Trigger, { padding: '$2' })
const Value = styled(Select.Value, { color: '$color' })
const Icon = styled(Select.Icon, { width: 16 })
const Group = styled(Select.Group, { gap: '$1' })
const Label = styled(Select.Label, { fontWeight: '600' })
const Item = styled(Select.Item, { padding: '$2' })
const ItemText = styled(Select.ItemText, { color: '$color' })
const ItemIndicator = styled(Select.ItemIndicator, { marginLeft: 'auto' })
const Indicator = styled(Select.Indicator, { backgroundColor: '$background' })
const Viewport = styled(Select.Viewport, { backgroundColor: '$background' })
const ScrollUp = styled(Select.ScrollUpButton, { height: 20 })
const ScrollDown = styled(Select.ScrollDownButton, { height: 20 })
const Separator = styled(Select.Separator, { height: 1 })

type Fruit = 'apple' | 'pear'

export const SelectPartsTypeTest = () => (
  <Select.Root<Fruit>
    defaultValue="apple"
    onValueChange={(value) => {
      const exact: Fruit = value
      void exact
    }}
  >
    <Trigger>
      <Value />
      <Icon />
    </Trigger>
    <Select.Content>
      <ScrollUp />
      <Viewport>
        <Indicator />
        <Group>
          <Label>Fruit</Label>
          <Item value="apple" index={0}>
            <ItemText>Apple</ItemText>
            <ItemIndicator />
          </Item>
          <Separator />
          <Item value="pear" index={1}>
            <ItemText>Pear</ItemText>
          </Item>
        </Group>
      </Viewport>
      <ScrollDown />
    </Select.Content>
  </Select.Root>
)

// @ts-expect-error root values stay within the explicit literal union
export const InvalidSelectValue = () => <Select.Root<Fruit> value="orange" />

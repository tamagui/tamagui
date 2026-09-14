import { Label, XStack, YStack, styled, withStaticProperties } from 'tamagui'

import { RadioGroup as RadioGroupBehavior } from '@tamagui/radio-group'

const RADIO_GROUP_ITEM_NAME = 'RadioGroupItem'

const RadioGroupItemFrame = styled(RadioGroupBehavior.Item, {
  displayName: RADIO_GROUP_ITEM_NAME,
  render: 'button',
  rounded: 1000,
  bg: 'background hover:background-hover press:background-focus focus:background-hover',
  items: 'center',
  justify: 'center',
  borderWidth: 1,
  borderColor:
    'border-color hover:border-color-hover press:border-color-focus focus:border-color-hover',
  p: 0,
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  outlineColor: 'focus-visible:outline-color',
  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
        userSelect: 'none',
        cursor: 'not-allowed',
        borderColor: 'hover:border-color press:border-color',
        bg: 'hover:background press:background',
        outlineWidth: 'focus-visible:0px',
      },
    },
  },
} as const)

const RADIO_GROUP_INDICATOR_NAME = 'RadioGroupIndicator'

const RadioGroupIndicatorFrame = styled(RadioGroupBehavior.Indicator, {
  displayName: RADIO_GROUP_INDICATOR_NAME,
  width: '53%',
  height: '53%',
  rounded: 1000,
  bg: 'color',
})

const RADIO_GROUP_NAME = 'RadioGroup'

const RadioGroupFrame = styled(RadioGroupBehavior, {
  displayName: RADIO_GROUP_NAME,
  variants: {
    orientation: {
      horizontal: {
        flexDirection: 'row',
        spaceDirection: 'horizontal',
      },
      vertical: {
        flexDirection: 'column',
        spaceDirection: 'vertical',
      },
    },
  } as const,
})

const RadioGroup = withStaticProperties(RadioGroupFrame, {
  Item: RadioGroupItemFrame,
  Indicator: RadioGroupIndicatorFrame,
})

export function RadioGroupCustomDemo() {
  return (
    <RadioGroup aria-labelledby="Select one item" defaultValue="3" name="form">
      <YStack width={200} items="center" gap="2">
        <RadioGroupItemWithLabel value="2" label="Option One" />
        <RadioGroupItemWithLabel value="3" label="Option Two" />
      </YStack>
    </RadioGroup>
  )
}

function RadioGroupItemWithLabel(props: { value: string; label: string }) {
  const id = `radiogroup-${props.value}`
  return (
    <XStack width={300} items="center" gap="4">
      <RadioGroup.Item value={props.value} id={id}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label htmlFor={id}>{props.label}</Label>
    </XStack>
  )
}

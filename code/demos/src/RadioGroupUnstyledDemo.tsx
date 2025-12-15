import { Label, XStack, YStack, styled } from 'tamagui'

import { createRadioGroup } from '@tamagui/radio-group'

const RADIO_GROUP_ITEM_NAME = 'RadioGroupItem'

const RadioGroupItemFrame = styled(YStack, {
  name: RADIO_GROUP_ITEM_NAME,
  render: 'button',

  rounded: 1000,
  bg: '$background',
  items: 'center',
  justify: 'center',
  borderWidth: 1,
  borderColor: '$borderColor',
  p: 0,

  hoverStyle: {
    borderColor: '$borderColorHover',
    bg: '$backgroundHover',
  },

  focusStyle: {
    borderColor: '$borderColorHover',
    bg: '$backgroundHover',
  },

  focusVisibleStyle: {
    outlineStyle: 'solid',
    outlineWidth: 2,
    outlineColor: '$outlineColor',
  },

  pressStyle: {
    borderColor: '$borderColorFocus',
    bg: '$backgroundFocus',
  },

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
        userSelect: 'none',
        cursor: 'not-allowed',

        hoverStyle: {
          borderColor: '$borderColor',
          bg: '$background',
        },

        pressStyle: {
          borderColor: '$borderColor',
          bg: '$background',
        },

        focusVisibleStyle: {
          outlineWidth: 0,
        },
      },
    },
  },
} as const)

const RADIO_GROUP_INDICATOR_NAME = 'RadioGroupIndicator'

const RadioGroupIndicatorFrame = styled(YStack, {
  name: RADIO_GROUP_INDICATOR_NAME,
  width: '53%',
  height: '53%',
  rounded: 1000,
  bg: '$color',
})

const RADIO_GROUP_NAME = 'RadioGroup'

const RadioGroupFrame = styled(YStack, {
  name: RADIO_GROUP_NAME,
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

const RadioGroup = createRadioGroup({
  Frame: RadioGroupFrame,
  Indicator: RadioGroupIndicatorFrame,
  Item: RadioGroupItemFrame,
})

export function RadioGroupUnstyledDemo() {
  return (
    <RadioGroup aria-labelledby="Select one item" defaultValue="3" name="form">
      <YStack width={200} items="center" gap="$2">
        <RadioGroupItemWithLabel value="2" label="Option One" />
        <RadioGroupItemWithLabel value="3" label="Option Two" />
      </YStack>
    </RadioGroup>
  )
}

function RadioGroupItemWithLabel(props: {
  value: string
  label: string
}) {
  const id = `radiogroup-${props.value}`
  return (
    <XStack width={300} items="center" gap="$4">
      <RadioGroup.Item value={props.value} id={id}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label htmlFor={id}>{props.label}</Label>
    </XStack>
  )
}

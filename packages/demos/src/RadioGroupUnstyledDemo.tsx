import type { SizeTokens } from 'tamagui'
import { Label, ThemeableStack, XStack, YStack, styled } from 'tamagui'

import { createRadioGroup } from '@tamagui/radio-group'

const RADIO_GROUP_ITEM_NAME = 'RadioGroupItem'

const RadioGroupItemFrame = styled(ThemeableStack, {
  name: RADIO_GROUP_ITEM_NAME,
  tag: 'button',

  borderRadius: 1000,
  backgroundColor: '$background',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '$borderColor',
  padding: 0,

  hoverStyle: {
    borderColor: '$borderColorHover',
    backgroundColor: '$backgroundHover',
  },

  focusStyle: {
    borderColor: '$borderColorHover',
    backgroundColor: '$backgroundHover',
  },

  focusVisibleStyle: {
    outlineStyle: 'solid',
    outlineWidth: 2,
    outlineColor: '$outlineColor',
  },

  pressStyle: {
    borderColor: '$borderColorFocus',
    backgroundColor: '$backgroundFocus',
  },

  variants: {
    disabled: {
      true: {
        pointerEvents: 'none',
        userSelect: 'none',
        cursor: 'not-allowed',

        hoverStyle: {
          borderColor: '$borderColor',
          backgroundColor: '$background',
        },

        pressStyle: {
          borderColor: '$borderColor',
          backgroundColor: '$background',
        },

        focusVisibleStyle: {
          outlineWidth: 0,
        },
      },
    },
  },
} as const)

const RADIO_GROUP_INDICATOR_NAME = 'RadioGroupIndicator'

const RadioGroupIndicatorFrame = styled(ThemeableStack, {
  name: RADIO_GROUP_INDICATOR_NAME,
  width: '53%',
  height: '53%',
  borderRadius: 1000,
  backgroundColor: '$color',
  pressTheme: true,
})

const RADIO_GROUP_NAME = 'RadioGroup'

const RadioGroupFrame = styled(ThemeableStack, {
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
      <YStack width={200} alignItems="center" space="$2">
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
    <XStack width={300} alignItems="center" gap="$4">
      <RadioGroup.Item value={props.value} id={id}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>

      <Label htmlFor={id}>{props.label}</Label>
    </XStack>
  )
}

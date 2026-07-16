import { RadioGroup as RadioGroupBehavior } from '@tamagui/radio-group'
import { getVariableValue, resolveTokenSize, styled, withStaticProperties } from 'tamagui'

const RadioGroupItem = styled(RadioGroupBehavior.Item, {
  name: 'SiteRadioGroupItem',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderRadius: 1000,
  borderWidth: 1,

  hoverStyle: {
    backgroundColor: '$backgroundHover',
    borderColor: '$borderColorHover',
  },

  pressStyle: {
    backgroundColor: '$backgroundPress',
    borderColor: '$borderColorPress',
  },

  focusVisibleStyle: {
    outlineColor: '$outlineColor',
    outlineStyle: 'solid',
    outlineWidth: 2,
  },

  variants: {
    size: {
      Size: (value, extras) => {
        const size = Math.round(
          getVariableValue(
            resolveTokenSize(value, { tokens: extras.tokens, font: extras.font! }).frame
              .size
          ) * 0.5
        )
        return {
          width: size,
          height: size,
        }
      },
    },

    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
    },
  } as const,
})

const RadioGroupIndicator = styled(RadioGroupBehavior.Indicator, {
  name: 'SiteRadioGroupIndicator',
  width: '50%',
  height: '50%',
  borderRadius: 1000,
  backgroundColor: '$color',
})

export const RadioGroup = withStaticProperties(RadioGroupBehavior, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
})

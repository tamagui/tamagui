import { RadioGroup as RadioGroupBehavior } from '@tamagui/radio-group'
import { getVariableValue, resolveTokenSize, styled, withStaticProperties } from 'tamagui'

const RadioGroupItem = styled(RadioGroupBehavior.Item, {
  displayName: 'SiteRadioGroupItem',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'background hover:background-hover press:background-press',
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
  borderRadius: 1000,
  borderWidth: 1,
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: styled.dynamic<any>((value, env) => {
      const size = Math.round(
        getVariableValue(
          resolveTokenSize(value, { tokens: env.tokens, font: env.font! }).frame.size
        ) * 0.5
      )
      return {
        width: size,
        height: size,
      }
    }),

    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
    },
  } as const,
})

const RadioGroupIndicator = styled(RadioGroupBehavior.Indicator, {
  displayName: 'SiteRadioGroupIndicator',
  width: '50%',
  height: '50%',
  borderRadius: 1000,
  backgroundColor: 'color',
})

export const RadioGroup = withStaticProperties(RadioGroupBehavior, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
})

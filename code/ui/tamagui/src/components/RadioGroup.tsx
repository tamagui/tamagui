import { getSize } from '@tamagui/get-token'
import {
  getVariableValue,
  type GetProps,
  RadioGroup as RadioGroupBehavior,
  styled,
  withStaticProperties,
} from '@tamagui/ui'

export const RadioGroupFrame = styled(RadioGroupBehavior, {
  name: 'RadioGroup',
})

export const RadioGroupItem = styled(RadioGroupBehavior.Item, {
  name: 'RadioGroupItem',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'background hover:background-hover press:background-focus',
  borderColor:
    'border-color hover:border-color-hover press:border-color-focus focus:border-color-hover',
  borderRadius: 1000,
  borderWidth: 1,
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  padding: 0,
  variants: {
    size: {
      Size: (size) => {
        const controlSize = Math.floor(getVariableValue(getSize(size)) * 0.5)
        return {
          width: controlSize,
          height: controlSize,
        }
      },
    },

    disabled: {
      true: {
        cursor: 'not-allowed',
        outlineWidth: 0,
      },
    },
  } as const,
})

export const RadioGroupIndicator = styled(RadioGroupBehavior.Indicator, {
  name: 'RadioGroupIndicator',
  width: '33%',
  height: '33%',
  borderRadius: 1000,
  backgroundColor: 'color',
})

export const RadioGroup = withStaticProperties(RadioGroupFrame, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
})

export type RadioGroupProps = GetProps<typeof RadioGroup>

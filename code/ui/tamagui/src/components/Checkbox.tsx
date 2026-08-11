import { getSize } from '@tamagui/get-token'
import {
  Checkbox as CheckboxBehavior,
  getVariableValue,
  type GetProps,
  styled,
  withStaticProperties,
} from '@tamagui/ui'

export const CheckboxFrame = styled(CheckboxBehavior, {
  name: 'Checkbox',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'background press:background-press',
  borderColor:
    'border-color hover:border-color-hover press:border-color-press focus:border-color-focus',
  borderWidth: 1,
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: {
      Size: (size) => {
        const tokenSize = getVariableValue(getSize(size))
        const controlSize = Math.round(tokenSize * 0.45)
        return {
          width: controlSize,
          height: controlSize,
          borderRadius: tokenSize / 8,
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

export const CheckboxIndicator = styled(CheckboxBehavior.Indicator, {
  name: 'CheckboxIndicator',
  alignItems: 'center',
  justifyContent: 'center',
})

export const Checkbox = withStaticProperties(CheckboxFrame, {
  Indicator: CheckboxIndicator,
})

export type CheckboxProps = GetProps<typeof Checkbox>

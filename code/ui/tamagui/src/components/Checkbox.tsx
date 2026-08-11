import {
  Checkbox as CheckboxBehavior,
  getVariableValue,
  type GetProps,
  resolveTokenSize,
  styled,
  type VariantSpreadExtras,
  withStaticProperties,
} from '@tamagui/ui'

export const CheckboxFrame = styled(CheckboxBehavior, {
  name: 'Checkbox',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'background press:background-press',
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
  borderWidth: 1,
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: {
      Size: (size, extras: VariantSpreadExtras<any>) => {
        const controlSize = Math.round(
          getVariableValue(
            resolveTokenSize(size, { tokens: extras.tokens, font: extras.font! }).frame
              .size
          ) * 0.5
        )
        return {
          width: controlSize,
          height: controlSize,
          borderRadius: Math.max(3, Math.round(controlSize / 5)),
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

export const CheckboxIndicator = styled(CheckboxBehavior.Indicator, {
  name: 'CheckboxIndicator',
  alignItems: 'center',
  justifyContent: 'center',
})

export const Checkbox = withStaticProperties(CheckboxFrame, {
  Indicator: CheckboxIndicator,
})

export type CheckboxProps = GetProps<typeof Checkbox>

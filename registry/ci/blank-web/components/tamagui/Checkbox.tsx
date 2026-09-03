import {
  Checkbox as CheckboxBehavior,
  type GetProps,
  resolveSize,
  styled,
  withStaticProperties,
} from '@tamagui/ui'

export const CheckboxFrame = styled(CheckboxBehavior, {
  displayName: 'Checkbox',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'background press:background-press',
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
  borderWidth: 1,
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: styled.dynamic<any>((size, env) => {
      // the check is an icon, so the box is the size's icon square
      const controlSize = resolveSize(size, env).icon
      return {
        width: controlSize,
        height: controlSize,
        borderRadius: Math.max(3, Math.round(controlSize / 5)),
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

export const CheckboxIndicator = styled(CheckboxBehavior.Indicator, {
  displayName: 'CheckboxIndicator',
  alignItems: 'center',
  justifyContent: 'center',
})

export const Checkbox = withStaticProperties(CheckboxFrame, {
  Indicator: CheckboxIndicator,
})

export type CheckboxProps = GetProps<typeof Checkbox>

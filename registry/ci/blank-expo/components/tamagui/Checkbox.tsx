import { Checkbox as CheckboxBehavior } from '@tamagui/checkbox'
import {
  type ComponentSize,
  type GetProps,
  resolveSizing,
  styled,
  withStaticProperties,
} from '@tamagui/core'

export type CheckboxSize = ComponentSize | boolean

// the box reads as a control next to its label: the ladder's square
// derivation at the rung's radius. RadioGroup.tsx and Switch.tsx use the same
// heights so the three read as one weight at one size
const getCheckboxSize = styled.dynamic<CheckboxSize>((val, env) => {
  const sizing = resolveSizing(val, env)
  if (!sizing) return
  return {
    width: sizing.square,
    height: sizing.square,
    borderRadius: sizing.radius,
  }
})

export const CheckboxFrame = styled(CheckboxBehavior, {
  displayName: 'Checkbox',
  // checked swaps the whole frame onto the brand theme, so the fill, the border
  // and the check glyph (icons read theme.color, they do not inherit CSS color)
  // all move together. the same convention drives Switch and ToggleGroup.Item.
  activeTheme: 'brand',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'background press:background-press',
  borderColor: 'border-color hover:border-color-hover press:border-color-press',
  borderWidth: 1,
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: getCheckboxSize,

    disabled: {
      true: {
        cursor: 'not-allowed',
        opacity: 0.45,
      },
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
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

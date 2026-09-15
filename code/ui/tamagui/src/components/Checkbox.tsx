import { Checkbox as CheckboxBehavior } from '@tamagui/checkbox'
import { type GetProps, type SizeName, styled, withStaticProperties } from '@tamagui/core'

export type CheckboxSize = SizeName | boolean

// the box reads as a control next to its label, so it sits a step above the
// icon square the check glyph is drawn at: 1.4 times the 12/14/16/18/20 icon
// ladder. RadioGroup.tsx and Switch.tsx use the same heights so the three read
// as one weight at one size
const checkboxSize = {
  xs: { width: 17, height: 17, borderRadius: 4 },
  sm: { width: 20, height: 20, borderRadius: 5 },
  md: { width: 22, height: 22, borderRadius: 6 },
  lg: { width: 25, height: 25, borderRadius: 6 },
  xl: { width: 28, height: 28, borderRadius: 7 },
} as const

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
    size: {
      ...checkboxSize,
      true: checkboxSize.md,
    },

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

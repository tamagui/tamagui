import { Checkbox as CheckboxBehavior } from '@tamagui/checkbox'
import { type GetProps, resolveSize, styled, withStaticProperties } from '@tamagui/core'

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
    size: styled.dynamic<any>((size, env) => {
      // the box reads as a control next to its label, so it sits a step above
      // the icon square the check glyph is drawn at (Switch.tsx uses the same
      // 1.4 for its track, so the two read as the same weight at one size)
      const controlSize = Math.round(resolveSize(size, env).icon * 1.4)
      return {
        width: controlSize,
        height: controlSize,
        borderRadius: Math.max(4, Math.round(controlSize / 4)),
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

import {
  type GetProps,
  resolveSizing,
  type SizeName,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import { RadioGroup as RadioGroupBehavior } from '@tamagui/radio-group'

export type RadioGroupSize = SizeName | boolean

// a radio reads as a control next to its label, so it matches the checkbox
// square and the switch track height rather than the icon square (the same
// derivation as Checkbox.tsx)
const radioSize = styled.dynamic<RadioGroupSize>((val, env) => {
  const side = resolveSizing(val, env).square
  return { width: side, height: side }
})

export const RadioGroupFrame = styled(RadioGroupBehavior, {
  displayName: 'RadioGroup',
})

export const RadioGroupItem = styled(RadioGroupBehavior.Item, {
  displayName: 'RadioGroupItem',
  // selected swaps the whole item onto the brand theme, the same convention
  // Checkbox, Switch and ToggleGroup.Item use, so the four read as one family
  activeTheme: 'brand',
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
    size: radioSize,

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

export const RadioGroupIndicator = styled(RadioGroupBehavior.Indicator, {
  displayName: 'RadioGroupIndicator',
  width: '50%',
  height: '50%',
  borderRadius: 1000,
  backgroundColor: 'color',
})

export const RadioGroup = withStaticProperties(RadioGroupFrame, {
  Item: RadioGroupItem,
  Indicator: RadioGroupIndicator,
})

export type RadioGroupProps = GetProps<typeof RadioGroup>

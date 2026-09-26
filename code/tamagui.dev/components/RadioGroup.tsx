import { RadioGroup as RadioGroupBehavior } from '@tamagui/radio-group'
import { styled, withStaticProperties } from 'tamagui'

export type SiteRadioSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | boolean

// the old recipe's icon px per name: the site radio is the icon square, not
// the checkbox square the registry skin uses
const radioSize = {
  xs: { width: 12, height: 12 },
  sm: { width: 16, height: 16 },
  md: { width: 16, height: 16 },
  lg: { width: 16, height: 16 },
  xl: { width: 20, height: 20 },
} as const

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
    size: {
      ...radioSize,
      true: radioSize.md,
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

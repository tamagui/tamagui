import { type GetProps, resolveSize, styled, withStaticProperties } from '@tamagui/core'
import { RadioGroup as RadioGroupBehavior } from '@tamagui/radio-group'

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
    size: styled.dynamic<any>((size, env) => {
      // a radio reads as a control next to its label, so it matches the
      // checkbox square and the switch track rather than the icon square
      // (Checkbox.tsx and Switch.tsx use the same 1.4)
      const controlSize = Math.round(resolveSize(size, env).icon * 1.4)
      return {
        width: controlSize,
        height: controlSize,
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

import {
  getVariableValue,
  type GetProps,
  RadioGroup as RadioGroupBehavior,
  resolveTokenSize,
  styled,
  type VariantSpreadExtras,
  withStaticProperties,
} from '@tamagui/ui'

export const RadioGroupFrame = styled(RadioGroupBehavior, {
  displayName: 'RadioGroup',
})

export const RadioGroupItem = styled(RadioGroupBehavior.Item, {
  displayName: 'RadioGroupItem',
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

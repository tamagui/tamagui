import {
  type GetProps,
  RadioGroup as RadioGroupBehavior,
  resolveSize,
  styled,
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
    size: styled.dynamic<any>((size, env) => {
      // the check is an icon, so the box is the size's icon square
      const controlSize = resolveSize(size, env).icon
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

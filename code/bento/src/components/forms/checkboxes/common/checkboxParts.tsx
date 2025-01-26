import type { RovingFocusGroupProps, RovingFocusItemProps } from '@tamagui/roving-focus'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import type { KeyboardEvent, PropsWithChildren } from 'react'
import { forwardRef } from 'react'
import type { CheckedState, YStackProps } from 'tamagui'
import {
  Group,
  H2,
  Checkbox as TCheckbox,
  styled,
  withStaticProperties,
  isWeb,
  createStyledContext,
  Label,
  View,
} from 'tamagui'

const CheckboxesContext = createStyledContext<{
  values: Record<string, boolean>
  onValuesChange: (values: Record<string, boolean>) => void
}>({
  values: {},
  onValuesChange: () => {},
})

const FocusGroup = forwardRef<React.ElementRef<typeof View>, RovingFocusGroupProps>(
  (props, ref) => {
    return (
      <RovingFocusGroup
        focusable
        outlineOffset={1}
        focusStyle={{
          zIndex: 1000,
        }}
        {...props}
        ref={ref}
      />
    )
  }
)

const FocusItemContext = createStyledContext({
  value: '',
})

const FocusGroupItem = forwardRef<any, RovingFocusItemProps & { value: string }>(
  (props, ref) => {
    const { value, ...rest } = props
    const { values, onValuesChange } = CheckboxesContext.useStyledContext()

    const attrs = {
      focusable: true,
      outlineOffset: 1,
      flexShrink: 1,
      focusStyle: {
        zIndex: 1,
      },
      ...(isWeb && {
        onKeyDown: (e: KeyboardEvent) => {
          if (e.target !== e.currentTarget) return
          if (e.key === 'Enter' || e.code === 'Space') {
            onValuesChange({ ...values, [value]: !values[value] })
          }
        },
      }),
      onPress: () => {
        onValuesChange({ ...values, [value]: !values[value] })
      },
      ...rest,
    }

    return (
      <FocusItemContext.Provider value={value}>
        <RovingFocusGroup.Item ref={ref} {...attrs} />
      </FocusItemContext.Provider>
    )
  }
)

const RadiusGroup = styled(Group, {
  orientation: 'vertical',
})

const Title = styled(H2, {
  size: '$9',
  paddingBottom: '$4',
  borderBottomWidth: 0.5,
  borderBottomColor: '$borderColor',
})

type CheckboxesProps<K extends string> = {
  values: Record<K, boolean>
  onValuesChange: (values: Record<K, boolean>) => void
} & YStackProps

const CheckboxesImp = <K extends string>(
  props: PropsWithChildren<CheckboxesProps<K>>
) => {
  const { values, onValuesChange, ...rest } = props

  return (
    <CheckboxesContext.Provider values={values} onValuesChange={onValuesChange}>
      <View {...rest} />
    </CheckboxesContext.Provider>
  )
}

const Checkbox = TCheckbox.styleable((props, ref) => {
  const { checked: userChecked, onCheckedChange, ...rest } = props
  const { values, onValuesChange } = CheckboxesContext.useStyledContext()
  const { value: focusItemValue } = FocusItemContext.useStyledContext()

  const attrs = {
    checked: values[focusItemValue],
    onCheckedChange: (checked: CheckedState) => {
      onValuesChange({
        ...values,
        [focusItemValue]:
          typeof checked === 'boolean' ? checked : !values[focusItemValue],
      })
    },
    ...rest,
  }

  return <TCheckbox ref={ref} value={focusItemValue} {...rest} {...attrs} />
})

type CardProps = {
  unstyled?: boolean
}

const CardFrame = styled(View, {
  cursor: 'pointer',
  width: '100%',
  borderRadius: '$4',
  padding: '$3',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderWidth: 1,
  focusStyle: {
    backgroundColor: '$backgroundFocus',
    borderColor: '$borderColorFocus',
  },
  hoverStyle: {
    backgroundColor: '$backgroundHover',
    borderColor: '$borderColorHover',
  },

  ...(process.env.TAMAGUI_TARGET === 'web' && {
    pressStyle: {
      backgroundColor: '$backgroundPress',
      borderColor: '$borderColorPress',
    },
  }),

  variants: {
    active: {
      true: {
        backgroundColor: '$backgroundFocus',
        borderColor: '$borderColorFocus',
      },
    },
  } as const,
})

const Card = CardFrame.styleable<CardProps>((props, ref) => {
  const { ...rest } = props
  const { values } = CheckboxesContext.useStyledContext()
  const { value } = FocusItemContext.useStyledContext()

  const selected = values[value]

  return <CardFrame ref={ref} active={selected} {...rest} />
})

export const Checkboxes = withStaticProperties(CheckboxesImp, {
  Group: withStaticProperties(RadiusGroup, {
    Item: Group.Item,
  }),
  /** FocusGroup is necessary for keyboard arrow navigation */
  FocusGroup: withStaticProperties(FocusGroup, {
    Item: FocusGroupItem,
  }),
  Title,
  Checkbox: withStaticProperties(Checkbox, {
    Indicator: TCheckbox.Indicator,
    Label,
  }),
  Card,
})

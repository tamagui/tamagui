import { type ComponentSize, resolveSizing } from '@tamagui/core'
import type { RovingFocusGroupProps, RovingFocusItemProps } from '@tamagui/roving-focus'
import { RovingFocusGroup } from '@tamagui/roving-focus'
import type { KeyboardEvent, PropsWithChildren } from 'react'
import { createContext, forwardRef, useContext } from 'react'
import type { CheckedState, YStackProps } from 'tamagui'
import {
  createStyledHOC,
  H2,
  Checkbox as TCheckbox,
  styled,
  useGetThemedIcon,
  useTheme,
  withStaticProperties,
  isWeb,
  createStyledContext,
  Label,
  View,
  Group,
} from 'tamagui'

const CheckboxesContext = createStyledContext<{
  values: Record<string, boolean>
  onValuesChange: (values: Record<string, boolean>) => void
}>({
  values: {},
  onValuesChange: () => {},
})

const FocusGroup = forwardRef<any, RovingFocusGroupProps>((props, ref) => {
  return (
    <RovingFocusGroup
      tabIndex={0}
      outlineOffset={1}
      z="focus:1000px"
      {...props}
      ref={ref}
    />
  )
})

const FocusItemContext = createStyledContext({
  value: '',
})

const FocusGroupItem = forwardRef<any, RovingFocusItemProps & { value: string }>(
  (props, ref) => {
    const { value, ...rest } = props
    const { values, onValuesChange } = CheckboxesContext.useStyledContext()

    const attrs = {
      tabIndex: 0,
      outlineOffset: 1,
      flexShrink: 1,
      z: 'focus:1' as const,
      ...(isWeb && {
        onKeyDown: (e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.code === 'Space') {
            e.preventDefault()
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
  fontSize: '2xl',
  lineHeight: '2xl',
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

// tamagui's styled Checkbox sizes the box from the size ladder; its Indicator
// does not size the glyph, so a bare <Check /> would render at lucide's 24px
const CheckboxSizeContext = createContext<ComponentSize>('md')

type CheckboxSkinProps = React.ComponentProps<typeof TCheckbox>

function CheckboxSkinFrame(props: CheckboxSkinProps) {
  return (
    <CheckboxSizeContext.Provider value={(props.size as ComponentSize) || 'md'}>
      {/* an empty box needs more contrast than a card edge to read as a control */}
      <TCheckbox borderColor="color-8 hover:color-9" {...props} />
    </CheckboxSizeContext.Provider>
  )
}

const BaseCheckboxIndicator = TCheckbox.Indicator

function CheckboxIndicator({
  children,
  ...props
}: React.ComponentProps<typeof BaseCheckboxIndicator>) {
  const size = useContext(CheckboxSizeContext)
  const theme = useTheme()
  const getThemedIcon = useGetThemedIcon({
    size: resolveSizing(size).icon,
    color: theme.color,
  })
  return (
    <BaseCheckboxIndicator {...props}>{getThemedIcon(children)}</BaseCheckboxIndicator>
  )
}

export const CheckboxSkin = withStaticProperties(CheckboxSkinFrame, {
  Indicator: CheckboxIndicator,
})

const Checkbox = createStyledHOC(TCheckbox, (props, ref) => {
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

  return <CheckboxSkin ref={ref} value={focusItemValue} {...rest} {...attrs} />
})

type CardProps = React.ComponentProps<typeof CardFrame>

const CardFrame = styled(View, {
  cursor: 'pointer',
  width: '100%',
  rounded: '4',
  p: '3',
  bg: 'background hover:background-hover focus:background-focus press:background-press',
  borderColor:
    'border-color hover:border-color-hover focus:border-color-focus press:border-color-press',
  borderWidth: 1,
  variants: {
    active: {
      true: {
        backgroundColor: 'background-focus',
        borderColor: 'border-color-focus',
      },
    },
  } as const,
})

const Card = createStyledHOC(CardFrame, (props: CardProps, ref) => {
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
    Indicator: CheckboxIndicator,
    Label,
  }),
  Card,
})

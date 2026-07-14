import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons-2'
import {
  Select as SelectBehavior,
  type SelectProps as SelectBehaviorProps,
  type SelectScopedProps,
} from '@tamagui/select'
import { createSizeTable, styled, withStaticProperties } from 'tamagui'

export const selectSizes = createSizeTable(
  {
    small: {
      frame: { gap: 6, height: 32, paddingHorizontal: 10 },
      text: { fontSize: 13, lineHeight: 18 },
      icon: 14,
    },
    medium: {
      frame: { gap: 8, height: 38, paddingHorizontal: 12 },
      text: { fontSize: 15, lineHeight: 20 },
      icon: 16,
    },
    large: {
      frame: { gap: 10, height: 46, paddingHorizontal: 16 },
      text: { fontSize: 17, lineHeight: 24 },
      icon: 20,
    },
  } as const,
  'medium'
)

export type SelectSize = keyof typeof selectSizes.values

export const SelectTrigger = styled(SelectBehavior.Trigger, {
  context: selectSizes.Context,
  name: 'KitchenSelectTrigger',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderRadius: 8,
  borderWidth: 1,
  justifyContent: 'space-between',

  hoverStyle: { backgroundColor: '$backgroundHover', borderColor: '$borderColorHover' },
  pressStyle: { backgroundColor: '$backgroundPress' },
  focusVisibleStyle: {
    outlineColor: '$outlineColor',
    outlineStyle: 'solid',
    outlineWidth: 2,
  },

  variants: { size: selectSizes.frame } as const,
  defaultVariants: { size: 'medium' },
})

export const SelectValue = styled(SelectBehavior.Value, {
  context: selectSizes.Context,
  name: 'KitchenSelectValue',
  color: '$color',
  ellipsis: true,
  variants: { size: selectSizes.text } as const,
  defaultVariants: { size: 'medium' },
})

export const SelectIcon = styled(SelectBehavior.Icon, {
  context: selectSizes.Context,
  name: 'KitchenSelectIcon',
  marginLeft: 'auto',
  children: <ChevronDown />,
})

export const SelectGroup = styled(SelectBehavior.Group, {
  name: 'KitchenSelectGroup',
  width: '100%',
})

export const SelectLabel = styled(SelectBehavior.Label, {
  context: selectSizes.Context,
  name: 'KitchenSelectLabel',
  color: '$color10',
  fontWeight: '600',
  paddingHorizontal: 10,
  paddingVertical: 6,
  variants: { size: selectSizes.text } as const,
  defaultVariants: { size: 'medium' },
})

export const SelectItem = styled(SelectBehavior.Item, {
  context: selectSizes.Context,
  name: 'KitchenSelectItem',
  cursor: 'default',
  outlineOffset: -1,
  paddingHorizontal: 10,
  borderRadius: 6,

  hoverStyle: { backgroundColor: '$backgroundHover' },
  pressStyle: { backgroundColor: '$backgroundPress' },
  focusStyle: { backgroundColor: '$backgroundFocus' },
  focusVisibleStyle: {
    outlineColor: '$outlineColor',
    outlineStyle: 'solid',
    outlineWidth: 1,
  },

  variants: { size: selectSizes.frame } as const,
  defaultVariants: { size: 'medium' },
})

export const SelectItemText = styled(SelectBehavior.ItemText, {
  context: selectSizes.Context,
  name: 'KitchenSelectItemText',
  color: '$color',
  ellipsis: true,
  userSelect: 'none',
  variants: { size: selectSizes.text } as const,
  defaultVariants: { size: 'medium' },
})

export const SelectItemIndicator = styled(SelectBehavior.ItemIndicator, {
  name: 'KitchenSelectItemIndicator',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  children: <Check size={14} />,
})

export const SelectIndicator = styled(SelectBehavior.Indicator, {
  name: 'KitchenSelectIndicator',
  backgroundColor: '$backgroundFocus',
  borderRadius: 6,
})

export const SelectViewport = styled(SelectBehavior.Viewport, {
  name: 'KitchenSelectViewport',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderRadius: 10,
  borderWidth: 1,
  maxHeight: 300,
  padding: 4,
  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
})

export const SelectScrollUpButton = styled(SelectBehavior.ScrollUpButton, {
  name: 'KitchenSelectScrollUpButton',
  alignItems: 'center',
  backgroundColor: '$background',
  height: 28,
  justifyContent: 'center',
  children: <ChevronUp size={16} />,
})

export const SelectScrollDownButton = styled(SelectBehavior.ScrollDownButton, {
  name: 'KitchenSelectScrollDownButton',
  alignItems: 'center',
  backgroundColor: '$background',
  height: 28,
  justifyContent: 'center',
  children: <ChevronDown size={16} />,
})

export const SelectSeparator = styled(SelectBehavior.Separator, {
  name: 'KitchenSelectSeparator',
  backgroundColor: '$borderColor',
  height: 1,
  marginVertical: 4,
})

type SelectRootProps<Value extends string> = Omit<
  SelectScopedProps<SelectBehaviorProps<Value>>,
  'size'
> & { size?: SelectSize }

function SelectRoot<Value extends string = string>({
  size = selectSizes.defaultSize,
  ...props
}: SelectRootProps<Value>) {
  return (
    <selectSizes.Context.Provider size={size}>
      <SelectBehavior.Root {...props} />
    </selectSizes.Context.Provider>
  )
}

const selectParts = {
  Adapt: SelectBehavior.Adapt,
  Content: SelectBehavior.Content,
  FocusScope: SelectBehavior.FocusScope,
  Group: SelectGroup,
  Icon: SelectIcon,
  Indicator: SelectIndicator,
  Item: SelectItem,
  ItemIndicator: SelectItemIndicator,
  ItemText: SelectItemText,
  Label: SelectLabel,
  ScrollDownButton: SelectScrollDownButton,
  ScrollUpButton: SelectScrollUpButton,
  Separator: SelectSeparator,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Viewport: SelectViewport,
}

export const Select = withStaticProperties(SelectRoot, {
  Root: SelectRoot,
  ...selectParts,
})

function AltSelectRoot<Value extends string = string>(props: SelectRootProps<Value>) {
  return <SelectRoot {...props} />
}

const AltTrigger = styled(SelectTrigger, {
  name: 'KitchenAltSelectTrigger',
  backgroundColor: '$purple3',
  borderColor: '$purple8',
  borderRadius: 1000,
})

const AltValue = styled(SelectValue, {
  name: 'KitchenAltSelectValue',
  color: '$purple11',
  fontFamily: '$mono',
})

const AltItem = styled(SelectItem, {
  name: 'KitchenAltSelectItem',
  borderRadius: 1000,
  hoverStyle: { backgroundColor: '$purple4' },
  focusStyle: { backgroundColor: '$purple5' },
})

const AltItemText = styled(SelectItemText, {
  name: 'KitchenAltSelectItemText',
  color: '$purple11',
  fontFamily: '$mono',
})

const AltItemIndicator = styled(SelectItemIndicator, {
  name: 'KitchenAltSelectItemIndicator',
  children: '●',
})

const AltViewport = styled(SelectViewport, {
  name: 'KitchenAltSelectViewport',
  backgroundColor: '$purple2',
  borderColor: '$purple8',
  borderRadius: 22,
})

const AltScrollUpButton = styled(SelectScrollUpButton, {
  name: 'KitchenAltSelectScrollUpButton',
  backgroundColor: '$purple3',
})

const AltScrollDownButton = styled(SelectScrollDownButton, {
  name: 'KitchenAltSelectScrollDownButton',
  backgroundColor: '$purple3',
})

export const AltSelect = withStaticProperties(AltSelectRoot, {
  Root: AltSelectRoot,
  ...selectParts,
  Trigger: AltTrigger,
  Value: AltValue,
  Item: AltItem,
  ItemText: AltItemText,
  ItemIndicator: AltItemIndicator,
  Viewport: AltViewport,
  ScrollUpButton: AltScrollUpButton,
  ScrollDownButton: AltScrollDownButton,
})

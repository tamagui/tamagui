// Styled Select = the unstyled @tamagui/ui Select behavior primitive + the
// default v2-look skin, layered here in `tamagui`. Single skin definition; the
// shadcn registry item is generated from this file. Default chevron/check icons
// are dependency-free glyphs (see IconGlyph) so `tamagui` stays lean and native-
// bundleable — no react-native-svg pulled into the core package. Consumers can
// pass their own icon components as children of the icon parts.
import {
  createSizeTable,
  type GetProps,
  Select as SelectBehavior,
  type SelectProps as SelectBehaviorProps,
  type SelectScopedProps,
  SizableText,
  styled,
  withStaticProperties,
} from '@tamagui/ui'

const IconGlyph = styled(SizableText, {
  name: 'SelectIconGlyph',
  color: '$color',
  userSelect: 'none',
})

const ChevronDown = ({ size = 16 }: { size?: number }) => (
  <IconGlyph fontSize={size} lineHeight={size}>
    ▾
  </IconGlyph>
)

const ChevronUp = ({ size = 16 }: { size?: number }) => (
  <IconGlyph fontSize={size} lineHeight={size}>
    ▴
  </IconGlyph>
)

const Check = ({ size = 14 }: { size?: number }) => (
  <IconGlyph fontSize={size} lineHeight={size}>
    ✓
  </IconGlyph>
)

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
  name: 'SelectTrigger',
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
  name: 'SelectValue',
  color: '$color',
  ellipsis: true,
  variants: { size: selectSizes.text } as const,
  defaultVariants: { size: 'medium' },
})

export const SelectIcon = styled(SelectBehavior.Icon, {
  context: selectSizes.Context,
  name: 'SelectIcon',
  marginLeft: 'auto',
  children: <ChevronDown />,
})

export const SelectGroup = styled(SelectBehavior.Group, {
  name: 'SelectGroup',
  width: '100%',
})

export const SelectLabel = styled(SelectBehavior.Label, {
  context: selectSizes.Context,
  name: 'SelectLabel',
  color: '$color10',
  fontWeight: '600',
  paddingHorizontal: 10,
  paddingVertical: 6,
  variants: { size: selectSizes.text } as const,
  defaultVariants: { size: 'medium' },
})

export const SelectItem = styled(SelectBehavior.Item, {
  context: selectSizes.Context,
  name: 'SelectItem',
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
  name: 'SelectItemText',
  color: '$color',
  ellipsis: true,
  userSelect: 'none',
  variants: { size: selectSizes.text } as const,
  defaultVariants: { size: 'medium' },
})

export const SelectItemIndicator = styled(SelectBehavior.ItemIndicator, {
  name: 'SelectItemIndicator',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  children: <Check size={14} />,
})

export const SelectIndicator = styled(SelectBehavior.Indicator, {
  name: 'SelectIndicator',
  backgroundColor: '$backgroundFocus',
  borderRadius: 6,
})

export const SelectViewport = styled(SelectBehavior.Viewport, {
  name: 'SelectViewport',
  backgroundColor: '$background',
  borderColor: '$borderColor',
  borderRadius: 10,
  borderWidth: 1,
  maxHeight: 300,
  padding: 4,
  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
})

export const SelectScrollUpButton = styled(SelectBehavior.ScrollUpButton, {
  name: 'SelectScrollUpButton',
  alignItems: 'center',
  backgroundColor: '$background',
  height: 28,
  justifyContent: 'center',
  children: <ChevronUp size={16} />,
})

export const SelectScrollDownButton = styled(SelectBehavior.ScrollDownButton, {
  name: 'SelectScrollDownButton',
  alignItems: 'center',
  backgroundColor: '$background',
  height: 28,
  justifyContent: 'center',
  children: <ChevronDown size={16} />,
})

export const SelectSeparator = styled(SelectBehavior.Separator, {
  name: 'SelectSeparator',
  backgroundColor: '$borderColor',
  height: 1,
  marginVertical: 4,
})

export type SelectRootProps<
  Value extends string,
  Multiple extends boolean | undefined = false,
> = Omit<SelectScopedProps<SelectBehaviorProps<Value, Multiple>>, 'size'> & {
  size?: SelectSize
}

export function SelectRoot<
  Value extends string = string,
  Multiple extends boolean | undefined = false,
>({ size = selectSizes.defaultSize, ...props }: SelectRootProps<Value, Multiple>) {
  return (
    <selectSizes.Context.Provider size={size}>
      <SelectBehavior.Root<Value, Multiple> {...props} />
    </selectSizes.Context.Provider>
  )
}

export const selectParts = {
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

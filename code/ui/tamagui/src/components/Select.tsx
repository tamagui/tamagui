// Styled Select = the unstyled @tamagui/ui Select behavior primitive + the
// default v2-look skin, layered here in `tamagui`. Single skin definition; the
// shadcn registry item is generated from this file. Default chevron/check icons
// are dependency-free glyphs (see IconGlyph) so `tamagui` stays lean and native-
// bundleable — no react-native-svg pulled into the core package. Consumers can
// pass their own icon components as children of the icon parts.
//
// Sizing is token-based: `size` accepts a size token or `true`, which resolves
// through the opt-in @tamagui/size policy shared by Button, Input, Label,
// ListItem, and Tabs.
import {
  type GetProps,
  getVariableValue,
  resolveTokenSize,
  Select as SelectBehavior,
  SelectNativeComponentContext,
  type SelectProps as SelectBehaviorProps,
  type SelectScopedProps,
  SizableText,
  SizeContext,
  type SizeTokens,
  styled,
  type VariantSpreadExtras,
  withStaticProperties,
} from '@tamagui/ui'
import { listItemSizeVariant } from '@tamagui/list-item'

const IconGlyph = styled(SizableText, {
  name: 'SelectIconGlyph',
  color: 'color',
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

export type SelectSize = SizeTokens

const selectNativeSizeVariant = (val: SelectSize, extras: VariantSpreadExtras<any>) => {
  const frame = listItemSizeVariant(val, extras)
  const resolved = resolveTokenSize(val, {
    tokens: extras.tokens,
    font: extras.font!,
  })
  const paddingVertical = getVariableValue(frame.paddingVertical)
  const lineHeight = getVariableValue(resolved.text.lineHeight ?? resolved.text.fontSize)
  return {
    ...frame,
    borderRadius: resolved.frame.radius,
    height: Math.max(
      getVariableValue(resolved.frame.size),
      lineHeight + paddingVertical * 2 + 2
    ),
    paddingRight: getVariableValue(frame.paddingHorizontal) + 20,
  }
}

const SelectNative = styled(SizableText, {
  name: 'SelectNative',
  render: 'select',
  backgroundColor: 'background hover:background-hover',
  borderColor: 'border-color',
  borderWidth: 1,
  color: 'color',
  outlineWidth: 0,
  userSelect: 'none',
  variants: {
    size: {
      true: selectNativeSizeVariant,
      Size: selectNativeSizeVariant,
    },
  } as const,
  defaultVariants: { size: true },
})

const selectTextSizeVariant = (val: SelectSize, extras: VariantSpreadExtras<any>) => {
  const { text } = resolveTokenSize(val, {
    tokens: extras.tokens,
    font: extras.font!,
  })
  return {
    fontSize: text.fontSize,
    ...(text.lineHeight !== undefined && { lineHeight: text.lineHeight }),
  }
}

export const SelectTrigger = styled(SelectBehavior.Trigger, {
  context: SizeContext,
  name: 'SelectTrigger',
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  flexWrap: 'nowrap',
  backgroundColor: 'background hover:background-hover press:background-press',
  borderColor: 'border-color hover:border-color-hover',
  borderWidth: 1,
  justifyContent: 'space-between',
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: {
      true: listItemSizeVariant,
      Size: listItemSizeVariant,
    },
  } as const,
  defaultVariants: { size: true },
})

export const SelectValue = styled(SelectBehavior.Value, {
  context: SizeContext,
  name: 'SelectValue',
  color: 'color',
  ellipsis: true,
  variants: {
    size: {
      true: selectTextSizeVariant,
      Size: selectTextSizeVariant,
    },
  } as const,
  defaultVariants: { size: true },
})

export const SelectIcon = styled(SelectBehavior.Icon, {
  context: SizeContext,
  name: 'SelectIcon',
  marginLeft: 'auto',
  children: <ChevronDown />,
})

export const SelectGroup = styled(SelectBehavior.Group, {
  name: 'SelectGroup',
  width: '100%',
})

export const SelectLabel = styled(SelectBehavior.Label, {
  context: SizeContext,
  name: 'SelectLabel',
  color: 'color',
  cursor: 'default',
  ellipsis: true,
  fontWeight: '600',
  maxWidth: '100%',
  variants: {
    size: {
      true: listItemSizeVariant,
      Size: listItemSizeVariant,
    },
  } as const,
  defaultVariants: { size: true },
})

export const SelectItem = styled(SelectBehavior.Item, {
  context: SizeContext,
  name: 'SelectItem',
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
  cursor: 'default',
  outlineOffset: -1,
  backgroundColor: 'hover:background-hover press:background-press focus:background-focus',
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:1px',
  variants: {
    size: {
      true: listItemSizeVariant,
      Size: listItemSizeVariant,
    },
  } as const,
  defaultVariants: { size: true },
})

export const SelectItemText = styled(SelectBehavior.ItemText, {
  context: SizeContext,
  name: 'SelectItemText',
  color: 'color',
  userSelect: 'none',
  ellipsis: true,
  variants: {
    size: {
      true: selectTextSizeVariant,
      Size: selectTextSizeVariant,
    },
  } as const,
  defaultVariants: { size: true },
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
  backgroundColor: 'background',
  borderRadius: 0,
})

export const SelectViewport = styled(SelectBehavior.Viewport, {
  name: 'SelectViewport',
  backgroundColor: 'background',
  borderColor: 'border-color',
  borderRadius: 9,
  borderWidth: 1,
  maxHeight: 300,
  shadowColor: 'shadow-color',
  shadowRadius: 24,
  shadowOffset: { width: 0, height: 12 },
})

export const SelectScrollUpButton = styled(SelectBehavior.ScrollUpButton, {
  name: 'SelectScrollUpButton',
  alignItems: 'center',
  backgroundColor: 'background',
  height: 28,
  justifyContent: 'center',
  children: <ChevronUp size={16} />,
})

export const SelectScrollDownButton = styled(SelectBehavior.ScrollDownButton, {
  name: 'SelectScrollDownButton',
  alignItems: 'center',
  backgroundColor: 'background',
  height: 28,
  justifyContent: 'center',
  children: <ChevronDown size={16} />,
})

export const SelectSeparator = styled(SelectBehavior.Separator, {
  name: 'SelectSeparator',
  backgroundColor: 'border-color',
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
>({ size = true, ...props }: SelectRootProps<Value, Multiple>) {
  return (
    <SelectNativeComponentContext.Provider value={SelectNative}>
      <SizeContext.Provider size={size}>
        <SelectBehavior.Root<Value, Multiple> size={size} {...props} />
      </SizeContext.Provider>
    </SelectNativeComponentContext.Provider>
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

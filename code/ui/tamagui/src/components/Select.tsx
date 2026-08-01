// Styled Select = the unstyled @tamagui/ui Select behavior primitive + the
// default v2-look skin, layered here in `tamagui`. Single skin definition; the
// shadcn registry item is generated from this file. Default chevron/check icons
// are dependency-free glyphs (see IconGlyph) so `tamagui` stays lean and native-
// bundleable — no react-native-svg pulled into the core package. Consumers can
// pass their own icon components as children of the icon parts.
//
// Sizing is token-based: `size` accepts a size token or `true`, which resolves
// through settings.defaultSize/defaultTokens — the same language Button,
// Input, Label, ListItem, and Tabs speak.
import {
  type GetProps,
  getVariableValue,
  resolveTokenSize,
  Select as SelectBehavior,
  type SelectProps as SelectBehaviorProps,
  type SelectScopedProps,
  SizableText,
  SizeContext,
  type SizeTokens,
  styled,
  type VariantSpreadExtras,
  withStaticProperties,
} from '@tamagui/ui'

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

const selectTriggerSizeVariant = (val: SelectSize, extras: VariantSpreadExtras<any>) => {
  const { frame } = resolveTokenSize(val, {
    tokens: extras.tokens,
    font: extras.font!,
  })
  return {
    borderRadius: frame.radius,
    gap: Math.round(getVariableValue(frame.size) * 0.2),
    height: frame.size,
    paddingHorizontal: frame.space,
  }
}

// Items keep their own small static radius inside the rounded viewport; only
// height, padding, and gap follow the size token.
const selectItemSizeVariant = (val: SelectSize, extras: VariantSpreadExtras<any>) => {
  const { frame } = resolveTokenSize(val, {
    tokens: extras.tokens,
    font: extras.font!,
  })
  return {
    gap: Math.round(getVariableValue(frame.size) * 0.2),
    height: frame.size,
    paddingHorizontal: frame.space,
  }
}

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
  backgroundColor: 'background hover:background-hover press:background-press',
  borderColor: 'border-color hover:border-color-hover',
  borderWidth: 1,
  justifyContent: 'space-between',
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: {
      true: selectTriggerSizeVariant,
      Size: selectTriggerSizeVariant,
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
  color: 'color10',
  fontWeight: '600',
  paddingHorizontal: 10,
  paddingVertical: 6,
  variants: {
    size: {
      true: selectTextSizeVariant,
      Size: selectTextSizeVariant,
    },
  } as const,
  defaultVariants: { size: true },
})

export const SelectItem = styled(SelectBehavior.Item, {
  context: SizeContext,
  name: 'SelectItem',
  cursor: 'default',
  outlineOffset: -1,
  borderRadius: 6,
  backgroundColor: 'hover:background-hover press:background-press focus:background-focus',
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:1px',
  variants: {
    size: {
      true: selectItemSizeVariant,
      Size: selectItemSizeVariant,
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
  backgroundColor: 'background-focus',
  borderRadius: 6,
})

export const SelectViewport = styled(SelectBehavior.Viewport, {
  name: 'SelectViewport',
  backgroundColor: 'background',
  borderColor: 'border-color',
  borderRadius: 10,
  borderWidth: 1,
  maxHeight: 300,
  padding: 4,
  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
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
    <SizeContext.Provider size={size}>
      <SelectBehavior.Root<Value, Multiple> size={size} {...props} />
    </SizeContext.Provider>
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

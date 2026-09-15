// Styled Select = the unstyled @tamagui/ui Select behavior primitive + the
// default v2-look skin, layered here in `tamagui`. Single skin definition; the
// shadcn registry item is generated from this file. Default chevron/check icons
// are dependency-free glyphs (see IconGlyph) so `tamagui` stays lean and native-
// bundleable — no react-native-svg pulled into the core package. Consumers can
// pass their own icon components as children of the icon parts.
//
// Sizing is preset-based: `size` is one of xs sm md lg xl (default md), owned
// inline here like every other skin.
import {
  createStyledContext,
  type GetProps,
  styled,
  withStaticProperties,
} from '@tamagui/core'
import {
  Select as SelectBehavior,
  SelectNativeComponentContext,
  type SelectProps as SelectBehaviorProps,
  type SelectScopedProps,
} from '@tamagui/select'
import { SizableText } from '@tamagui/text'

const IconGlyph = styled(SizableText, {
  displayName: 'SelectIconGlyph',
  color: 'color',
  userSelect: 'none',
})

const ChevronDown = ({ size = 16 }: { size?: number }) => (
  <IconGlyph fontSize={size} lineHeight={1}>
    ▾
  </IconGlyph>
)

const ChevronUp = ({ size = 16 }: { size?: number }) => (
  <IconGlyph fontSize={size} lineHeight={1}>
    ▴
  </IconGlyph>
)

const Check = ({ size = 14 }: { size?: number }) => (
  <IconGlyph fontSize={size} lineHeight={1}>
    ✓
  </IconGlyph>
)

export type SelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | boolean

const SelectContext = createStyledContext<{ size?: SelectSize }>({ size: 'md' })

const selectFrameSize = {
  xs: { paddingInline: '2', paddingBlock: '1', borderRadius: 'sm', gap: '1' },
  sm: { paddingInline: '3', paddingBlock: '1.5', borderRadius: 'md', gap: '1.5' },
  md: { paddingInline: '4', paddingBlock: '2', borderRadius: 'md', gap: '2' },
  lg: { paddingInline: '6', paddingBlock: '2', borderRadius: 'md', gap: '2' },
  xl: { paddingInline: '8', paddingBlock: '2.5', borderRadius: 'lg', gap: '2.5' },
} as const

const selectTextSize = {
  xs: { fontSize: 'xs', lineHeight: 'xs' },
  sm: { fontSize: 'sm', lineHeight: 'sm' },
  md: { fontSize: 'sm', lineHeight: 'sm' },
  lg: { fontSize: 'base', lineHeight: 'base' },
  xl: { fontSize: 'lg', lineHeight: 'lg' },
} as const

const selectItemSize = {
  xs: { gap: '1', paddingHorizontal: '2', paddingVertical: '1' },
  sm: { gap: '1.5', paddingHorizontal: '3', paddingVertical: '1.5' },
  md: { gap: '2', paddingHorizontal: '4', paddingVertical: '2' },
  lg: { gap: '2', paddingHorizontal: '6', paddingVertical: '2' },
  xl: { gap: '2.5', paddingHorizontal: '8', paddingVertical: '2.5' },
} as const

const selectNativeSize = {
  // a native <select> ignores line-height, so it gets the control height
  // (line height plus vertical padding) plus its 1px border on each side,
  // and room for the chevron
  xs: {
    paddingInline: '2',
    paddingBlock: '1',
    borderRadius: 'sm',
    gap: '1',
    height: 26,
    paddingRight: 28,
  },
  sm: {
    paddingInline: '3',
    paddingBlock: '1.5',
    borderRadius: 'md',
    gap: '1.5',
    height: 34,
    paddingRight: 32,
  },
  md: {
    paddingInline: '4',
    paddingBlock: '2',
    borderRadius: 'md',
    gap: '2',
    height: 38,
    paddingRight: 36,
  },
  lg: {
    paddingInline: '6',
    paddingBlock: '2',
    borderRadius: 'md',
    gap: '2',
    height: 42,
    paddingRight: 44,
  },
  xl: {
    paddingInline: '8',
    paddingBlock: '2.5',
    borderRadius: 'lg',
    gap: '2.5',
    height: 50,
    paddingRight: 52,
  },
} as const

const SelectNative = styled(SizableText, {
  displayName: 'SelectNative',
  render: 'select',
  backgroundColor: 'background hover:background-hover',
  borderColor: 'border-color',
  borderWidth: 1,
  color: 'color',
  outlineWidth: 0,
  userSelect: 'none',
  variants: {
    size: {
      ...selectNativeSize,
      true: selectNativeSize.md,
    },
  } as const,
  defaultVariants: { size: 'md' },
})

export const SelectTrigger = styled(SelectBehavior.Trigger, {
  context: SelectContext,
  displayName: 'SelectTrigger',
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
      ...selectFrameSize,
      true: selectFrameSize.md,
    },
  } as const,
  defaultVariants: { size: 'md' },
})

export const SelectValue = styled(SelectBehavior.Value, {
  context: SelectContext,
  displayName: 'SelectValue',
  color: 'color',
  ellipsis: true,
  variants: {
    size: {
      ...selectTextSize,
      true: selectTextSize.md,
    },
  } as const,
  defaultVariants: { size: 'md' },
})

export const SelectIcon = styled(SelectBehavior.Icon, {
  context: SelectContext,
  displayName: 'SelectIcon',
  marginLeft: 'auto',
  children: <ChevronDown />,
})

export const SelectGroup = styled(SelectBehavior.Group, {
  displayName: 'SelectGroup',
  width: '100%',
})

export const SelectLabel = styled(SelectBehavior.Label, {
  context: SelectContext,
  displayName: 'SelectLabel',
  color: 'color-10',
  fontWeight: '600',
  paddingHorizontal: 10,
  paddingVertical: 6,
  variants: {
    size: {
      ...selectTextSize,
      true: selectTextSize.md,
    },
  } as const,
  defaultVariants: { size: 'md' },
})

export const SelectItem = styled(SelectBehavior.Item, {
  context: SelectContext,
  displayName: 'SelectItem',
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  flexWrap: 'nowrap',
  justifyContent: 'space-between',
  cursor: 'default',
  outlineOffset: -1,
  borderRadius: 6,
  backgroundColor: 'hover:background-hover press:background-press focus:background-focus',
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:1px',
  variants: {
    size: {
      ...selectItemSize,
      true: selectItemSize.md,
    },
  } as const,
  defaultVariants: { size: 'md' },
})

export const SelectItemText = styled(SelectBehavior.ItemText, {
  context: SelectContext,
  displayName: 'SelectItemText',
  color: 'color',
  userSelect: 'none',
  ellipsis: true,
  variants: {
    size: {
      ...selectTextSize,
      true: selectTextSize.md,
    },
  } as const,
  defaultVariants: { size: 'md' },
})

export const SelectItemIndicator = styled(SelectBehavior.ItemIndicator, {
  displayName: 'SelectItemIndicator',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 'auto',
  children: <Check size={14} />,
})

export const SelectIndicator = styled(SelectBehavior.Indicator, {
  displayName: 'SelectIndicator',
  backgroundColor: 'background-focus',
  borderRadius: 6,
})

export const SelectViewport = styled(SelectBehavior.Viewport, {
  displayName: 'SelectViewport',
  backgroundColor: 'background',
  borderColor: 'border-color',
  borderRadius: 10,
  borderWidth: 1,
  maxHeight: 300,
  padding: 4,
  boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)',
})

export const SelectScrollUpButton = styled(SelectBehavior.ScrollUpButton, {
  displayName: 'SelectScrollUpButton',
  alignItems: 'center',
  backgroundColor: 'background',
  height: 28,
  justifyContent: 'center',
  children: <ChevronUp size={16} />,
})

export const SelectScrollDownButton = styled(SelectBehavior.ScrollDownButton, {
  displayName: 'SelectScrollDownButton',
  alignItems: 'center',
  backgroundColor: 'background',
  height: 28,
  justifyContent: 'center',
  children: <ChevronDown size={16} />,
})

export const SelectSeparator = styled(SelectBehavior.Separator, {
  displayName: 'SelectSeparator',
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
      <SelectContext.Provider size={size}>
        <SelectBehavior.Root<Value, Multiple> size={size} {...props} />
      </SelectContext.Provider>
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

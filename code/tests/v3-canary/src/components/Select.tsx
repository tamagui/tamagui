// a custom skin over the select behavior primitives. each part owns its size
// table inline: `sm` and `md` are rows of token keys, so trigger, value and
// items agree by construction.
import {
  Select as SelectBehavior,
  type SelectProps as SelectBehaviorProps,
  type SelectScopedProps,
} from '@tamagui/select'
import { createStyledContext, styled, withStaticProperties } from 'tamagui'

type SelectSize = 'sm' | 'md'

const SelectSizeContext = createStyledContext<{ size?: SelectSize }>({ size: 'md' })

const frameSize = {
  sm: { paddingInline: '3', paddingBlock: '1.5', borderRadius: 'md', gap: '1.5' },
  md: { paddingInline: '4', paddingBlock: '2', borderRadius: 'md', gap: '2' },
} as const

const textSize = {
  sm: { fontSize: 'sm', lineHeight: 'sm' },
  md: { fontSize: 'sm', lineHeight: 'sm' },
} as const

const SelectTrigger = styled(SelectBehavior.Trigger, {
  context: SelectSizeContext,
  displayName: 'CanarySelectTrigger',
  bg: 'background',
  borderColor: 'canary-token',
  borderWidth: 1,
  justify: 'space-between',
  variants: { size: frameSize } as const,
  defaultVariants: { size: 'md' },
})

const SelectValue = styled(SelectBehavior.Value, {
  context: SelectSizeContext,
  displayName: 'CanarySelectValue',
  color: 'color',
  variants: { size: textSize } as const,
  defaultVariants: { size: 'md' },
})

const SelectItem = styled(SelectBehavior.Item, {
  context: SelectSizeContext,
  displayName: 'CanarySelectItem',
  bg: 'hover:background-hover focus:background-focus',
  variants: { size: frameSize } as const,
  defaultVariants: { size: 'md' },
})

const SelectItemText = styled(SelectBehavior.ItemText, {
  context: SelectSizeContext,
  displayName: 'CanarySelectItemText',
  color: 'color',
  variants: { size: textSize } as const,
  defaultVariants: { size: 'md' },
})

const SelectViewport = styled(SelectBehavior.Viewport, {
  displayName: 'CanarySelectViewport',
  bg: 'background',
  borderColor: 'canary-token',
  rounded: 10,
  borderWidth: 1,
  maxH: 240,
  p: 4,
})

type SelectRootProps<
  Value extends string,
  Multiple extends boolean | undefined = false,
> = Omit<SelectScopedProps<SelectBehaviorProps<Value, Multiple>>, 'size'> & {
  size?: SelectSize
}

function SelectRoot<
  Value extends string = string,
  Multiple extends boolean | undefined = false,
>({ size = 'md', ...props }: SelectRootProps<Value, Multiple>) {
  return (
    <SelectSizeContext.Provider size={size}>
      <SelectBehavior.Root<Value, Multiple> {...props} />
    </SelectSizeContext.Provider>
  )
}

export const Select = withStaticProperties(SelectRoot, {
  Content: SelectBehavior.Content,
  Group: SelectBehavior.Group,
  Icon: SelectBehavior.Icon,
  Item: SelectItem,
  ItemIndicator: SelectBehavior.ItemIndicator,
  ItemText: SelectItemText,
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Viewport: SelectViewport,
})

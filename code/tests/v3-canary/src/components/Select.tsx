import {
  Select as SelectBehavior,
  type SelectProps as SelectBehaviorProps,
  type SelectScopedProps,
} from '@tamagui/select'
import { createSizeTable, styled, withStaticProperties } from 'tamagui'

const selectSizes = createSizeTable(
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
  } as const,
  'medium'
)

type SelectSize = keyof typeof selectSizes.values

const SelectTrigger = styled(SelectBehavior.Trigger, {
  context: selectSizes.Context,
  name: 'CanarySelectTrigger',
  background: '$background',
  borderColor: '$canary-token',
  rounded: 8,
  borderWidth: 1,
  justify: 'space-between',
  variants: { size: selectSizes.frame } as const,
  defaultVariants: { size: 'medium' },
})

const SelectValue = styled(SelectBehavior.Value, {
  context: selectSizes.Context,
  name: 'CanarySelectValue',
  color: '$color',
  variants: { size: selectSizes.text } as const,
  defaultVariants: { size: 'medium' },
})

const SelectItem = styled(SelectBehavior.Item, {
  context: selectSizes.Context,
  name: 'CanarySelectItem',
  rounded: 6,
  px: 10,
  hoverStyle: { background: '$backgroundHover' },
  focusStyle: { background: '$backgroundFocus' },
  variants: { size: selectSizes.frame } as const,
  defaultVariants: { size: 'medium' },
})

const SelectItemText = styled(SelectBehavior.ItemText, {
  context: selectSizes.Context,
  name: 'CanarySelectItemText',
  color: '$color',
  variants: { size: selectSizes.text } as const,
  defaultVariants: { size: 'medium' },
})

const SelectViewport = styled(SelectBehavior.Viewport, {
  name: 'CanarySelectViewport',
  background: '$background',
  borderColor: '$canary-token',
  rounded: 10,
  borderWidth: 1,
  maxH: 240,
  p: 4,
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

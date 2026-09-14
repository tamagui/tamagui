// a custom skin over the select behavior primitives, sized by the config's
// named sizes read through resolveSize
import {
  Select as SelectBehavior,
  type SelectProps as SelectBehaviorProps,
  type SelectScopedProps,
} from '@tamagui/select'
import { resolveSize, SizeContext, styled, withStaticProperties } from 'tamagui'

import type { CanaryConfig } from '../../tamagui.config'

type SelectSize = Exclude<keyof CanaryConfig['sizes'], 'default'>

const frameSize = styled.dynamic<SelectSize>((val, env) => resolveSize(val, env).frame)
const textSize = styled.dynamic<SelectSize>((val, env) => resolveSize(val, env).text)

const SelectTrigger = styled(SelectBehavior.Trigger, {
  context: SizeContext,
  displayName: 'CanarySelectTrigger',
  bg: 'background',
  borderColor: 'canary-token',
  borderWidth: 1,
  justify: 'space-between',
  variants: { size: frameSize } as const,
  defaultVariants: { size: 'md' },
})

const SelectValue = styled(SelectBehavior.Value, {
  context: SizeContext,
  displayName: 'CanarySelectValue',
  color: 'color',
  variants: { size: textSize } as const,
  defaultVariants: { size: 'md' },
})

const SelectItem = styled(SelectBehavior.Item, {
  context: SizeContext,
  displayName: 'CanarySelectItem',
  bg: 'hover:background-hover focus:background-focus',
  variants: { size: frameSize } as const,
  defaultVariants: { size: 'md' },
})

const SelectItemText = styled(SelectBehavior.ItemText, {
  context: SizeContext,
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
    <SizeContext.Provider size={size}>
      <SelectBehavior.Root<Value, Multiple> {...props} />
    </SizeContext.Provider>
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

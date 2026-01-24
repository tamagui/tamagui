import { createStyledContext } from '@tamagui/core'
import { getPortal } from '@tamagui/native'
import type { SelectContextValue, SelectItemParentContextValue } from './types'

export const { Provider: SelectProvider, useStyledContext: useSelectContext } =
  createStyledContext<SelectContextValue>(null as any, 'Select')

// these values shouldn't change as often for performance to avoid re-rendering every item

export const {
  Provider: SelectItemParentProvider,
  useStyledContext: useSelectItemParentContext,
} = createStyledContext<SelectItemParentContextValue>(null as any, 'SelectItem')

export const ForwardSelectContext = ({
  context,
  itemContext,
  children,
}: {
  children?: any
  context: SelectContextValue
  itemContext: SelectItemParentContextValue
}) => {
  // when teleport is enabled, context is automatically preserved
  // so we can skip the forwarding logic for better performance
  const portalState = getPortal().state
  if (portalState.type === 'teleport') {
    return children
  }

  // fall back to context forwarding for legacy portal implementations
  return (
    <SelectProvider isInSheet scope={context.scopeName} {...context}>
      <SelectItemParentProvider scope={context.scopeName} {...itemContext}>
        {children}
      </SelectItemParentProvider>
    </SelectProvider>
  )
}

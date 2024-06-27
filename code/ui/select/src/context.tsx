import { createContextScope } from '@tamagui/create-context'

import { SELECT_NAME } from './constants'
import type {
  SelectScopedProps,
  SelectContextValue,
  SelectItemParentContextValue,
} from './types'

export const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME)

export const [SelectProvider, useSelectContext] =
  createSelectContext<SelectContextValue>(SELECT_NAME)

// these values shouldn't change as often for performance to avoid re-rendering every item

export const [createSelectItemParentContext, createSelectItemParentScope] =
  createContextScope(SELECT_NAME)

export const [SelectItemParentProvider, useSelectItemParentContext] =
  createSelectContext<SelectItemParentContextValue>(SELECT_NAME)

export const ForwardSelectContext = ({
  __scopeSelect,
  context,
  itemContext,
  children,
}: SelectScopedProps<{
  children?: any
  context: SelectContextValue
  itemContext: SelectItemParentContextValue
}>) => {
  return (
    <SelectProvider isInSheet scope={__scopeSelect} {...context}>
      <SelectItemParentProvider scope={__scopeSelect} {...itemContext}>
        {children}
      </SelectItemParentProvider>
    </SelectProvider>
  )
}

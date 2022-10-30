import { createContextScope } from '@tamagui/create-context'
import { ReactNode } from 'react'

import { SELECT_NAME } from './constants'
import { ScopedProps, SelectContextValue, SelectedItemContext } from './types'

export const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME)

export const [SelectProvider, useSelectContext] =
  createSelectContext<SelectContextValue>(SELECT_NAME)

export const ForwardSelectContext = (
  props: ScopedProps<{
    children?: any
    context: SelectContextValue
    itemContext: SelectedItemContext
  }>
) => {
  return (
    <SelectProvider isInSheet scope={props.__scopeSelect} {...props.context}>
      <SelectedItemProvider scope={props.__scopeSelect} {...props.itemContext}>
        {props.children}
      </SelectedItemProvider>
    </SelectProvider>
  )
}

export const [createSelectedItemContext, createSelectedItemScope] = createContextScope(SELECT_NAME)

export const [SelectedItemProvider, useSelectedItemContext] =
  createSelectContext<SelectedItemContext>(SELECT_NAME)

import { createContextScope } from '@tamagui/create-context'

import { SELECT_NAME } from './constants'
import { ScopedProps, SelectContextValue } from './types'

export const [createSelectContext, createSelectScope] =
  createContextScope(SELECT_NAME)

export const [SelectProvider, useSelectContext] =
  createSelectContext<SelectContextValue>(SELECT_NAME)

export const ForwardSelectContext = (
  props: ScopedProps<{ children?: any; context: SelectContextValue }>,
) => {
  return (
    <SelectProvider isInSheet scope={props.__scopeSelect} {...props.context}>
      {props.children}
    </SelectProvider>
  )
}

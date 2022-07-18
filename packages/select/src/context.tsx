import { createContextScope } from '@tamagui/create-context'

import { SELECT_NAME } from './constants'
import { SelectContextValue } from './types'

export const [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME)

export const [SelectProvider, useSelectContext] =
  createSelectContext<SelectContextValue>(SELECT_NAME)

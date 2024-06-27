import { createContextScope } from '@tamagui/create-context'

import { SHEET_NAME } from './constants'
import type { SheetContextValue } from './useSheetProviderProps'

export const [createSheetContext, createSheetScope] = createContextScope(SHEET_NAME)

export const [SheetProvider, useSheetContext] = createSheetContext<SheetContextValue>(
  SHEET_NAME,
  {} as any
)

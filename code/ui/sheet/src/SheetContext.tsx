import { createStyledContext } from '@tamagui/core'

import type { SheetContextValue } from './useSheetProviderProps'

export const SheetContext = createStyledContext<SheetContextValue>(
  {} as SheetContextValue,
  'Sheet__'
)

export const { Provider: SheetProvider, useStyledContext: useSheetContext } =
  SheetContext

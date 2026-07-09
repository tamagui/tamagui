import { createStyledContext } from '@tamagui/core'
import React from 'react'

import type { SheetContextValue } from './useSheetProviderProps'

export const SheetContext = createStyledContext<SheetContextValue>(
  {} as SheetContextValue,
  'Sheet__'
)

export const { Provider: SheetProvider, useStyledContext: useSheetContext } = SheetContext

export const SheetOverlayLayerContext = React.createContext(false)

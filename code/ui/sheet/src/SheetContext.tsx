import { createStyledContext, type UniversalAnimatedNumber } from '@tamagui/core'
import React from 'react'

import type { SheetContextValue } from './useSheetProviderProps'

export const SheetContext = createStyledContext<SheetContextValue>({}, 'Sheet__')

export const { Provider: SheetProvider, useStyledContext: useSheetContext } = SheetContext

export const SheetOverlayLayerContext = React.createContext(false)

export type SheetAnimatedPositionContextValue = {
  // the exact animated number driving the frame's translateY (px from screen
  // top). drive drag-linked effects off this via useAnimatedNumberStyle.
  value: UniversalAnimatedNumber<any>
  // height of the viewport the sheet positions against
  screenSize: number
  // measured height of the sheet frame
  frameSize: number
  // resolved px positions (translateY) matching snapPoints order
  snapOffsets: number[]
  // the top-most (fully open) position
  minY: number
}

export const SheetAnimatedPositionContext =
  React.createContext<SheetAnimatedPositionContextValue | null>(null)

/**
 * Read the sheet's live animated position. Call inside a `Sheet` to build
 * drag-linked effects (e.g. an overlay fade) on the public animation hooks:
 *
 * ```tsx
 * const { value, screenSize } = Sheet.useAnimatedPosition()
 * const style = useAnimatedNumberStyle(value, (y) => {
 *   'worklet'
 *   return { opacity: Math.max(0, 0.5 * (1 - y / screenSize)) }
 * })
 * ```
 */
export function useAnimatedPosition(): SheetAnimatedPositionContextValue {
  const context = React.useContext(SheetAnimatedPositionContext)
  if (!context) {
    throw new Error(
      'Sheet.useAnimatedPosition() must be used inside a <Sheet>. Render the component that calls it as a child of Sheet.'
    )
  }
  return context
}

import * as React from 'react'
import { PanResponder, View } from 'react-native'

import { getGestureHandlerState } from './gestureState'
import type { SheetDragSurfaceProps } from './types'

/**
 * The surface the sheet is dragged by.
 *
 * With react-native-gesture-handler set up the drag is a `Gesture.Pan`, which
 * needs a native View of its own to attach to. Without it the drag runs on
 * PanResponder, the same as web.
 */
export function SheetDragSurface({
  gestureHandlerEnabled,
  panGesture,
  panConfig,
  children,
}: SheetDragSurfaceProps) {
  const { GestureDetector } = getGestureHandlerState()

  const panHandlers = React.useMemo(
    () => (panConfig ? PanResponder.create(panConfig).panHandlers : undefined),
    [panConfig]
  )

  if (gestureHandlerEnabled && panGesture && GestureDetector) {
    return (
      <GestureDetector gesture={panGesture}>
        <View style={{ flex: 1 }} collapsable={false}>
          {children}
        </View>
      </GestureDetector>
    )
  }

  return (
    <View {...panHandlers} style={{ flex: 1, width: '100%', height: '100%' }}>
      {children}
    </View>
  )
}

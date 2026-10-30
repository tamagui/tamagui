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
  const { GestureDetector, Gesture } = getGestureHandlerState()

  const panHandlers = React.useMemo(
    () => (panConfig ? PanResponder.create(panConfig).panHandlers : undefined),
    [panConfig]
  )

  // a disabled placeholder keeps the same parent while dragging is off, so the
  // sheet content is not remounted when the real gesture comes and goes
  const idleGesture = React.useMemo(() => Gesture?.Pan().enabled(false), [Gesture])

  if (gestureHandlerEnabled && GestureDetector && (panGesture || idleGesture)) {
    return (
      <GestureDetector gesture={panGesture ?? idleGesture}>
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

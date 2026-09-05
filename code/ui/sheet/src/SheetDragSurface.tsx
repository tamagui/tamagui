import type { TamaguiElement } from '@tamagui/core'
import { View } from '@tamagui/core'
import { PanResponder } from '@tamagui/react-native-pan-responder'
import { useResponderEvents } from '@tamagui/react-native-use-responder-events'
import * as React from 'react'

import type { SheetDragSurfaceProps } from './types'

/**
 * The surface the sheet is dragged by.
 *
 * Web runs the same PanResponder react-native does, over the same responder
 * system, so the drag behaves as it did when this was a react-native `View`.
 * `gestureHandler` is native-only, so the props for it are ignored here.
 */
export function SheetDragSurface({ panConfig, children }: SheetDragSurfaceProps) {
  const ref = React.useRef<TamaguiElement>(null)

  const panHandlers = React.useMemo(
    () => (panConfig ? PanResponder.create(panConfig).panHandlers : undefined),
    [panConfig]
  )

  const { onClickCapture, ...responderHandlers } = panHandlers ?? {}
  useResponderEvents(ref, responderHandlers)

  // onClickCapture is a DOM prop: tamagui forwards it to the element untouched
  // but only types react-native's prop surface
  const domProps = { onClickCapture } as Record<string, unknown>

  return (
    <View ref={ref} {...domProps} flex={1} width="100%" height="100%">
      {children}
    </View>
  )
}

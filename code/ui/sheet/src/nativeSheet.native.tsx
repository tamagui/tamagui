import { createRefComponent } from '@tamagui/core'
import type { View } from '@tamagui/react-native-types'
import { useMemo, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { SheetNativeSystemContext, SheetProvider } from './SheetContext'
import type {
  NativeSheetRenderer,
  NativeSheetSnapPoint,
  SheetNativePlatforms,
  SheetProps,
} from './types'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetState } from './useSheetState'

const nativeSheets: Partial<Record<SheetNativePlatforms, NativeSheetImplementation>> = {}
type NativeSheetImplementation = ReturnType<typeof createRefComponent<View, SheetProps>>

export function getNativeSheet(platform: SheetNativePlatforms) {
  if (Platform.OS !== platform) return null
  const implementation = nativeSheets[platform]
  if (!implementation)
    throw new Error(
      `Register a native ${platform} Sheet renderer with setupNativeSheet before rendering Sheet native`
    )
  return implementation
}

export function setupNativeSheet(
  platform: SheetNativePlatforms,
  Renderer: NativeSheetRenderer
) {
  nativeSheets[platform] = createRefComponent<View, SheetProps>(
    function NativeSheet(props, ref) {
      // a native request cannot replace a controlled parent's accepted value.
      const state = useSheetOpenState(props, 'prop-wins')
      const { maxContentSize, ...sheetState } = useSheetState(props, state)
      const { open, setOpen } = state
      const openRef = useRef(open)
      openRef.current = open
      const [dismissed, setDismissed] = useState(!open)
      const [previousOpen, setPreviousOpen] = useState(open)
      if (previousOpen !== open) {
        setPreviousOpen(open)
        if (open) setDismissed(false)
      }
      const { snapPoints, snapPointsMode } = sheetState
      const points = useMemo(() => {
        const authored = props.dismissOnSnapToBottom
          ? snapPoints.slice(0, -1)
          : snapPoints
        return authored.map((point): NativeSheetSnapPoint => {
          if (point === 'fit' && (snapPointsMode === 'fit' || snapPointsMode === 'mixed'))
            return { type: 'fit' }
          const percent =
            snapPointsMode === 'percent' ||
            (snapPointsMode === 'mixed' &&
              typeof point === 'string' &&
              point.endsWith('%'))
          const value =
            percent && typeof point === 'string' ? Number(point.slice(0, -1)) : point
          if (
            typeof value !== 'number' ||
            !Number.isFinite(value) ||
            value < 0 ||
            (percent && value > 100)
          ) {
            throw new Error(`Invalid native Sheet snap point: ${String(point)}`)
          }
          if (snapPointsMode === 'fit')
            throw new Error('Native Sheet fit mode requires a fit snap point')
          return { type: percent ? 'percent' : 'height', value }
        })
      }, [snapPoints, snapPointsMode, props.dismissOnSnapToBottom])
      if (!points.length) throw new Error('Native Sheet requires a snap point')
      const position =
        open &&
        (sheetState.position < 0 ||
          (props.dismissOnSnapToBottom && sheetState.position === points.length))
          ? 0
          : sheetState.position
      if (open && (!Number.isInteger(position) || position >= points.length))
        throw new Error('Native Sheet position must select an authored snap point')
      const {
        defaultOpen,
        defaultPosition,
        unmountChildrenWhenHidden,
        children,
        ...rendererProps
      } = props
      return (
        <SheetNativeSystemContext.Provider value>
          <SheetProvider {...sheetState} onlyShowContainer>
            <Renderer
              {...rendererProps}
              ref={ref}
              unmountChildrenWhenHidden={unmountChildrenWhenHidden}
              open={open}
              onOpenChange={setOpen}
              position={position}
              onPositionChange={sheetState.setPosition}
              snapPoints={points}
              onDismiss={() => {
                if (openRef.current) return
                setDismissed(true)
                state.onNativeDismiss?.()
              }}
            >
              {unmountChildrenWhenHidden && dismissed ? null : children}
            </Renderer>
          </SheetProvider>
        </SheetNativeSystemContext.Provider>
      )
    }
  )
}

import React from 'react'
import type { TamaguiElement } from '@tamagui/core'
import { useConfiguration } from '@tamagui/core'
import { useConstant } from '@tamagui/use-constant'
import { useControllableState } from '@tamagui/use-controllable-state'

import type { ScrollBridge, SheetProps } from './types'
import type { SheetOpenState } from './useSheetOpenState'

export type SheetContextValue = ReturnType<typeof useSheetProviderProps>

export function useSheetProviderProps(
  props: SheetProps,
  state: SheetOpenState,
  options: {
    onOverlayComponent?: (comp: any) => void
  } = {}
) {
  const handleRef = React.useRef<TamaguiElement>(null)
  const contentRef = React.useRef<TamaguiElement>(null)
  const [frameSize, setFrameSize] = React.useState<number>(0)
  const [maxContentSize, setMaxContentSize] = React.useState<number>(0)
  const snapPointsMode = props.snapPointsMode ?? 'percent'
  const snapPointsProp: (string | number)[] =
    props.snapPoints ??
    (snapPointsMode === 'percent'
      ? [80]
      : snapPointsMode === 'constant'
        ? [256]
        : ['fit'])
  const hasFit = snapPointsProp[0] === 'fit'

  const snapPoints = React.useMemo(
    () => (props.dismissOnSnapToBottom ? [...snapPointsProp, 0] : snapPointsProp),

    [JSON.stringify(snapPointsProp), props.dismissOnSnapToBottom]
  )

  // lets set -1 to be always the "open = false" position
  const [position_, setPositionImmediate] = useControllableState({
    prop: props.position,
    defaultProp: props.defaultPosition || (state.open ? 0 : -1),
    onChange: props.onPositionChange,
    strategy: 'most-recent-wins',
    transition: true,
  })

  const position = state.open === false ? -1 : position_

  const { open } = state

  const setPosition = React.useCallback(
    (next: number) => {
      // close on dismissOnSnapToBottom (and set position so it animates)
      if (props.dismissOnSnapToBottom && next === snapPoints.length - 1) {
        state.setOpen(false)
      } else {
        setPositionImmediate(next)
      }
    },
    [props.dismissOnSnapToBottom, snapPoints.length, setPositionImmediate, state.setOpen]
  )

  if (process.env.NODE_ENV === 'development') {
    if (
      snapPointsMode === 'mixed' &&
      snapPoints.some((p) => {
        if (typeof p === 'string') {
          if (p === 'fit') {
            return false
          }
          if (p.endsWith('%')) {
            const n = Number(p.slice(0, -1))
            return n < 0 || n > 100
          }
          return true
        }
        return typeof p !== 'number' || p < 0
      })
    ) {
      console.warn(
        '⚠️ Invalid snapPoint given, snapPoints must be positive numeric values, string percentages between 0-100%, or "fit" when snapPointsMode is mixed'
      )
    }
    if (snapPointsMode === 'mixed' && snapPoints.indexOf('fit') > 0) {
      console.warn(
        '⚠️ Invalid snapPoint given, "fit" must be the first/largest snap point when snapPointsMode is mixed'
      )
    }
    if (
      snapPointsMode === 'fit' &&
      (snapPoints.length !== (props.dismissOnSnapToBottom ? 2 : 1) ||
        snapPoints[0] !== 'fit')
    ) {
      console.warn(
        '⚠️ Invalid snapPoint given, there are no snap points when snapPointsMode is fit'
      )
    }
    if (
      snapPointsMode === 'constant' &&
      snapPoints.some((p) => typeof p !== 'number' || p < 0)
    ) {
      console.warn(
        '⚠️ Invalid snapPoint given, snapPoints must be positive numeric values when snapPointsMode is constant'
      )
    }
    if (
      snapPointsMode === 'percent' &&
      snapPoints.some((p) => typeof p !== 'number' || p < 0 || p > 100)
    ) {
      console.warn(
        '⚠️ Invalid snapPoint given, snapPoints must be numeric values between 0 and 100 when snapPointsMode is percent'
      )
    }
  }

  // reset position to fully open on re-open after dismissOnSnapToBottom
  if (open && props.dismissOnSnapToBottom && position === snapPoints.length - 1) {
    setPositionImmediate(0)
  }

  // open must set position
  const shouldSetPositionOpen = open && position < 0
  React.useEffect(() => {
    if (shouldSetPositionOpen) {
      setPosition(0)
    }
  }, [setPosition, shouldSetPositionOpen])

  const { animationDriver } = useConfiguration()
  if (!animationDriver) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? `❌ 008`
        : 'Must set animations in tamagui.config.ts'
    )
  }

  const scrollBridge = useConstant<ScrollBridge>(() => ({
    enabled: false,
    y: 0,
    paneY: 0,
    paneMinY: 0,
    scrollStartY: -1,
    drag: () => {},
    release: () => {},
    scrollLock: false,
  }))

  const removeScrollEnabled = props.forceRemoveScrollEnabled ?? (open && props.modal)

  const maxSnapPoint = snapPoints[0]
  const screenSize =
    snapPointsMode === 'percent'
      ? frameSize / ((typeof maxSnapPoint === 'number' ? maxSnapPoint : 100) / 100)
      : maxContentSize

  const providerProps = {
    screenSize,
    maxSnapPoint,
    removeScrollEnabled,
    scrollBridge,
    modal: !!props.modal,
    open: state.open,
    setOpen: state.setOpen,
    hidden: !!state.isHidden,
    contentRef,
    handleRef,
    frameSize,
    setFrameSize,
    dismissOnOverlayPress: props.dismissOnOverlayPress ?? true,
    dismissOnSnapToBottom: props.dismissOnSnapToBottom ?? false,
    onOverlayComponent: options.onOverlayComponent,
    scope: props.__scopeSheet,
    hasFit,
    position,
    snapPoints,
    snapPointsMode,
    setMaxContentSize,
    setPosition,
    setPositionImmediate,
    onlyShowFrame: false,
  }

  return providerProps
}

import { TamaguiElement, useAnimationDriver } from '@tamagui/core'
import { useConstant } from '@tamagui/use-constant'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { ScrollBridge, SheetProps } from './types'
import { SheetOpenState } from './useSheetOpenState'

export type SheetContextValue = ReturnType<typeof useSheetProviderProps>

export function useSheetProviderProps(
  props: SheetProps,
  state: SheetOpenState,
  options: {
    onOverlayComponent?: (comp: any) => void
  } = {}
) {
  const contentRef = React.useRef<TamaguiElement>(null)
  const [frameSize, setFrameSize] = useState<number>(0)
  const snapPointsProp = props.snapPoints || [80]

  const snapPoints = useMemo(
    () => (props.dismissOnSnapToBottom ? [...snapPointsProp, 0] : snapPointsProp),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const setPosition = useCallback(
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
    if (snapPoints.some((p) => p < 0 || p > 100)) {
      console.warn(
        '⚠️ Invalid snapPoint given, snapPoints must be between 0 and 100, equal to percent height of frame'
      )
    }
  }

  // reset position to fully open on re-open after dismissOnSnapToBottom
  if (open && props.dismissOnSnapToBottom && position === snapPoints.length - 1) {
    setPositionImmediate(0)
  }

  // open must set position
  const shouldSetPositionOpen = open && position < 0
  useEffect(() => {
    if (shouldSetPositionOpen) {
      setPosition(0)
    }
  }, [setPosition, shouldSetPositionOpen])

  const driver = useAnimationDriver()
  if (!driver) {
    throw new Error('Must set animations in tamagui.config.ts')
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

  const maxSnapPoint = snapPoints.reduce((prev, cur) => Math.max(prev, cur))
  const screenSize = frameSize / (maxSnapPoint / 100)

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
    frameSize,
    setFrameSize,
    dismissOnOverlayPress: props.dismissOnOverlayPress ?? true,
    dismissOnSnapToBottom: props.dismissOnSnapToBottom ?? false,
    onOverlayComponent: options.onOverlayComponent,
    scope: props.__scopeSheet,
    position,
    snapPoints,
    setPosition,
    setPositionImmediate,
    onlyShowFrame: false,
  }

  return providerProps
}

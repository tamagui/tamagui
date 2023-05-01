import { TamaguiElement } from '@tamagui/core'
import { useConstant } from '@tamagui/use-constant'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, { useCallback, useMemo, useState } from 'react'

import { ScrollBridge, SheetProps } from './types'
import { SheetOpenState } from './useSheetOpenState'

export function useSheetProviderProps(props: SheetProps, state: SheetOpenState) {
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

  return {
    modal: !!props.modal,
    open: state.open,
    setOpen: state.setOpen,
    hidden: !!state.isHidden,
    contentRef,
    frameSize,
    setFrameSize,
    dismissOnOverlayPress: props.dismissOnOverlayPress ?? true,
    dismissOnSnapToBottom: props.dismissOnSnapToBottom ?? false,
    scope: props.__scopeSheet,
    position,
    snapPoints,
    setPosition,
    setPositionImmediate,
    scrollBridge,
  }
}

export type SheetContextValue = ReturnType<typeof useSheetProviderProps>

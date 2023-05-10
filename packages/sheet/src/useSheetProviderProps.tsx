import { isTouchable, isWeb, TamaguiElement, useAnimationDriver, useThemeName } from '@tamagui/core'
import { useConstant } from '@tamagui/use-constant'
import { useControllableState } from '@tamagui/use-controllable-state'
import { useKeyboardVisible } from '@tamagui/use-keyboard-visible'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { HIDDEN_SIZE, SHEET_HIDDEN_STYLESHEET } from './constants'

import { ScrollBridge, SheetProps } from './types'
import { useSheetController } from './useSheetController'
import { SheetOpenState } from './useSheetOpenState'
import { useSheetSnapPoints } from './useSheetSnapPoints'

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

  const { positions, maxSnapPoint, screenSize } = useSheetSnapPoints({
    position,
    setPosition,
    dismissOnSnapToBottom: props.dismissOnSnapToBottom,
    snapPoints,
    setPositionImmediate,
    open,
    frameSize,
  })

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

  const controller = useSheetController()
  
  const driver = useAnimationDriver()
  if (!driver) {
    throw new Error('Must set animations in tamagui.config.ts')
  }

  const disableDrag = props.disableDrag ?? controller?.disableDrag
  const keyboardIsVisible = useKeyboardVisible()
  const themeName = useThemeName()

  const { useAnimatedNumber, useAnimatedNumberReaction, useAnimatedNumberStyle } =
    driver

  const animatedNumber = useAnimatedNumber(HIDDEN_SIZE)

  // native only fix
  const at = useRef(0)

  useAnimatedNumberReaction(
    {
      value: animatedNumber,
      hostRef: sheetRef,
    },
    (value) => {
      if (!driver.isReactNative) return
      at.current = value
      scrollBridge.paneY = value
    }
  )

  function stopSpring() {
    animatedNumber.stop()
    if (scrollBridge.onFinishAnimate) {
      scrollBridge.onFinishAnimate()
      scrollBridge.onFinishAnimate = undefined
    }
  }

  // we need to set this *after* fully closed to 0, to avoid it overlapping
  // the page when resizing quickly on web for example
  const [opacity, setOpacity] = useState(open ? 1 : 0)
  if (open && opacity === 0) {
    setOpacity(1)
  }
  useEffect(() => {
    if (!open) {
      // need to wait for animation complete, for now lets just do it naively
      const tm = setTimeout(() => {
        setOpacity(0)
      }, 400)
      return () => {
        clearTimeout(tm)
      }
    }
  }, [open])

  const [isShowingInnerSheet, setIsShowingInnerSheet] = useState(false)

  const onInnerSheet = useCallback((hasChild: boolean) => {
    setIsShowingInnerSheet(hasChild)
  }, [])

  const panResponder = useMemo(
    () => {
      if (disableDrag) return
      if (!frameSize) return
      if (isShowingInnerSheet) return

      const minY = positions[0]
      scrollBridge.paneMinY = minY
      let startY = at.current

      function makeUnselectable(val: boolean) {
        if (!SHEET_HIDDEN_STYLESHEET) return
        if (!val) {
          SHEET_HIDDEN_STYLESHEET.innerText = ''
        } else {
          SHEET_HIDDEN_STYLESHEET.innerText =
            ':root * { user-select: none !important; -webkit-user-select: none !important; }'
        }
      }

      const release = ({ vy, dragAt }: { dragAt: number; vy: number }) => {
        isExternalDrag = false
        previouslyScrolling = false
        makeUnselectable(false)
        const at = dragAt + startY
        // seems liky vy goes up to about 4 at the very most (+ is down, - is up)
        // lets base our multiplier on the total layout height
        const end = at + frameSize * vy * 0.2
        let closestPoint = 0
        let dist = Infinity
        for (let i = 0; i < positions.length; i++) {
          const position = positions[i]
          const curDist = end > position ? end - position : position - end
          if (curDist < dist) {
            dist = curDist
            closestPoint = i
          }
        }
        // have to call both because state may not change but need to snap back
        setPosition(closestPoint)
        animateTo(closestPoint)
      }

      const finish = (_e: GestureResponderEvent, state: PanResponderGestureState) => {
        release({
          vy: state.vy,
          dragAt: state.dy,
        })
      }

      let previouslyScrolling = false

      const onMoveShouldSet = (
        _e: GestureResponderEvent,
        { dy }: PanResponderGestureState
      ) => {
        const isScrolled = scrollBridge.y !== 0
        const isDraggingUp = dy < 0
        // we can treat near top instead of exactly to avoid trouble with springs
        const isNearTop = scrollBridge.paneY - 5 <= scrollBridge.paneMinY
        if (isScrolled) {
          previouslyScrolling = true
          return false
        }
        // prevent drag once at top and pulling up
        if (isNearTop) {
          if (!isScrolled && isDraggingUp) {
            return false
          }
        }
        // we could do some detection of other touchables and cancel here..
        return Math.abs(dy) > 5
      }

      const grant = () => {
        makeUnselectable(true)
        stopSpring()
        startY = at.current
      }

      let isExternalDrag = false

      scrollBridge.drag = (dy) => {
        if (!isExternalDrag) {
          isExternalDrag = true
          grant()
        }
        const to = dy + startY
        animatedNumber.setValue(resisted(to, minY), { type: 'direct' })
      }

      scrollBridge.release = release

      return PanResponder.create({
        onMoveShouldSetPanResponder: onMoveShouldSet,
        onPanResponderGrant: grant,
        onPanResponderMove: (_e, { dy }) => {
          const toFull = dy + startY
          const to = resisted(toFull, minY)
          animatedNumber.setValue(to, { type: 'direct' })
        },
        onPanResponderEnd: finish,
        onPanResponderTerminate: finish,
        onPanResponderRelease: finish,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disableDrag, isShowingInnerSheet, animateTo, frameSize, positions, setPosition]
  )
  
  const handleAnimationViewLayout = useCallback(
    (e) => {
      let next = e.nativeEvent?.layout.height
      if (isWeb && isTouchable && !open) {
        // temp fix ios bug where it doesn't go below dynamic bottom...
        next += 100
      }
      if (!next) return
      setFrameSize(() => next)
    },
    [keyboardIsVisible]
  )

  const providerProps = {
    keyboardIsVisible,
    handleAnimationViewLayout,
    onInnerSheet,
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

export type SheetContextValue = ReturnType<typeof useSheetProviderProps>

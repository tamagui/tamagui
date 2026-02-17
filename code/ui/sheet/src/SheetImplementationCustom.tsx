import { ProvideAdaptContext, useAdaptContext } from '@tamagui/adapt'
import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  LayoutMeasurementController,
  View as TamaguiView,
  useConfiguration,
  useDidFinishSSR,
  useEvent,
  useThemeName,
} from '@tamagui/core'
import { getSafeArea } from '@tamagui/native'
import { needsPortalRepropagation, Portal } from '@tamagui/portal'
import React, { useState } from 'react'
import type {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponderGestureState,
} from 'react-native'
import { Dimensions, PanResponder, View } from 'react-native'
import { ParentSheetContext, SheetInsideSheetContext } from './contexts'
import { GestureDetectorWrapper } from './GestureDetectorWrapper'
import { GestureSheetProvider } from './GestureSheetContext'
import { resisted } from './helpers'
import { SheetProvider } from './SheetContext'
import type { SheetProps, SnapPointsMode } from './types'
import { useGestureHandlerPan } from './useGestureHandlerPan'
import { useKeyboardControllerSheet } from './useKeyboardControllerSheet'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetProviderProps } from './useSheetProviderProps'

const hiddenSize = 10_000.1

// safe area top inset, cached per-session (device-constant value)
let _cachedSafeAreaTop: number | undefined
function getSafeAreaTopInset(): number {
  if (_cachedSafeAreaTop !== undefined) return _cachedSafeAreaTop
  // use @tamagui/native abstraction - returns 0 when not enabled
  _cachedSafeAreaTop = getSafeArea().getInsets().top
  return _cachedSafeAreaTop
}

let sheetHiddenStyleSheet: HTMLStyleElement | null = null

// on web we are always relative to window, on to screen
const relativeDimensionTo = isWeb ? 'window' : 'screen'

export const SheetImplementationCustom = React.forwardRef<View, SheetProps>(
  function SheetImplementationCustom(props, forwardedRef) {
    const parentSheet = React.useContext(ParentSheetContext)

    const {
      transition,
      transitionConfig: transitionConfigProp,
      modal = false,
      zIndex = parentSheet.zIndex + 1,
      moveOnKeyboardChange = false,
      unmountChildrenWhenHidden = false,
      portalProps,
      containerComponent: ContainerComponent = React.Fragment,
    } = props

    const state = useSheetOpenState(props)
    const [overlayComponent, setOverlayComponent] = React.useState<React.ReactNode>(null)

    const providerProps = useSheetProviderProps(props, state, {
      onOverlayComponent: setOverlayComponent,
    })
    const {
      frameSize,
      setFrameSize,
      snapPoints,
      snapPointsMode,
      hasFit,
      position,
      setPosition,
      scrollBridge,
      screenSize,
      setMaxContentSize,
      maxSnapPoint,
    } = providerProps
    const { open, controller, isHidden } = state

    const sheetRef = React.useRef<View>(undefined as unknown as View)
    const ref = useComposedRefs(forwardedRef, sheetRef, providerProps.contentRef as any)

    // TODO this can be extracted into a helper getAnimationConfig(animationProp as array | string)
    const { animationDriver } = useConfiguration()

    if (!animationDriver) {
      throw new Error(`Sheet requires an animation driver to be set`)
    }

    const transitionConfig = (() => {
      // explicit transitionConfig prop always takes precedence
      if (transitionConfigProp) {
        return transitionConfigProp
      }

      const [animationProp, animationPropConfig] = !transition
        ? []
        : Array.isArray(transition)
          ? transition
          : ([transition] as const)

      // look up named animation config from driver if available
      if (animationProp && animationDriver.animations?.[animationProp as string]) {
        return {
          ...animationDriver.animations[animationProp as string],
          ...animationPropConfig,
        }
      }

      return null
    })()

    /**
     * This is a hacky workaround for native:
     */
    const [isShowingInnerSheet, setIsShowingInnerSheet] = React.useState(false)
    // when using Gorhom portal (no teleport), inner sheets need to hide parent
    const shouldHideParentSheet =
      !isWeb && modal && isShowingInnerSheet && needsPortalRepropagation()

    const sheetInsideSheet = React.useContext(SheetInsideSheetContext)
    const onInnerSheet = React.useCallback((hasChild: boolean) => {
      setIsShowingInnerSheet(hasChild)
    }, [])

    // FIX: Store stable frameSize to prevent recalculation during exit animation
    const stableFrameSize = React.useRef(frameSize)

    React.useEffect(() => {
      // Only update stable size when sheet is open
      if (open && frameSize) {
        stableFrameSize.current = frameSize
      }
    }, [open, frameSize])

    // use stableFrameSize when closing to prevent position jumps during exit animation
    // but when opening, always use the current frameSize so positions update correctly
    const effectiveFrameSize = open ? frameSize : stableFrameSize.current || frameSize

    const positions = React.useMemo(
      () =>
        snapPoints.map((point) =>
          getYPositions(snapPointsMode, point, screenSize, effectiveFrameSize)
        ),
      [screenSize, effectiveFrameSize, snapPoints, snapPointsMode]
    )

    // keyboard state tracking — just tracks height/visibility, no position animation.
    // Position animation is handled via keyboard-adjusted positions below,
    // matching the react-native-actions-sheet pattern.
    const {
      keyboardHeight,
      isKeyboardVisible,
      dismissKeyboard,
      pauseKeyboardHandler,
      flushPendingHide,
    } = useKeyboardControllerSheet({
      enabled: !isWeb && Boolean(moveOnKeyboardChange),
    })

    const [isDragging, setIsDragging_] = React.useState(false)

    // synchronous dragging ref — set BEFORE async state commits.
    // RNGH onBegin fires before keyboard hide event reaches JS,
    // so the ref is true by the time activePositions memo re-evaluates.
    // Also controls pauseKeyboardHandler to freeze keyboard state during drag.
    const isDraggingRef = React.useRef(false)
    const setIsDragging = React.useCallback(
      (val: boolean) => {
        isDraggingRef.current = val
        pauseKeyboardHandler.current = val
        setIsDragging_(val)
        // when drag ends, flush any keyboard hide that was suppressed during drag
        // so isKeyboardVisible/keyboardHeight reflect actual state
        if (!val) {
          flushPendingHide()
        }
      },
      [pauseKeyboardHandler, flushPendingHide]
    )

    // keyboard-adjusted positions: shift snap points up by keyboard height
    // when keyboard is visible. This drives both gesture snap calculation
    // and animation targets — keyboard never dismissed during drag.
    // Capped at safe area top inset so the sheet never goes above the notch/status bar
    // (matching the react-native-actions-sheet pattern).
    //
    // IMPORTANT: frozen during drag to prevent gesture handler recreation.
    // When user drags, TextInput may blur → keyboard dismisses → positions would revert,
    // causing the gesture useMemo to recreate and cancel the active drag.
    // The post-drag reconciliation effect handles animating to correct position after drag ends.
    const activePositionsRef = React.useRef(positions)
    const activePositions = React.useMemo(() => {
      // during drag, return frozen positions to prevent gesture handler recreation.
      // check both state (for re-render trigger) and ref (for synchronous check
      // when keyboard hide event fires before isDragging state commits)
      if (isDragging || isDraggingRef.current) return activePositionsRef.current

      let result: number[]
      if (!isKeyboardVisible || keyboardHeight <= 0) {
        result = positions
      } else {
        const safeAreaTop = isWeb ? 0 : getSafeAreaTopInset()
        result = positions.map((p) => {
          // don't adjust the off-screen/close position (from dismissOnSnapToBottom's 0% snap)
          // — it must stay at screenSize so the user can drag between real snap points
          // without accidentally closing the sheet
          if (screenSize && p >= screenSize) return p
          return Math.max(safeAreaTop, p - keyboardHeight)
        })
      }
      activePositionsRef.current = result
      return result
    }, [positions, isKeyboardVisible, keyboardHeight, screenSize, isDragging])

    const { useAnimatedNumber, useAnimatedNumberStyle, useAnimatedNumberReaction } =
      animationDriver
    const AnimatedView = (animationDriver.View ?? TamaguiView) as typeof Animated.View

    useIsomorphicLayoutEffect(() => {
      if (!(sheetInsideSheet && open)) return
      sheetInsideSheet(true)
      return () => {
        sheetInsideSheet(false)
      }
    }, [sheetInsideSheet, open])

    const nextParentContext = React.useMemo(
      () => ({
        zIndex,
      }),
      [zIndex]
    )

    const isMounted = useDidFinishSSR()
    const startPosition = isMounted && screenSize ? screenSize : hiddenSize
    const animatedNumber = useAnimatedNumber(startPosition)
    const at = React.useRef(startPosition)
    const hasntMeasured = at.current === hiddenSize
    const [disableAnimation, setDisableAnimation] = useState(hasntMeasured)

    // use skipNextAnimation signal from controller (set when adapt handoff occurs)
    const skipAdaptAnimation = React.useRef(false)
    if (controller?.skipNextAnimation) {
      skipAdaptAnimation.current = true
    }

    const hasScrollView = React.useRef(false)

    useAnimatedNumberReaction(
      {
        value: animatedNumber,
        hostRef: sheetRef,
      },
      React.useCallback(
        (value) => {
          at.current = value
          scrollBridge.paneY = value
          // update isAtTop for scroll enable/disable
          // activePositions[0] is the top snap point (keyboard-adjusted minY)
          const minY = activePositions[0]
          const wasAtTop = scrollBridge.isAtTop
          const nowAtTop = value <= minY + 5
          if (wasAtTop !== nowAtTop) {
            scrollBridge.isAtTop = nowAtTop
            // when reaching top, enable scroll; when leaving top, disable scroll
            // this preemptively sets scroll state before any gestures start
            if (nowAtTop) {
              scrollBridge.scrollLockY = undefined
              scrollBridge.setScrollEnabled?.(true)
            } else {
              scrollBridge.scrollLockY = 0
              scrollBridge.setScrollEnabled?.(false)
            }
          }
        },
        [animationDriver, activePositions]
      )
    )

    function stopSpring() {
      animatedNumber.stop()
      if (scrollBridge.onFinishAnimate) {
        scrollBridge.onFinishAnimate()
        scrollBridge.onFinishAnimate = undefined
      }
    }

    const animateTo = useEvent((position: number, animationOverride?: any) => {
      if (frameSize === 0) return

      let toValue = isHidden || position === -1 ? screenSize : activePositions[position]

      if (at.current === toValue) return

      at.current = toValue
      stopSpring()

      // skip animation when adapting from dialog to sheet
      if (skipAdaptAnimation.current) {
        skipAdaptAnimation.current = false
        animatedNumber.setValue(toValue, { type: 'timing', duration: 0 })
        return
      }

      animatedNumber.setValue(
        toValue,
        animationOverride || {
          type: 'spring',
          ...transitionConfig,
        }
      )
    })

    useIsomorphicLayoutEffect(() => {
      // we need to do a *three* step process for the css driver
      // first render off screen for ssr safety (hiddenSize)
      // then render to bottom of screen without animation (screenSize)
      // then add the animation as it animates from screenSize to position

      if (hasntMeasured && screenSize && frameSize) {
        at.current = screenSize
        animatedNumber.setValue(
          screenSize,
          {
            type: 'timing',
            duration: 0,
          },
          () => {
            // imperfect but struggling to render properly here
            setTimeout(() => {
              setDisableAnimation(false)
            }, 10)
          }
        )
        return
      }

      if (disableAnimation) {
        return
      }

      if (!frameSize || !screenSize || isHidden || (hasntMeasured && !open)) {
        return
      }

      // finally, animate
      animateTo(position)

      // reset scroll bridge
      if (position === -1) {
        scrollBridge.scrollLock = false
        scrollBridge.scrollStartY = -1
      }

      // set initial isAtTop state when sheet opens
      // position 0 = top snap point, so isAtTop = true
      if (open && position >= 0) {
        const isTopPosition = position === 0
        scrollBridge.isAtTop = isTopPosition
        if (isTopPosition) {
          scrollBridge.scrollLockY = undefined
          scrollBridge.setScrollEnabled?.(true)
        } else {
          scrollBridge.scrollLockY = 0
          scrollBridge.setScrollEnabled?.(false)
        }
      }
    }, [hasntMeasured, disableAnimation, isHidden, frameSize, screenSize, open, position])

    const disableDrag = props.disableDrag ?? controller?.disableDrag
    const themeName = useThemeName()
    const [blockPan, setBlockPan] = React.useState(false)

    const panResponder = React.useMemo(() => {
      if (disableDrag) return
      if (!frameSize) return
      if (isShowingInnerSheet) return

      const minY = positions[0]
      scrollBridge.paneMinY = minY
      let startY = at.current

      function setPanning(val: boolean) {
        setIsDragging(val)

        // make unselectable:
        if (process.env.TAMAGUI_TARGET === 'web') {
          if (!sheetHiddenStyleSheet) {
            sheetHiddenStyleSheet = document.createElement('style')
            if (typeof document.head !== 'undefined') {
              document.head.appendChild(sheetHiddenStyleSheet)
            }
          }
          if (!val) {
            sheetHiddenStyleSheet.innerText = ''
          } else {
            sheetHiddenStyleSheet.innerText =
              ':root * { user-select: none !important; -webkit-user-select: none !important; }'
          }
        }
      }

      const release = ({ vy }: { dragAt: number; vy: number }) => {
        scrollBridge.setParentDragging(false)
        if (scrollBridge.scrollLock) {
          return
        }

        isExternalDrag = false
        previouslyScrolling = false
        setPanning(false)
        // use the actual current animated position rather than dragAt + startY.
        // after mid-gesture handoffs (pan→scroll→pan), startY can be stale
        // causing the computed position to be wildly wrong (triggering dismiss).
        const currentPos = at.current
        // vy goes up to about 4 at most (+ is down, - is up)
        const end = currentPos + frameSize * vy * 0.2

        let closestPoint = 0
        let dist = Number.POSITIVE_INFINITY

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
        e: GestureResponderEvent,
        { dy }: PanResponderGestureState
      ): boolean => {
        function getShouldSet() {
          // if dragging handle always allow:
          if (e.target === providerProps.handleRef.current) {
            return true
          }

          if (scrollBridge.hasScrollableContent === true) {
            if (scrollBridge.scrollLock) {
              return false
            }

            const isScrolled = scrollBridge.y !== 0

            // Update the dragging direction
            const isDraggingUp = dy < 0

            // we can treat near top instead of exactly to avoid trouble with springs
            const isNearTop = scrollBridge.paneY - 5 <= scrollBridge.paneMinY
            if (isScrolled) {
              previouslyScrolling = true
              return false
            }
            // prevent drag once at top and pulling up
            if (isNearTop) {
              if (hasScrollView.current && isDraggingUp) {
                return false
              }
            }
          }

          // we could do some detection of other touchables and cancel here..
          return Math.abs(dy) > 10
        }

        const granted = getShouldSet()

        if (granted) {
          scrollBridge.setParentDragging(true)
        }

        return granted
      }

      const grant = () => {
        setPanning(true)
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

      // direct snap to position without release calculation (for handoff cases)
      scrollBridge.snapToPosition = (positionIndex: number) => {
        isExternalDrag = false
        previouslyScrolling = false
        setPanning(false)
        setPosition(positionIndex)
        animateTo(positionIndex)
      }

      return PanResponder.create({
        onMoveShouldSetPanResponder: onMoveShouldSet,
        onPanResponderGrant: grant,
        onPanResponderMove: (_e, { dy }) => {
          const toFull = dy + startY
          const to = resisted(toFull, minY)

          // handles the case where you hand off back and forth more than once
          const isAtTop = to <= minY
          if (isAtTop) {
            scrollBridge.setParentDragging(false)
          } else {
            scrollBridge.setParentDragging(true)
          }

          animatedNumber.setValue(to, { type: 'direct' })
        },
        onPanResponderEnd: finish,
        onPanResponderTerminate: finish,
        onPanResponderRelease: finish,
      })
    }, [disableDrag, isShowingInnerSheet, animateTo, frameSize, positions, setPosition])

    // animate to keyboard-adjusted position when keyboard state changes
    React.useEffect(() => {
      if (isDragging || isHidden || !open || disableAnimation) return
      if (!frameSize || !screenSize) return
      // use timing animation to match iOS keyboard animation (~250ms)
      animateTo(position, { type: 'timing', duration: 250 })
    }, [isKeyboardVisible, keyboardHeight])

    // reconcile position after drag ends — if keyboard dismissed during drag
    // (e.g., input blur), activePositions reverted but onEnd used frozen positions
    // for snap index. This effect ensures the sheet animates to the correct
    // non-keyboard-adjusted position for the chosen snap index.
    const wasDragging = React.useRef(false)
    React.useEffect(() => {
      if (isDragging) {
        wasDragging.current = true
        return
      }
      if (!wasDragging.current) return
      wasDragging.current = false
      // drag just ended — reconcile position with latest activePositions
      if (!frameSize || !screenSize || isHidden || !open) return
      animateTo(position)
    }, [isDragging])

    // dismiss keyboard when sheet closes
    React.useEffect(() => {
      if (!open && isKeyboardVisible) {
        dismissKeyboard()
      }
    }, [open])

    // gesture handler hook for RNGH-based gesture coordination
    const { panGesture, panGestureRef, gestureHandlerEnabled } = useGestureHandlerPan({
      positions: activePositions,
      frameSize,
      setPosition,
      animateTo,
      stopSpring,
      scrollBridge,
      setIsDragging,
      getCurrentPosition: () => at.current,
      resisted,
      disableDrag,
      isShowingInnerSheet,
      setAnimatedPosition: (val: number) => {
        // directly set the animated value for smooth dragging
        at.current = val
        animatedNumber.setValue(val, { type: 'direct' })
      },
      pauseKeyboardHandler,
    })

    const handleAnimationViewLayout = React.useCallback(
      (e: LayoutChangeEvent) => {
        // FIX: Don't update frameSize during exit animation to prevent position jumps
        if (!open && stableFrameSize.current !== 0) {
          return
        }

        // avoid bugs where it grows forever for whatever reason
        // For inline mode (non-modal), don't cap at window height - use actual layout
        const layoutHeight = e.nativeEvent?.layout.height
        const next = modal
          ? Math.min(layoutHeight, Dimensions.get(relativeDimensionTo).height)
          : layoutHeight
        if (!next) return
        setFrameSize(next)
      },
      [open, modal]
    )

    const handleMaxContentViewLayout = React.useCallback((e: LayoutChangeEvent) => {
      // avoid bugs where it grows forever for whatever reason
      const next = Math.min(
        e.nativeEvent?.layout.height,
        Dimensions.get(relativeDimensionTo).height
      )
      if (!next) return
      setMaxContentSize(next)
    }, [])

    const animatedStyle = useAnimatedNumberStyle(animatedNumber, (val) => {
      'worklet'
      const translateY = frameSize === 0 ? hiddenSize : val

      return {
        transform: [{ translateY }],
      }
    })

    // we need to set this *after* fully closed to 0, to avoid it overlapping
    // the page when resizing quickly on web for example
    const [opacity, setOpacity] = React.useState(open ? 1 : 0)
    if (open && opacity === 0) {
      setOpacity(1)
    }
    React.useEffect(() => {
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

    const forcedContentHeight = hasFit
      ? undefined
      : snapPointsMode === 'percent'
        ? // Use dvh for modal (viewport-relative), % for inline (container-relative)
          `${maxSnapPoint}${isWeb ? (modal ? 'dvh' : '%') : '%'}`
        : maxSnapPoint

    const setHasScrollView = React.useCallback((val: boolean) => {
      hasScrollView.current = val
    }, [])
    // const id = useId()
    // const { AdaptProvider, when, children } = useAdaptParent({
    //   scope: `${id}Sheet`,
    //   portal: true,
    // })

    let contents = (
      <LayoutMeasurementController disable={!open}>
        <ParentSheetContext.Provider value={nextParentContext}>
          <SheetProvider {...providerProps} setHasScrollView={setHasScrollView}>
            <GestureSheetProvider
              isDragging={isDragging}
              blockPan={blockPan}
              setBlockPan={setBlockPan}
              panGesture={panGesture}
              panGestureRef={panGestureRef}
            >
              <AnimatePresence custom={{ open }}>
                {shouldHideParentSheet || !open ? null : overlayComponent}
              </AnimatePresence>

              {snapPointsMode !== 'percent' && (
                <View
                  style={{
                    opacity: 0,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    pointerEvents: 'none',
                  }}
                  onLayout={handleMaxContentViewLayout}
                />
              )}

              <AnimatedView
                ref={ref}
                onLayout={handleAnimationViewLayout}
                // @ts-ignore for CSS driver this is necessary to attach the transition
                // also motion driver at least though i suspect all drivers?
                transition={isDragging || disableAnimation ? null : transition}
                // @ts-ignore
                disableClassName
                style={[
                  {
                    position: 'absolute',
                    zIndex,
                    width: '100%',
                    height: forcedContentHeight,
                    minHeight: forcedContentHeight,
                    opacity: !shouldHideParentSheet ? opacity : 0,
                    ...((shouldHideParentSheet || !open) && {
                      pointerEvents: 'none',
                    }),
                  },
                  animatedStyle,
                ]}
              >
                {/* wrap children with plain RN View for panResponder - tamagui views no longer handle responder events on web */}
                {gestureHandlerEnabled && panGesture ? (
                  <GestureDetectorWrapper gesture={panGesture} style={{ flex: 1 }}>
                    {props.children}
                  </GestureDetectorWrapper>
                ) : (
                  <View
                    {...panResponder?.panHandlers}
                    style={{ flex: 1, width: '100%', height: '100%' }}
                  >
                    {props.children}
                  </View>
                )}
              </AnimatedView>
            </GestureSheetProvider>
          </SheetProvider>
        </ParentSheetContext.Provider>
      </LayoutMeasurementController>
    )

    if (process.env.TAMAGUI_TARGET === 'native' && needsPortalRepropagation()) {
      // TODO alongside sheet scope="" need to pass scope here
      const adaptContext = useAdaptContext()
      contents = (
        <ProvideAdaptContext {...adaptContext}>
          {/* @ts-ignore */}
          {contents}
        </ProvideAdaptContext>
      )
    }

    // start mounted so we get an accurate measurement the first time
    const shouldMountChildren = unmountChildrenWhenHidden ? !!opacity : true

    if (modal) {
      const modalContents = (
        <Portal stackZIndex={zIndex} {...portalProps}>
          {shouldMountChildren && <ContainerComponent>{contents}</ContainerComponent>}
        </Portal>
      )

      if (isWeb) {
        return modalContents
      }

      // on native we don't support multiple modals yet... fix for now is to hide outer one
      return (
        <SheetInsideSheetContext.Provider value={onInnerSheet}>
          {modalContents}
        </SheetInsideSheetContext.Provider>
      )
    }

    return contents
  }
)

function getYPositions(
  mode: SnapPointsMode,
  point: string | number,
  screenSize?: number,
  frameSize?: number
) {
  if (!screenSize || !frameSize) {
    return 0
  }

  if (mode === 'mixed') {
    if (typeof point === 'number') {
      return screenSize - Math.min(screenSize, Math.max(0, point))
    }
    if (point === 'fit') {
      return screenSize - Math.min(screenSize, frameSize)
    }
    if (point.endsWith('%')) {
      const pct = Math.min(100, Math.max(0, Number(point.slice(0, -1)))) / 100
      if (Number.isNaN(pct)) {
        console.warn('Invalid snapPoint percentage string')
        return 0
      }
      return Math.round(screenSize - pct * screenSize)
    }
    console.warn('Invalid snapPoint unknown value')
    return 0
  }

  if (mode === 'fit') {
    if (point === 0) return screenSize
    return screenSize - Math.min(screenSize, frameSize)
  }

  if (mode === 'constant' && typeof point === 'number') {
    return screenSize - Math.min(screenSize, Math.max(0, point))
  }

  const pct = Math.min(100, Math.max(0, Number(point))) / 100
  if (Number.isNaN(pct)) {
    console.warn('Invalid snapPoint percentage')
    return 0
  }

  return Math.round(screenSize - pct * screenSize)
}

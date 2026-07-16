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
  createRefComponent,
} from '@tamagui/core'
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
import { SHEET_OVERLAY_NAME } from './constants'
import { GestureDetectorWrapper } from './GestureDetectorWrapper'
import { getGestureHandlerState } from './gestureState'
import { GestureSheetProvider } from './GestureSheetContext'
import { resisted } from './helpers'
import {
  getKeyboardAdjustedSheetY,
  getKeyboardOccludedHeight,
  getSheetReleasePosition,
} from './keyboardAvoidance'
import {
  getWebKeyboardResizeHeight,
  getMaxViewportHeight,
  getStableLayoutViewportHeight,
  getWebVisualViewportOffsetTop,
  MIN_KEYBOARD_HEIGHT,
} from './webViewport'
import { SheetOverlayLayerContext, SheetProvider } from './SheetContext'
import type { SheetProps, SnapPointsMode } from './types'
import { useGestureHandlerPan } from './useGestureHandlerPan'
import { useKeyboardControllerSheet } from './useKeyboardControllerSheet'
import { SafeAreaInsetsContext, useSafeAreaInsets } from './useSafeAreaInsets'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetProviderProps } from './useSheetProviderProps'

const hiddenSize = 10_000.1

// the re-established rngh root for a modal sheet (see modal branch below).
// GestureHandlerRootView does its own native touch interception and ignores
// pointerEvents, so it would block the whole app while the sheet sits closed
// but mounted. instead it stays full-width for correct child layout/measurement
// and collapses to 0 height when closed so it has no hit area.
const rnghRootStyleOpen = { width: '100%', height: '100%' } as const
const rnghRootStyleClosed = { width: '100%', height: 0 } as const

let sheetHiddenStyleSheet: HTMLStyleElement | null = null

// stack of open modal sheets on web so escape only closes the top-most one.
// pushed on open (child sheets mount their effect after the parent, so the
// deepest sheet sits last), popped on close/unmount.
const sheetEscapeLayers: object[] = []

// on web we are always relative to window, on to screen
const relativeDimensionTo = isWeb ? 'window' : 'screen'

// height of the viewport the sheet positions against. on web this MUST be the
// stable layout viewport and NOT Dimensions.get('window') — react-native-web's
// Dimensions tracks visualViewport, which shrinks by the soft keyboard. capping
// frameSize / maxContentSize against that shrinking value corrupts the fit-mode
// math (translateY = screenSize - frameSize), detaching the sheet's bottom from
// the screen edge when the keyboard opens. NOTE: window.innerHeight is NOT
// stable on real iOS Safari (it shrinks with the keyboard too), so we use the
// self-correcting baseline from webViewport instead. see getStableLayoutViewportHeight.
function getStableViewportHeight(): number {
  if (isWeb && typeof window !== 'undefined') return getStableLayoutViewportHeight()
  return Dimensions.get(relativeDimensionTo).height
}

export const SheetImplementationCustom = createRefComponent<View, SheetProps>(
  function SheetImplementationCustom(props, forwardedRef) {
    const parentSheet = React.useContext(ParentSheetContext)

    // live safe-area insets (notch / status bar). read here in the component
    // body — which renders INSIDE the app's SafeAreaProvider — so it is correct
    // even though a modal sheet's CONTENT is teleported out through the portal.
    // the keyboard-avoidance clamp below uses the top inset so a keyboard-shifted
    // sheet tops out at the notch instead of sliding under it. web has no native
    // safe-area context (CSS env() handles it) and uses the visual-viewport
    // offset instead.
    const safeAreaInsets = useSafeAreaInsets()
    const safeAreaTopInset = safeAreaInsets?.top ?? 0

    const {
      transition,
      transitionConfig: transitionConfigProp,
      modal = false,
      zIndex = parentSheet.zIndex + 1,
      moveOnKeyboardChange = false,
      unmountChildrenWhenHidden = false,
      disableTransparencyHide = false,
      portalProps,
      containerComponent: ContainerComponent = React.Fragment,
      onAnimationComplete,
    } = props

    const state = useSheetOpenState(props)

    const providerProps = useSheetProviderProps(props, state)
    const {
      frameSize,
      setFrameSize,
      dismissOnSnapToBottom,
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
    const openRef = React.useRef(open)
    openRef.current = open

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
      enabled: Boolean(moveOnKeyboardChange),
    })

    // FIX: Store stable frameSize to prevent recalculation during exit animation
    const stableFrameSize = React.useRef(frameSize)

    React.useEffect(() => {
      // Only update stable size when sheet is open
      if (open && frameSize) {
        stableFrameSize.current = frameSize
      }
    }, [open, frameSize])

    // WEB keyboard frame freeze. on real iOS Safari opening the keyboard shrinks
    // the visual viewport AND innerHeight AND the measured layout, which would
    // re-derive screenSize/frameSize smaller, recompute the fit positions, and
    // fly the frame up then back down ("goes back down after the keyboard opens").
    // so we snapshot the pre-keyboard geometry — captured every render while the
    // keyboard is CLOSED, which dodges the open-transition race where a shrunk
    // onLayout lands before isKeyboardVisible flips — and use it for frame-size
    // math while the keyboard is open. the active snap position still shifts up
    // by the keyboard height, capped at the safe-area top; the scroll view gets
    // keyboardOccludedHeight padding for any tail left behind the keyboard.
    // this sheet is the kind the web keyboard frame freeze is designed for — a
    // fit-mode web sheet opted into keyboard handling. percent/constant sheets
    // keep the live geometry (their height isn't pinned, so a frozen frame
    // height would mismatch).
    const isWebKbSheet = isWeb && hasFit && moveOnKeyboardChange

    // NATIVE keyboard frame freeze. native fit sheets feed keyboardOccludedHeight
    // into the ScrollView as scrollable tail padding so content can clear the
    // keyboard. but that padding grows the fit content, which grows the frame,
    // which grows the occluded height — a feedback loop that balloons the sheet
    // to the full-screen cap. web breaks the loop by freezing geometry against
    // effScreenSize; native has no such freeze, so we pin the ScrollView to the
    // frame height measured while the keyboard was closed (preKeyboardFrameSize)
    // via keyboardStableFrameHeight below. unlike web, the native keyboard is an
    // overlay that never shrinks the measured screen, so screenSize stays live.
    const isNativeKbFitSheet = !isWeb && hasFit && Boolean(moveOnKeyboardChange)

    // snapshot the fit frame height while the keyboard is closed, so the pin above
    // holds the pre-keyboard viewport rather than a mid-feedback-loop value.
    const preKeyboardFrameSize = React.useRef(0)
    React.useEffect(() => {
      if (isNativeKbFitSheet && open && !isKeyboardVisible && frameSize > 0) {
        preKeyboardFrameSize.current = frameSize
      }
    }, [isNativeKbFitSheet, open, isKeyboardVisible, frameSize])

    // the space the snap positions are built against. WEB: the stable layout
    // viewport (document.documentElement.clientHeight), which the soft keyboard
    // never shrinks (unlike the measured screenSize / visualViewport). NATIVE:
    // the measured screenSize. activePositions shift up by keyboardHeight below
    // so a small fit sheet keeps its natural height and moves with the keyboard;
    // a tall fit sheet moves until capped at the safe-area top, leaving its tail
    // behind the keyboard for the ScrollView padding to expose.
    const effScreenSize = isWebKbSheet ? getStableViewportHeight() : screenSize

    // use stableFrameSize when closing to prevent position jumps during the exit
    // animation; while open use the live frameSize.
    const effectiveFrameSize = open ? frameSize : stableFrameSize.current || frameSize

    const positions = React.useMemo(
      () =>
        snapPoints.map((point) =>
          getYPositions(snapPointsMode, point, effScreenSize, effectiveFrameSize)
        ),
      [effScreenSize, effectiveFrameSize, snapPoints, snapPointsMode]
    )

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

    // keyboard-adjusted snap positions.
    //
    // WEB + NATIVE: shift snap points up by keyboard height, capped at the
    // safe-area top inset. web fit sheets keep their frozen pre-keyboard height
    // and add bottom spacer padding when the safe-area cap leaves a hidden tail.
    //
    // IMPORTANT: frozen during drag to prevent gesture handler recreation —
    // when a TextInput blurs mid-drag the keyboard state would otherwise revert
    // and recreate the gesture useMemo, cancelling the active drag.
    const activePositionsRef = React.useRef(positions)
    const activePositions = React.useMemo(() => {
      if (isDragging || isDraggingRef.current) return activePositionsRef.current

      let result: number[]

      if (!isKeyboardVisible || keyboardHeight <= 0) {
        result = positions
      } else {
        result = positions.map((p) =>
          getKeyboardAdjustedSheetY({
            sheetY: p,
            screenSize: effScreenSize,
            isKeyboardVisible,
            keyboardHeight,
            shouldTranslate: true,
            safeAreaTop: isWeb ? getWebVisualViewportOffsetTop() : safeAreaTopInset,
          })
        )
      }
      activePositionsRef.current = result
      return result
    }, [
      positions,
      isKeyboardVisible,
      keyboardHeight,
      effScreenSize,
      isDragging,
      safeAreaTopInset,
    ])

    // bottom spacer for the part of the sheet hidden by the keyboard after the
    // keyboard translation and safe-area clamping. if a small sheet fits above
    // the keyboard this is 0; if a tall sheet is capped at the safe-area top, the
    // spacer makes the remaining hidden tail scrollable.
    const keyboardOccludedHeight = getKeyboardOccludedHeight({
      frameSize: effectiveFrameSize,
      isKeyboardVisible,
      keyboardHeight,
      screenSize: effScreenSize,
      sheetY: position >= 0 ? activePositions[position] : undefined,
    })

    // pin the scroll view to the held (pre-keyboard) frame height while the
    // keyboard is up on web. on older iOS the consumer's window-derived maxHeight
    // shrinks with the keyboard, which would clip the scroll view (and the frame)
    // smaller; this override keeps it at the full height so the frame translates
    // with the keyboard but never resizes. 0 = no override (use the consumer maxHeight).
    const keyboardStableFrameHeight =
      isWebKbSheet && isKeyboardVisible && frameSize > 0
        ? frameSize
        : isNativeKbFitSheet && isKeyboardVisible && preKeyboardFrameSize.current > 0
          ? preKeyboardFrameSize.current
          : 0

    const { useAnimatedNumber, useAnimatedNumberStyle } = animationDriver
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

    // safety fallback timer for sheet close opacity
    const opacityFallbackTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const syncAnimatedPosition = useEvent((value: number) => {
      at.current = value
      scrollBridge.paneY = value

      // update isAtTop for scroll enable/disable. activePositions[0] is the
      // top snap point (keyboard-adjusted minY).
      const minY = activePositions[0]
      const wasAtTop = scrollBridge.isAtTop
      const nowAtTop = value <= minY + 5
      if (wasAtTop === nowAtTop) return

      scrollBridge.isAtTop = nowAtTop
      if (nowAtTop) {
        if (scrollBridge.lockScrollAtTop) {
          if (scrollBridge.y > 0) {
            scrollBridge.forceScrollTo?.(0)
            scrollBridge.y = 0
          }
          scrollBridge.scrollLockY = 0
          scrollBridge.setScrollEnabled?.(false, 0)
          return
        }
        // if scroll drifted during drag (e.g. fast swipe from position 1),
        // reset it to 0 before enabling free scroll.
        if (scrollBridge.y > 0) {
          scrollBridge.forceScrollTo?.(0)
          scrollBridge.y = 0
        }
        scrollBridge.scrollLockY = undefined
        scrollBridge.setScrollEnabled?.(true)
      } else {
        scrollBridge.scrollLockY = 0
        scrollBridge.setScrollEnabled?.(false)
      }
    })

    const setAnimatedPositionDirect = useEvent((value: number) => {
      syncAnimatedPosition(value)
      animatedNumber.setValue(value, { type: 'direct' })
    })

    const getAnimatedPosition = useEvent(() => {
      const value = animatedNumber.getValue()
      syncAnimatedPosition(value)
      return value
    })

    function stopSpring() {
      animatedNumber.stop()
      if (scrollBridge.onFinishAnimate) {
        scrollBridge.onFinishAnimate()
        scrollBridge.onFinishAnimate = undefined
      }
    }

    const animateTo = useEvent((position: number, animationOverride?: any) => {
      if (frameSize === 0) return

      // use effScreenSize (the frozen anchor space the positions were built in) for
      // the off-screen/close target too, so a close while the keyboard is still up
      // animates fully out instead of to a mismatched live screenSize.
      //
      // web: clear the maximum the viewport can ever reveal, not just the current
      // layout viewport. iOS Safari retracts its chrome on scroll and exposes area
      // below the current viewport, so a sheet parked at effScreenSize would peek
      // back in as the page scrolls. getMaxViewportHeight floors the target past
      // anything Safari can expose.
      const closeTarget = isWeb
        ? Math.max(effScreenSize, getMaxViewportHeight())
        : effScreenSize
      let toValue = isHidden || position === -1 ? closeTarget : activePositions[position]

      if (at.current === toValue) return

      at.current = toValue
      stopSpring()

      const isOpenAnimation = position !== -1 && !isHidden

      // clear any pending fallback timer
      if (opacityFallbackTimer.current) {
        clearTimeout(opacityFallbackTimer.current)
        opacityFallbackTimer.current = null
      }

      const animationCompleteCallback = () => {
        syncAnimatedPosition(toValue)
        if (opacityFallbackTimer.current) {
          clearTimeout(opacityFallbackTimer.current)
          opacityFallbackTimer.current = null
        }
        // use openRef (live) not open (stale closure) — if the sheet
        // was reopened before this callback fires (e.g. cancelled close
        // animation), we must not hide it
        if (!isOpenAnimation && !openRef.current) {
          setOpacity(0)
        }
        onAnimationComplete?.({ open: isOpenAnimation })
        // also notify the SheetController so a parent (e.g. Dialog adapt)
        // can hold the sheet's children mounted until the slide-out is done
        controller?.onAnimationComplete?.({ open: isOpenAnimation })
      }

      // safety fallback: if animation callback never fires, still hide the sheet
      if (!isOpenAnimation) {
        opacityFallbackTimer.current = setTimeout(() => {
          opacityFallbackTimer.current = null
          // check live open state via ref — sheet may have reopened (e.g. adapt handoff)
          if (!openRef.current) {
            setOpacity(0)
          }
        }, 1000)
      }

      // skip animation when adapting from dialog to sheet
      if (skipAdaptAnimation.current) {
        skipAdaptAnimation.current = false
        animatedNumber.setValue(
          toValue,
          { type: 'timing', duration: 0 },
          animationCompleteCallback
        )
        return
      }

      const resolvedConfig = animationOverride || {
        type: 'spring',
        ...transitionConfig,
      }

      // the sheet position spring moves hundreds of px. the spring drivers'
      // default rest detection is tuned for tiny values (react-native Animated:
      // 0.001px thresholds; reanimated 4: relative energyThreshold 6e-9), so for
      // a sheet-sized move completion fires 1.4-1.7s after the animation is
      // visually done - it always lost to Adapt's exit fallback latch and the
      // sheet's own 1s opacity fallback, making every adapted close timer-driven
      // (with a dev warning). default rest detection sized for px transforms:
      // sub-pixel, invisible, but completes when the motion actually ends.
      // user config still wins via spread order; each driver ignores the other
      // driver's keys.
      const springConfig =
        !resolvedConfig.type || resolvedConfig.type === 'spring'
          ? {
              // react-native Animated (absolute px)
              restDisplacementThreshold: 1,
              restSpeedThreshold: 10,
              // reanimated 4 (relative energy): ~0.3% of travel amplitude
              energyThreshold: 1e-5,
              ...resolvedConfig,
            }
          : resolvedConfig

      animatedNumber.setValue(toValue, springConfig, animationCompleteCallback)
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
            syncAnimatedPosition(screenSize)
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

      // never fight an active drag: the gesture owns the animated position. on
      // web the AnimatedView's onLayout re-fires with sub-pixel jitter as the
      // frame translates (frameSize 499.99996 <-> 500.00003), and since frameSize
      // is a dep of this effect that would re-run it mid-pull and snap the sheet
      // back to its resting snap point. read the live ref so drag-end (which the
      // reconcile-after-drag effect handles) isn't gated by stale deps.
      if (isDraggingRef.current) {
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
      // NOTE: effScreenSize/effectiveFrameSize are intentionally NOT deps. With the
      // spacer approach the frame's position target is frozen across keyboard
      // open/close (same stable baseline), so it must NOT re-animate — keyboard
      // avoidance is the bottom spacer + scroll, not a frame move.
    }, [hasntMeasured, disableAnimation, isHidden, frameSize, screenSize, open, position])

    const disableDrag = props.disableDrag ?? controller?.disableDrag
    const themeName = useThemeName()
    const [blockPan, setBlockPan] = React.useState(false)

    const panResponder = React.useMemo(() => {
      if (disableDrag) return
      if (!frameSize) return
      if (isShowingInnerSheet) return

      // use keyboard-adjusted positions (matches the RNGH path): when the
      // keyboard is open the sheet sits at activePositions[0], so clamping drags
      // against the un-adjusted positions[0] would rubber-band the sheet down to
      // near the bottom on any drag.
      const minY = activePositions[0]
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

        const closestPoint = getSheetReleasePosition({
          positions: activePositions,
          projectedEnd: end,
          currentPosition: currentPos,
          frameSize,
          dismissOnSnapToBottom,
          snapPointsMode,
          isKeyboardVisible,
          isWeb,
        })

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

          // touch is on the ScrollView node — the web scroll-view gesture hook
          // owns it and drives drag/release through scrollBridge directly (it
          // re-baselines via scrollBridge.startPanDrag on each pan handoff). if
          // we also granted here, RNW's PanResponder would set the animated
          // position from a second, differently-based offset every move and the
          // sheet would jitter/jump. defer entirely to the hook.
          if (scrollBridge.scrollNodeTouched) {
            return false
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
        startY = getAnimatedPosition()
      }

      let isExternalDrag = false

      // re-baseline a pan drag to the current animated position. the web
      // scroll-view hook calls this on every transition INTO pan ownership
      // (including handoffs back from scroll), so its panDragOffset — which it
      // resets to 0 at each pan entry — is measured from where the sheet
      // actually is now, not from where the gesture first grabbed it. without
      // this the sheet would jump to a stale origin on a scroll→pan handoff.
      scrollBridge.startPanDrag = () => {
        isExternalDrag = true
        grant()
      }

      scrollBridge.drag = (dy) => {
        if (!isExternalDrag) {
          isExternalDrag = true
          grant()
        }
        const to = dy + startY
        setAnimatedPositionDirect(resisted(to, minY))
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
        // once we own the drag, don't yield it to another responder
        // (re-renders during the drag were cooperatively terminating it under
        // load, killing the gesture mid-drag)
        onPanResponderTerminationRequest: () => false,
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

          setAnimatedPositionDirect(to)
        },
        onPanResponderEnd: finish,
        onPanResponderTerminate: finish,
        onPanResponderRelease: finish,
      })
    }, [
      disableDrag,
      isShowingInnerSheet,
      animateTo,
      frameSize,
      activePositions,
      setPosition,
      dismissOnSnapToBottom,
      snapPointsMode,
    ])

    // animate to the current keyboard-adjusted position when the keyboard state
    // changes. activePositions shift the frame up by keyboardHeight, capped at
    // the safe-area top; tall web fit sheets keep a frozen height and gain scroll
    // padding for whatever tail remains behind the keyboard.
    React.useEffect(() => {
      if (isDragging || isHidden || !open || disableAnimation) return
      if (!frameSize || !screenSize) return
      // timing animation matches the iOS keyboard animation (~250ms)
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
        // if the sheet was closed mid-drag the keyboard-hide handler was paused
        // and a hide could be left pending — clear it so isKeyboardVisible can't
        // stick true after the sheet is gone. (no-op for a normal close.)
        pauseKeyboardHandler.current = false
        flushPendingHide()
      }
    }, [open])

    React.useEffect(() => {
      if (!isWeb || !modal || !open || shouldHideParentSheet) return

      const layer = {}
      sheetEscapeLayers.push(layer)

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          // only the top-most open modal sheet responds so a nested sheet
          // doesn't take its parent down with it
          if (sheetEscapeLayers[sheetEscapeLayers.length - 1] === layer) {
            state.setOpen(false)
          }
        }
      }

      document.addEventListener('keydown', onKeyDown)
      return () => {
        const index = sheetEscapeLayers.indexOf(layer)
        if (index > -1) {
          sheetEscapeLayers.splice(index, 1)
        }
        document.removeEventListener('keydown', onKeyDown)
      }
    }, [modal, open, shouldHideParentSheet, state.setOpen])

    // gesture handler hook for RNGH-based gesture coordination
    const { panGesture, panGestureRef, gestureHandlerEnabled } = useGestureHandlerPan({
      positions: activePositions,
      frameSize,
      setPosition,
      animateTo,
      stopSpring,
      scrollBridge,
      setIsDragging,
      getCurrentPosition: getAnimatedPosition,
      resisted,
      disableDrag,
      isShowingInnerSheet,
      // directly set the animated value for smooth dragging
      setAnimatedPosition: setAnimatedPositionDirect,
      dismissOnSnapToBottom,
      snapPointsMode,
      isKeyboardVisible,
      pauseKeyboardHandler,
    })

    // ignore any layout measured while the soft keyboard is up (web +
    // moveOnKeyboardChange): the visual viewport (which RN's web layout follows)
    // shrinks, so the height would be the collapsed sheet — keeping it would
    // recompute the fit anchor and fly the frame. a LIVE DOM check, NOT the
    // isKeyboardVisible React state, is required: the state lags the resize, so
    // the first shrunk onLayout lands before the flag flips. holding the measured
    // size keeps the fit geometry stable while the frame translates with the kb.
    const ignoreLayoutForKeyboard = useEvent(
      () =>
        isWeb &&
        moveOnKeyboardChange &&
        getWebKeyboardResizeHeight() >= MIN_KEYBOARD_HEIGHT
    )

    const handleAnimationViewLayout = useEvent((e: LayoutChangeEvent) => {
      // don't update frameSize during exit animation to prevent position jumps
      if (!open && stableFrameSize.current !== 0) {
        return
      }

      const layoutHeight = e.nativeEvent?.layout.height
      // drop a layout measured while the keyboard is up: on older iOS the web
      // viewport shrinks and the frame would resize. keep the pre-keyboard frame
      // height so the web frame translates without resizing.
      // exception: if we have no frame height yet (sheet opened with the keyboard
      // already up), accept it so the sheet can appear at all.
      if (ignoreLayoutForKeyboard() && frameSize > 0) return

      // avoid bugs where it grows forever for whatever reason
      // For inline mode (non-modal), don't cap at window height - use actual layout
      const next = modal
        ? Math.min(layoutHeight, getStableViewportHeight())
        : layoutHeight
      if (!next) return
      // round: web onLayout reports sub-pixel heights (e.g. 499.99996) that jitter
      // frame to frame as the view transforms; the raw float would re-fire every
      // effect that depends on frameSize on each drag move.
      setFrameSize(Math.round(next))
    })

    const handleMaxContentViewLayout = React.useCallback(
      (e: LayoutChangeEvent) => {
        // keep maxContentSize at the full pre-keyboard viewport: drop layouts
        // measured while the keyboard is up (the shrunk viewport), unless we have
        // none yet (keyboard-already-up open).
        if (ignoreLayoutForKeyboard() && screenSize > 0) return
        // avoid bugs where it grows forever for whatever reason
        const next = Math.min(e.nativeEvent?.layout.height, getStableViewportHeight())
        if (!next) return
        // round to avoid sub-pixel churn re-firing size-dependent effects
        setMaxContentSize(Math.round(next))
      },
      [ignoreLayoutForKeyboard, screenSize]
    )

    const getAnimatedNumberStyle = React.useCallback(
      (val: number) => {
        'worklet'
        const translateY = frameSize === 0 ? hiddenSize : val

        return {
          transform: [{ translateY }],
        }
      },
      [frameSize]
    )

    const animatedStyle = useAnimatedNumberStyle(animatedNumber, getAnimatedNumberStyle)

    // we need to set this *after* fully closed to 0, to avoid it overlapping
    // the page when resizing quickly on web for example
    const [opacity, setOpacity] = React.useState(open ? 1 : 0)
    if (open && opacity === 0) {
      setOpacity(1)
      // cancel any pending close fallback — sheet is reopening
      if (opacityFallbackTimer.current) {
        clearTimeout(opacityFallbackTimer.current)
        opacityFallbackTimer.current = null
      }
    }

    const forcedContentHeight = hasFit
      ? undefined
      : snapPointsMode === 'percent'
        ? // Use dvh for modal (viewport-relative), % for inline (container-relative)
          `${maxSnapPoint}${isWeb ? (modal ? 'dvh' : '%') : '%'}`
        : maxSnapPoint

    const setHasScrollView = React.useCallback((val: boolean) => {
      hasScrollView.current = val
    }, [])
    const { overlayChildren, animatedChildren } = React.useMemo(
      () => partitionSheetChildren(props.children),
      [props.children]
    )
    let contents = (
      <LayoutMeasurementController disable={!open}>
        <ParentSheetContext.Provider value={nextParentContext}>
          <SheetProvider
            {...providerProps}
            keyboardOccludedHeight={keyboardOccludedHeight}
            isKeyboardVisible={isKeyboardVisible}
            keyboardStableFrameHeight={keyboardStableFrameHeight}
            setHasScrollView={setHasScrollView}
          >
            <GestureSheetProvider
              isDragging={isDragging}
              blockPan={blockPan}
              setBlockPan={setBlockPan}
              panGesture={panGesture}
              panGestureRef={panGestureRef}
            >
              <SheetOverlayLayerContext.Provider value>
                <AnimatePresence custom={{ open }}>
                  {shouldHideParentSheet || !open ? null : overlayChildren}
                </AnimatePresence>
              </SheetOverlayLayerContext.Provider>

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
                    opacity: shouldHideParentSheet
                      ? 0
                      : disableTransparencyHide
                        ? 1
                        : opacity,
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
                    {animatedChildren}
                  </GestureDetectorWrapper>
                ) : (
                  <View
                    {...panResponder?.panHandlers}
                    style={{ flex: 1, width: '100%', height: '100%' }}
                  >
                    {animatedChildren}
                  </View>
                )}
              </AnimatedView>
            </GestureSheetProvider>
          </SheetProvider>
        </ParentSheetContext.Provider>
      </LayoutMeasurementController>
    )

    if (process.env.TAMAGUI_TARGET === 'native' && needsPortalRepropagation()) {
      const adaptContext = useAdaptContext()
      contents = (
        <ProvideAdaptContext {...adaptContext}>
          {/* re-propagate safe-area insets across the teleport: the sheet content
              renders at the portal host, OUTSIDE the app's SafeAreaProvider, so
              without this useSafeAreaInsets() inside the sheet reads 0. */}
          <SafeAreaInsetsContext.Provider value={safeAreaInsets}>
            {/* @ts-ignore */}
            {contents}
          </SafeAreaInsetsContext.Provider>
        </ProvideAdaptContext>
      )
    }

    // start mounted so we get an accurate measurement the first time
    const shouldMountChildren = unmountChildrenWhenHidden ? !!opacity : true

    if (modal) {
      // a modal sheet is teleported through <Portal> to the root portal host.
      // that host is mounted by TamaguiProvider, which may sit ABOVE the app's
      // GestureHandlerRootView - so the teleported content lands outside any
      // rngh root and every gesture inside the sheet (the drag pan, pressables
      // on the rngh press path) silently goes dead. re-establish an rngh root
      // around the teleported content so it works regardless of where the app
      // mounts GestureHandlerRootView.
      //
      // the root stays mounted and full-width whenever the sheet content is
      // (so child layout/measurement/close-animation are unaffected) and only
      // collapses to 0 height while closed so it occupies no hit area - see
      // rnghRootStyleOpen/Closed above for why pointerEvents can't be used.
      const RNGHRoot = getGestureHandlerState().RootView
      const mountedContents = shouldMountChildren ? (
        <ContainerComponent>{contents}</ContainerComponent>
      ) : null
      const modalContents = (
        <Portal stackZIndex={zIndex} {...portalProps}>
          {mountedContents && RNGHRoot ? (
            <RNGHRoot style={open ? rnghRootStyleOpen : rnghRootStyleClosed}>
              {mountedContents}
            </RNGHRoot>
          ) : (
            mountedContents
          )}
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

function partitionSheetChildren(children: React.ReactNode) {
  const overlayChildren: React.ReactNode[] = []
  const animatedChildren: React.ReactNode[] = []

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      animatedChildren.push(child)
      return
    }

    const childType = child.type as {
      staticConfig?: {
        componentName?: string
      }
    }

    if (childType.staticConfig?.componentName === SHEET_OVERLAY_NAME) {
      overlayChildren.push(child)
      return
    }

    animatedChildren.push(child)
  })

  return {
    overlayChildren,
    animatedChildren,
  }
}

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

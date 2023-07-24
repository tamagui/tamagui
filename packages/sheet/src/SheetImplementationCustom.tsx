import { AdaptParentContext } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  Theme,
  isTouchable,
  isWeb,
  themeable,
  useAnimationDriver,
  useEvent,
  useIsomorphicLayoutEffect,
  useThemeName,
} from '@tamagui/core'
import { Portal } from '@tamagui/portal'
import { useKeyboardVisible } from '@tamagui/use-keyboard-visible'
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  GestureResponderEvent,
  Keyboard,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  View,
} from 'react-native'

import { HIDDEN_SIZE, SHEET_HIDDEN_STYLESHEET } from './constants'
import { ParentSheetContext, SheetInsideSheetContext } from './contexts'
import { resisted } from './helpers'
import { SheetProvider } from './SheetContext'
import { SheetProps } from './types'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetProviderProps } from './useSheetProviderProps'

export const SheetImplementationCustom = themeable(
  forwardRef<View, SheetProps>(function SheetImplementationCustom(props, forwardedRef) {
    const parentSheet = useContext(ParentSheetContext)

    const {
      animationConfig,
      modal = false,
      zIndex = parentSheet.zIndex + 1,
      moveOnKeyboardChange = false,
      unmountChildrenWhenHidden = false,
      portalProps,
    } = props

    const keyboardIsVisible = useKeyboardVisible()
    const state = useSheetOpenState(props)
    const [overlayComponent, setOverlayComponent] = useState<any>(null)
    const providerProps = useSheetProviderProps(props, state, {
      onOverlayComponent: setOverlayComponent,
    })
    const {
      frameSize,
      setFrameSize,
      snapPoints,
      position,
      setPosition,
      scrollBridge,
      screenSize,
      maxSnapPoint,
    } = providerProps
    const { open, controller, isHidden } = state

    const sheetRef = useRef<View>(null)
    const ref = useComposedRefs(forwardedRef, sheetRef)

    /**
     * This is a hacky workaround for native:
     */
    const [isShowingInnerSheet, setIsShowingInnerSheet] = useState(false)
    const shouldHideParentSheet = !isWeb && modal && isShowingInnerSheet
    const parentSheetContext = useContext(SheetInsideSheetContext)
    const onInnerSheet = useCallback((hasChild: boolean) => {
      setIsShowingInnerSheet(hasChild)
    }, [])

    const positions = useMemo(
      () => snapPoints.map((point) => getPercentSize(point, screenSize)),
      [frameSize, snapPoints]
    )

    const driver = useAnimationDriver()
    const { useAnimatedNumber, useAnimatedNumberStyle, useAnimatedNumberReaction } =
      driver

    // temp until reanimated useAnimatedNumber fix
    const AnimatedView = (driver['NumberView'] ?? driver.View) as typeof Animated.View

    useIsomorphicLayoutEffect(() => {
      if (!(parentSheetContext && open)) return
      parentSheetContext(true)
      return () => {
        parentSheetContext(false)
      }
    }, [parentSheetContext, open])

    const nextParentContext = useMemo(
      () => ({
        zIndex,
      }),
      [zIndex]
    )

    const animatedNumber = useAnimatedNumber(HIDDEN_SIZE)
    const at = useRef(HIDDEN_SIZE)

    useAnimatedNumberReaction(
      {
        value: animatedNumber,
        hostRef: sheetRef,
      },
      useCallback((value) => {
        if (!driver.isReactNative) return
        at.current = value
        scrollBridge.paneY = value
      }, [])
    )

    function stopSpring() {
      animatedNumber.stop()
      if (scrollBridge.onFinishAnimate) {
        scrollBridge.onFinishAnimate()
        scrollBridge.onFinishAnimate = undefined
      }
    }

    const hasntMeasured = at.current === HIDDEN_SIZE

    const animateTo = useEvent((position: number) => {
      if (frameSize === 0) return

      let toValue = isHidden || position === -1 ? screenSize : positions[position]

      if (at.current === toValue) return
      at.current = toValue

      stopSpring()

      if (hasntMeasured || isHidden) {
        // first run, we need to set to screen size before running
        animatedNumber.setValue(screenSize, {
          type: 'timing',
          duration: 0,
        })

        if (isHidden) {
          return
        }

        toValue = positions[position]
        at.current = toValue
      }

      animatedNumber.setValue(toValue, {
        ...animationConfig,
        type: 'spring',
      })
    })

    useIsomorphicLayoutEffect(() => {
      if (screenSize && hasntMeasured) {
        animatedNumber.setValue(screenSize, {
          type: 'timing',
          duration: 0,
        })
      }
    }, [hasntMeasured, screenSize])

    useIsomorphicLayoutEffect(() => {
      if (!frameSize || isHidden || (hasntMeasured && !open)) {
        return
      }
      animateTo(position)
    }, [isHidden, frameSize, open, position])

    const disableDrag = props.disableDrag ?? controller?.disableDrag
    const themeName = useThemeName()

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
      (e: LayoutChangeEvent) => {
        const next = (() => {
          let _ = e.nativeEvent?.layout.height
          if (isWeb && isTouchable && !open) {
            // temp fix ios bug where it doesn't go below dynamic bottom...
            _ += 100
          }
          return _
        })()

        if (!next) return
        setFrameSize(next)
      },
      [keyboardIsVisible]
    )

    const animatedStyle = useAnimatedNumberStyle(animatedNumber, (val) => {
      'worklet'
      const translateY = frameSize === 0 ? HIDDEN_SIZE : val
      return {
        transform: [{ translateY }],
      }
    })

    const sizeBeforeKeyboard = useRef<number | null>(null)
    useEffect(() => {
      if (isWeb || !moveOnKeyboardChange) return
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
        if (sizeBeforeKeyboard.current !== null) return
        sizeBeforeKeyboard.current = animatedNumber.getValue()
        animatedNumber.setValue(
          Math.max(animatedNumber.getValue() - e.endCoordinates.height, 0)
        )
      })
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        if (sizeBeforeKeyboard.current === null) return
        animatedNumber.setValue(sizeBeforeKeyboard.current)
        sizeBeforeKeyboard.current = null
      })

      return () => {
        keyboardDidHideListener.remove()
        keyboardDidShowListener.remove()
      }
    }, [moveOnKeyboardChange])

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

    const contents = (
      <ParentSheetContext.Provider value={nextParentContext}>
        <SheetProvider {...providerProps}>
          {shouldHideParentSheet ? null : overlayComponent}

          <AnimatedView
            ref={ref}
            {...panResponder?.panHandlers}
            onLayout={handleAnimationViewLayout}
            pointerEvents={open && !shouldHideParentSheet ? 'auto' : 'none'}
            //  @ts-ignore
            animation={props.animation}
            style={[
              {
                position: 'absolute',
                zIndex,
                width: '100%',
                height: `${maxSnapPoint}%`,
                minHeight: `${maxSnapPoint}%`,
                opacity,
              },
              animatedStyle,
            ]}
          >
            {props.children}
          </AnimatedView>
        </SheetProvider>
      </ParentSheetContext.Provider>
    )

    const adaptContext = useContext(AdaptParentContext)

    // start mounted so we get an accurate measurement the first time
    const shouldMountChildren = Boolean(opacity || !unmountChildrenWhenHidden)

    if (modal) {
      const modalContents = (
        <Portal zIndex={zIndex} {...portalProps}>
          {shouldMountChildren && (
            <Theme forceClassName name={themeName}>
              <AdaptParentContext.Provider value={adaptContext}>
                {contents}
              </AdaptParentContext.Provider>
            </Theme>
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
  })
)

function getPercentSize(point?: number, screenSize?: number) {
  if (!screenSize) return 0
  if (point === undefined) {
    console.warn('No snapPoint')
    return 0
  }
  const pct = point / 100
  const next = Math.round(screenSize - pct * screenSize)

  return next
}

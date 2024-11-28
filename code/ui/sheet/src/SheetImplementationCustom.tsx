import { ProvideAdaptContext, useAdaptContext } from '@tamagui/adapt'
import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  currentPlatform,
  isClient,
  isWeb,
  useIsomorphicLayoutEffect,
} from '@tamagui/constants'
import {
  getConfig,
  Stack,
  Theme,
  useConfiguration,
  useEvent,
  useThemeName,
} from '@tamagui/core'
import { Portal, USE_NATIVE_PORTAL } from '@tamagui/portal'
import React, { useId } from 'react'
import type {
  Animated,
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponderGestureState,
} from 'react-native'
import { Dimensions, Keyboard, PanResponder, View } from 'react-native'
import { ParentSheetContext, SheetInsideSheetContext } from './contexts'
import { resisted } from './helpers'
import { SheetProvider } from './SheetContext'
import type { SheetProps, SnapPointsMode } from './types'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetProviderProps } from './useSheetProviderProps'

let hiddenSize = 10_000.1

let sheetHiddenStyleSheet: HTMLStyleElement | null = null

// on web we are always relative to window, on to screen
const relativeDimensionTo = isWeb ? 'window' : 'screen'

export const SheetImplementationCustom = React.forwardRef<View, SheetProps>(
  function SheetImplementationCustom(props, forwardedRef) {
    const parentSheet = React.useContext(ParentSheetContext)

    const {
      animation,
      animationConfig: animationConfigProp,
      modal = false,
      zIndex = parentSheet.zIndex + 1,
      moveOnKeyboardChange = false,
      unmountChildrenWhenHidden = false,
      portalProps,
      containerComponent: ContainerComponent = React.Fragment,
    } = props

    const state = useSheetOpenState(props)
    const [overlayComponent, setOverlayComponent] = React.useState<any>(null)

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

    const sheetRef = React.useRef<View>(null)
    const ref = useComposedRefs(forwardedRef, sheetRef, providerProps.contentRef as any)

    // TODO this can be extracted into a helper getAnimationConfig(animationProp as array | string)
    const animationConfig = (() => {
      const [animationProp, animationPropConfig] = !animation
        ? []
        : Array.isArray(animation)
          ? animation
          : ([animation] as const)
      return (
        animationConfigProp ??
        (animationProp
          ? {
              ...(getConfig().animations.animations[animationProp as string] as Object),
              ...animationPropConfig,
            }
          : null)
      )
    })()

    /**
     * This is a hacky workaround for native:
     */
    const [isShowingInnerSheet, setIsShowingInnerSheet] = React.useState(false)
    const shouldHideParentSheet =
      !isWeb &&
      modal &&
      isShowingInnerSheet &&
      // if not using weird portal limitation we dont need to hide parent sheet
      USE_NATIVE_PORTAL

    const sheetInsideSheet = React.useContext(SheetInsideSheetContext)
    const onInnerSheet = React.useCallback((hasChild: boolean) => {
      setIsShowingInnerSheet(hasChild)
    }, [])

    const positions = React.useMemo(
      () =>
        snapPoints.map((point) =>
          getYPositions(snapPointsMode, point, screenSize, frameSize)
        ),
      [screenSize, frameSize, snapPoints, snapPointsMode]
    )

    const { animationDriver } = useConfiguration()
    const { useAnimatedNumber, useAnimatedNumberStyle, useAnimatedNumberReaction } =
      animationDriver
    const AnimatedView = (animationDriver.View ?? Stack) as typeof Animated.View

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

    const animatedNumber = useAnimatedNumber(hiddenSize)
    const at = React.useRef(hiddenSize)

    useAnimatedNumberReaction(
      {
        value: animatedNumber,
        hostRef: sheetRef,
      },
      React.useCallback(
        (value) => {
          at.current = value
          scrollBridge.paneY = value
        },
        [animationDriver]
      )
    )

    function stopSpring() {
      animatedNumber.stop()
      if (scrollBridge.onFinishAnimate) {
        scrollBridge.onFinishAnimate()
        scrollBridge.onFinishAnimate = undefined
      }
    }

    const hasntMeasured = at.current === hiddenSize

    const animateTo = useEvent((position: number) => {
      if (frameSize === 0) return

      let toValue = isHidden || position === -1 ? screenSize : positions[position]

      if (at.current === toValue) return
      at.current = toValue

      stopSpring()

      if (hasntMeasured || isHidden) {
        // first run, we need to set to screen size before running
        animatedNumber.setValue(
          screenSize,
          {
            type: 'timing',
            duration: 0,
          },
          () => {
            if (isHidden) {
              return
            }

            toValue = positions[position]
            at.current = toValue

            animatedNumber.setValue(toValue, {
              type: 'spring',
              ...animationConfig,
            })
          }
        )
        return
      }

      animatedNumber.setValue(toValue, {
        type: 'spring',
        ...animationConfig,
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
      if (!frameSize || !screenSize || isHidden || (hasntMeasured && !open)) {
        return
      }
      animateTo(position)
    }, [isHidden, frameSize, screenSize, open, position])

    const disableDrag = props.disableDrag ?? controller?.disableDrag
    const themeName = useThemeName()
    const [isDragging, setIsDragging] = React.useState(false)

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
        if (isClient) {
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

      const release = ({ vy, dragAt }: { dragAt: number; vy: number }) => {
        isExternalDrag = false
        previouslyScrolling = false
        setPanning(false)
        const at = dragAt + startY
        // seems liky vy goes up to about 4 at the very most (+ is down, - is up)
        // lets base our multiplier on the total layout height
        const end = at + frameSize * vy * 0.2
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
      ) => {
        // if dragging handle always allow:
        if (e.target === providerProps.handleRef.current) {
          return true
        }

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
            // TODO: pulling past the limit breaks scroll on native, need to better make ScrollView
            if (!isWeb) {
              return false
            }
          }
        }
        // we could do some detection of other touchables and cancel here..
        return Math.abs(dy) > 5
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
    }, [disableDrag, isShowingInnerSheet, animateTo, frameSize, positions, setPosition])

    const handleAnimationViewLayout = React.useCallback((e: LayoutChangeEvent) => {
      // avoid bugs where it grows forever for whatever reason
      const next = Math.min(
        e.nativeEvent?.layout.height,
        Dimensions.get(relativeDimensionTo).height
      )
      if (!next) return
      setFrameSize(next)
    }, [])

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

    const sizeBeforeKeyboard = React.useRef<number | null>(null)
    React.useEffect(() => {
      if (isWeb || !moveOnKeyboardChange) return
      const keyboardShowListener = Keyboard.addListener(
        currentPlatform === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        (e) => {
          if (sizeBeforeKeyboard.current !== null) return
          sizeBeforeKeyboard.current =
            isHidden || position === -1 ? screenSize : positions[position]
          animatedNumber.setValue(
            Math.max(sizeBeforeKeyboard.current - e.endCoordinates.height, 0),
            {
              type: 'timing',
              duration: 250,
            }
          )
        }
      )
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        if (sizeBeforeKeyboard.current === null) return
        animatedNumber.setValue(sizeBeforeKeyboard.current, {
          type: 'timing',
          duration: 250,
        })
        sizeBeforeKeyboard.current = null
      })

      return () => {
        keyboardDidHideListener.remove()
        keyboardShowListener.remove()
      }
    }, [moveOnKeyboardChange, positions, position, isHidden])

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
        ? `${maxSnapPoint}${isWeb ? 'dvh' : '%'}`
        : maxSnapPoint

    const id = useId()
    // const { AdaptProvider, when, children } = useAdaptParent({
    //   scope: `${id}Sheet`,
    //   portal: true,
    // })

    let contents = (
      <ParentSheetContext.Provider value={nextParentContext}>
        <SheetProvider {...providerProps}>
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
            {...panResponder?.panHandlers}
            onLayout={handleAnimationViewLayout}
            {...(!isDragging && {
              // @ts-ignore for CSS driver this is necessary to attach the transition
              animation,
            })}
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
            {/* <AdaptProvider>{props.children}</AdaptProvider> */}
            {props.children}
          </AnimatedView>
        </SheetProvider>
      </ParentSheetContext.Provider>
    )

    if (!USE_NATIVE_PORTAL) {
      const adaptContext = useAdaptContext()
      contents = <ProvideAdaptContext {...adaptContext}>{contents}</ProvideAdaptContext>
    }

    // start mounted so we get an accurate measurement the first time
    const shouldMountChildren = unmountChildrenWhenHidden ? !!opacity : true

    if (modal) {
      const modalContents = (
        <Portal stackZIndex={zIndex} {...portalProps}>
          {shouldMountChildren && (
            <ContainerComponent>
              <Theme forceClassName name={themeName}>
                {contents}
              </Theme>
            </ContainerComponent>
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

function getYPositions(
  mode: SnapPointsMode,
  point: string | number,
  screenSize?: number,
  frameSize?: number
) {
  if (!screenSize || !frameSize) return 0

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
      const next = Math.round(screenSize - pct * screenSize)
      return next
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

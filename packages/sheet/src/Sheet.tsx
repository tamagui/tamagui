import { AdaptParentContext } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  Theme,
  isClient,
  isTouchable,
  isWeb,
  mergeEvent,
  styled,
  themeable,
  useAnimationDriver,
  useDidFinishSSR,
  useEvent,
  useIsomorphicLayoutEffect,
  useThemeName,
  withStaticProperties,
} from '@tamagui/core'
import { Portal } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { ThemeableStack, XStack, XStackProps, YStack, YStackProps } from '@tamagui/stacks'
import { useKeyboardVisible } from '@tamagui/use-keyboard-visible'
import React, {
  FunctionComponent,
  RefAttributes,
  createContext,
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
  PanResponder,
  PanResponderGestureState,
  Platform,
  View,
} from 'react-native'

import { SHEET_HANDLE_NAME, SHEET_NAME } from './constants'
import { getNativeSheet } from './nativeSheet'
import { SheetProvider, useSheetContext } from './SheetContext'
import { SheetScrollView } from './SheetScrollView'
import { SheetProps, SheetScopedProps } from './types'
import { useSheetChildren } from './useSheetChildren'
import {
  SheetControllerContext,
  SheetControllerContextValue,
  useSheetContoller,
} from './useSheetContoller'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetProviderProps } from './useSheetProviderProps'

export { createSheetScope } from './SheetContext'
export * from './types'

/* -------------------------------------------------------------------------------------------------
 * SheetHandle
 * -----------------------------------------------------------------------------------------------*/

export const SheetHandleFrame = styled(XStack, {
  name: SHEET_HANDLE_NAME,

  variants: {
    open: {
      true: {
        pointerEvents: 'auto',
      },
      false: {
        opacity: 0,
        pointerEvents: 'none',
      },
    },

    unstyled: {
      false: {
        height: 10,
        borderRadius: 100,
        backgroundColor: '$background',
        zIndex: 10,
        marginHorizontal: '35%',
        marginBottom: '$2',
        opacity: 0.5,

        hoverStyle: {
          opacity: 0.7,
        },
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

export const SheetHandle = SheetHandleFrame.extractable(
  ({ __scopeSheet, ...props }: SheetScopedProps<XStackProps>) => {
    const context = useSheetContext(SHEET_HANDLE_NAME, __scopeSheet)
    return (
      <SheetHandleFrame
        onPress={() => {
          // don't toggle to the bottom snap position when dismissOnSnapToBottom set
          const max = context.snapPoints.length + (context.dismissOnSnapToBottom ? -1 : 0)
          const nextPos = (context.position + 1) % max
          context.setPosition(nextPos)
        }}
        open={context.open}
        {...props}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * SheetOverlay
 * -----------------------------------------------------------------------------------------------*/

const SHEET_OVERLAY_NAME = 'SheetOverlay'

export const SheetOverlayFrame = styled(ThemeableStack, {
  name: SHEET_OVERLAY_NAME,

  variants: {
    closed: {
      true: {
        opacity: 0,
        pointerEvents: 'none',
      },
      false: {
        pointerEvents: 'auto',
      },
    },

    unstyled: {
      false: {
        fullscreen: true,
        position: 'absolute',
        backgrounded: true,
        zIndex: 100_000,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

export type SheetOverlayProps = GetProps<typeof SheetOverlayFrame>

export const SheetOverlay = SheetOverlayFrame.extractable(
  ({ __scopeSheet, ...props }: SheetScopedProps<SheetOverlayProps>) => {
    const context = useSheetContext(SHEET_OVERLAY_NAME, __scopeSheet)
    return (
      <SheetOverlayFrame
        closed={!context.open || context.hidden}
        {...props}
        onPress={mergeEvent(
          props.onPress as any,
          context.dismissOnOverlayPress
            ? () => {
                context.setOpen(false)
              }
            : undefined
        )}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * Sheet
 * -----------------------------------------------------------------------------------------------*/

const selectionStyleSheet = isClient ? document.createElement('style') : null
if (selectionStyleSheet) {
  document.head.appendChild(selectionStyleSheet)
}

export const SheetFrameFrame = styled(YStack, {
  name: SHEET_NAME,

  variants: {
    unstyled: {
      false: {
        flex: 1,
        backgroundColor: '$background',
        borderTopLeftRadius: '$true',
        borderTopRightRadius: '$true',
        width: '100%',
        maxHeight: '100%',
        overflow: 'hidden',
        pointerEvents: 'auto',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

export const SheetFrame = SheetFrameFrame.extractable(
  forwardRef(
    ({ __scopeSheet, ...props }: SheetScopedProps<YStackProps>, forwardedRef) => {
      const context = useSheetContext(SHEET_NAME, __scopeSheet)
      const composedContentRef = useComposedRefs(forwardedRef, context.contentRef)
      return <SheetFrameFrame ref={composedContentRef} {...props} />
    }
  )
)

// set all the way off screen
const HIDDEN_SIZE = 10_000

const sheetComponents = {
  Handle: SheetHandle,
  Frame: SheetFrame,
  Overlay: SheetOverlay,
  ScrollView: SheetScrollView,
}

const ParentSheetContext = createContext({
  zIndex: 100_000,
})

export const Sheet = withStaticProperties(
  forwardRef<View, SheetProps>(function Sheet(props, ref) {
    const hydrated = useDidFinishSSR()
    const { isShowingNonSheet } = useSheetContoller()

    let SheetImplementation = SheetImplementationCustom

    if (props.native && Platform.OS === 'ios') {
      if (process.env.TAMAGUI_TARGET === 'native') {
        const impl = getNativeSheet('ios')
        if (impl) {
          SheetImplementation = impl
        }
      }
    }

    /**
     * Performance is sensitive here so avoid all the hooks below with this
     */
    if (isShowingNonSheet || !hydrated) {
      return null
    }

    return <SheetImplementation ref={ref} {...props} />
  }),
  sheetComponents
)

const SheetImplementationCustom = themeable(
  forwardRef<View, SheetProps>(function SheetImplementationCustom(props, forwardedRef) {
    const parentSheet = useContext(ParentSheetContext)

    const {
      animationConfig,
      dismissOnSnapToBottom = false,
      forceRemoveScrollEnabled = null,
      disableDrag: disableDragProp,
      modal = false,
      zIndex = parentSheet.zIndex + 1,
      moveOnKeyboardChange = false,
      portalProps,
    } = props

    const state = useSheetOpenState(props)
    const providerProps = useSheetProviderProps(props, state)

    const {
      snapPoints,
      position,
      contentRef,
      setPosition,
      setPositionImmediate,
      scrollBridge,
      frameSize,
      setFrameSize,
    } = providerProps

    const { open, isHidden, controller } = state

    const { frameComponent, handleComponent, overlayComponent } = useSheetChildren(
      props.children
    )

    if (process.env.NODE_ENV === 'development') {
      if (snapPoints.some((p) => p < 0 || p > 100)) {
        console.warn(
          '⚠️ Invalid snapPoint given, snapPoints must be between 0 and 100, equal to percent height of frame'
        )
      }
    }

    const sheetRef = useRef<View>(null)
    const ref = useComposedRefs(forwardedRef, sheetRef)

    const driver = useAnimationDriver()
    if (!driver) {
      throw new Error('Must set animations in tamagui.config.ts')
    }

    const disableDrag = disableDragProp ?? controller?.disableDrag
    const keyboardIsVisible = useKeyboardVisible()
    const themeName = useThemeName()

    // reset position to fully open on re-open after dismissOnSnapToBottom
    if (open && dismissOnSnapToBottom && position === snapPoints.length - 1) {
      setPositionImmediate(0)
    }

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

    // open must set position
    const shouldSetPositionOpen = open && position < 0
    useEffect(() => {
      if (shouldSetPositionOpen) {
        setPosition(0)
      }
    }, [setPosition, shouldSetPositionOpen])

    const maxSnapPoint = snapPoints.reduce((prev, cur) => Math.max(prev, cur))
    const screenSize = frameSize / (maxSnapPoint / 100)

    const positions = useMemo(
      () => snapPoints.map((point) => getPercentSize(point, screenSize)),
      [frameSize, snapPoints]
    )

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

    const animateTo = useEvent((position: number) => {
      const current = animatedNumber.getValue()
      if (isHidden && open) return
      if (!current) return
      if (frameSize === 0) return
      const hiddenValue = frameSize === 0 ? HIDDEN_SIZE : screenSize
      const toValue = isHidden || position === -1 ? hiddenValue : positions[position]
      if (at.current === toValue) return
      stopSpring()
      if (isHidden) {
        animatedNumber.setValue(toValue, {
          type: 'timing',
          duration: 0,
        })
        at.current = toValue
        return
      }
      // dont bounce on initial measure to bottom
      const overshootClamping = at.current === HIDDEN_SIZE
      animatedNumber.setValue(toValue, {
        ...animationConfig,
        type: 'spring',
        overshootClamping,
      })
    })

    useIsomorphicLayoutEffect(() => {
      animateTo(position)
    }, [isHidden, frameSize, position, animateTo])

    /**
     * This is a hacky workaround for native:
     */
    const [isShowingInnerSheet, setIsShowingInnerSheet] = useState(false)
    const shouldHideParentSheet = !isWeb && modal && isShowingInnerSheet
    const parentSheetContext = useContext(SheetInsideSheetContext)
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
          if (!selectionStyleSheet) return
          if (!val) {
            selectionStyleSheet.innerText = ''
          } else {
            selectionStyleSheet.innerText =
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
    }, [])

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

    const handleLayout = useCallback(
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

    const removeScrollEnabled = forceRemoveScrollEnabled ?? (open && modal)

    const contents = (
      <ParentSheetContext.Provider value={nextParentContext}>
        <SheetProvider {...providerProps}>
          {shouldHideParentSheet ? null : overlayComponent}

          <AnimatedView
            ref={ref}
            {...panResponder?.panHandlers}
            onLayout={handleLayout}
            pointerEvents={open && !shouldHideParentSheet ? 'auto' : 'none'}
            //  @ts-ignore
            animation={props.animation}
            style={[
              {
                position: 'absolute',
                zIndex,
                width: '100%',
                height: `${maxSnapPoint}%`,
                opacity,
              },
              animatedStyle,
            ]}
          >
            {handleComponent}

            {/* @ts-ignore */}
            <RemoveScroll
              forwardProps
              enabled={removeScrollEnabled}
              allowPinchZoom
              shards={[contentRef]}
              // causes lots of bugs on touch web on site
              removeScrollBar={false}
            >
              {frameComponent}
            </RemoveScroll>
          </AnimatedView>
        </SheetProvider>
      </ParentSheetContext.Provider>
    )

    const adaptContext = useContext(AdaptParentContext)

    if (modal) {
      const modalContents = (
        <Portal zIndex={zIndex} {...portalProps}>
          <Theme forceClassName name={themeName}>
            <AdaptParentContext.Provider value={adaptContext}>
              {contents}
            </AdaptParentContext.Provider>
          </Theme>
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

const SheetInsideSheetContext = createContext<((hasChild: boolean) => void) | null>(null)

export const ControlledSheet = Sheet as FunctionComponent<
  Omit<SheetProps, 'open' | 'onOpenChange'> & RefAttributes<View>
> &
  typeof sheetComponents

/* -------------------------------------------------------------------------------------------------*/

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

function resisted(y: number, minY: number, maxOverflow = 25) {
  if (y < minY) {
    const past = minY - y
    const pctPast = Math.min(maxOverflow, past) / maxOverflow
    const diminishBy = 1.1 - Math.pow(0.1, pctPast)
    const extra = -diminishBy * maxOverflow
    return minY + extra
  }
  return y
}

export const SheetController = ({
  children,
  onOpenChange: onOpenChangeProp,
  ...value
}: Partial<SheetControllerContextValue> & { children?: React.ReactNode }) => {
  const onOpenChange = useEvent(onOpenChangeProp)

  const memoValue = useMemo(
    () => ({
      open: value.open,
      hidden: value.hidden,
      disableDrag: value.disableDrag,
      onOpenChange,
    }),
    [onOpenChange, value.open, value.hidden, value.disableDrag]
  )

  return (
    <SheetControllerContext.Provider value={memoValue}>
      {children}
    </SheetControllerContext.Provider>
  )
}

import { AdaptParentContext } from '@tamagui/adapt'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  StackProps,
  TamaguiComponentExpectingVariants,
  Theme,
  isClient,
  isTouchable,
  isWeb,
  mergeEvent,
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
import { useKeyboardVisible } from '@tamagui/use-keyboard-visible'
import {
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

import { SHEET_HANDLE_NAME, SHEET_NAME, SHEET_OVERLAY_NAME } from './constants'
import { getNativeSheet } from './nativeSheet'
import { SheetProvider, useSheetContext } from './SheetContext'
import { SheetScrollView } from './SheetScrollView'
import { SheetProps, SheetScopedProps } from './types'
import { useSheetChildren } from './useSheetChildren'
import { useSheetController } from './useSheetController'
import { useSheetOpenState } from './useSheetOpenState'
import { useSheetProviderProps } from './useSheetProviderProps'
import { useSheetSnapPoints } from './useSheetSnapPoints'

type SharedSheetProps = {
  open?: boolean
}

type BaseProps = StackProps & SharedSheetProps

export type CreateSheetProps = {
  Frame: TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>
  Handle: TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>
  Overlay: TamaguiComponentExpectingVariants<BaseProps, SharedSheetProps>
}

const selectionStyleSheet = isClient ? document.createElement('style') : null
if (selectionStyleSheet) {
  document.head.appendChild(selectionStyleSheet)
}

export function createSheet({ Handle, Frame, Overlay }: CreateSheetProps) {
  const SheetHandle = Handle.extractable(
    ({ __scopeSheet, ...props }: SheetScopedProps<GetProps<typeof Handle>>) => {
      const context = useSheetContext(SHEET_HANDLE_NAME, __scopeSheet)
      return (
        <Handle
          onPress={() => {
            // don't toggle to the bottom snap position when dismissOnSnapToBottom set
            const max =
              context.snapPoints.length + (context.dismissOnSnapToBottom ? -1 : 0)
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

  const SheetOverlay = Overlay.extractable(
    ({ __scopeSheet, ...props }: SheetScopedProps<GetProps<typeof Overlay>>) => {
      const context = useSheetContext(SHEET_OVERLAY_NAME, __scopeSheet)
      return (
        <Overlay
          open={context.open && !context.hidden}
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

  const SheetFrame = Frame.extractable(
    forwardRef(
      (
        { __scopeSheet, ...props }: SheetScopedProps<GetProps<typeof Frame>>,
        forwardedRef
      ) => {
        const context = useSheetContext(SHEET_NAME, __scopeSheet)
        const composedContentRef = useComposedRefs(forwardedRef, context.contentRef)
        return <Frame ref={composedContentRef} {...props} />
      }
    )
  )

  const Sheet = forwardRef<View, SheetProps>(function Sheet(props, ref) {
    const hydrated = useDidFinishSSR()
    const { isShowingNonSheet } = useSheetController()

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
  })

  const components = {
    Frame: SheetFrame,
    Overlay: SheetOverlay,
    Handle: SheetHandle,
    ScrollView: SheetScrollView,
  }

  const Controlled = withStaticProperties(Sheet, components) as any as FunctionComponent<
    Omit<SheetProps, 'open' | 'onOpenChange'> & RefAttributes<View>
  > &
    typeof components

  return withStaticProperties(Sheet, {
    ...components,
    Controlled,
  })
}

// set all the way off screen
const HIDDEN_SIZE = 10_000

const ParentSheetContext = createContext({
  zIndex: 100_000,
})

const SheetImplementationCustom = themeable(
  forwardRef<View, SheetProps>(function SheetImplementationCustom(props, forwardedRef) {
    const parentSheet = useContext(ParentSheetContext)

    const {
      animationConfig,
      forceRemoveScrollEnabled = null,
      disableDrag: disableDragProp,
      modal = false,
      zIndex = parentSheet.zIndex + 1,
      moveOnKeyboardChange = false,
      portalProps,
    } = props

    const state = useSheetOpenState(props)
    const providerProps = useSheetProviderProps(props, state)
    const { positions, maxSnapPoint, screenSize } = useSheetSnapPoints(providerProps)

    const { position, contentRef, setPosition, scrollBridge, frameSize, setFrameSize } =
      providerProps

    const { open, isHidden, controller } = state

    const {
      frameComponent,
      handleComponent,
      bottomCoverComponent,
      overlayComponent,
      rest,
    } = useSheetChildren(props.children)

    const sheetRef = useRef<View>(null)
    const ref = useComposedRefs(forwardedRef, sheetRef)

    const driver = useAnimationDriver()
    if (!driver) {
      throw new Error('Must set animations in tamagui.config.ts')
    }

    const disableDrag = disableDragProp ?? controller?.disableDrag
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
            {bottomCoverComponent}

            {/* somewhat temporary we need to move to properly support children */}
            {rest}

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

/* -------------------------------------------------------------------------------------------------*/

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

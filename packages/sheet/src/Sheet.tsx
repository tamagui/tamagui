import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  Slot,
  TamaguiElement,
  Theme,
  getAnimationDriver,
  isClient,
  isWeb,
  mergeEvent,
  styled,
  themeable,
  useConstant,
  useEvent,
  useIsomorphicLayoutEffect,
  useThemeName,
  withStaticProperties,
} from '@tamagui/core'
import { Portal } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { XStack, XStackProps, YStack, YStackProps } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, {
  FunctionComponent,
  RefAttributes,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { GestureResponderEvent, PanResponder, PanResponderGestureState, View } from 'react-native'

import { SHEET_HANDLE_NAME, SHEET_NAME } from './SHEET_HANDLE_NAME'
import { SheetProvider, useSheetContext } from './SheetContext'
import { SheetScrollView } from './SheetScrollView'
import { ScrollBridge, SheetProps, SheetScopedProps } from './types'

export { createSheetScope } from './SheetContext'

/* -------------------------------------------------------------------------------------------------
 * SheetHandle
 * -----------------------------------------------------------------------------------------------*/

export const SheetHandleFrame = styled(XStack, {
  name: SHEET_HANDLE_NAME,
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
  } as const,
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

export const SheetOverlayFrame = styled(YStack, {
  name: SHEET_OVERLAY_NAME,
  // TODO this should be $background without opacity and just customized by theme
  backgroundColor: '$color',
  fullscreen: true,
  opacity: 0.2,
  zIndex: 0,

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
  } as const,
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
          props.onPress,
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
  flex: 1,
  backgroundColor: '$background',
  borderTopLeftRadius: '$4',
  borderTopRightRadius: '$4',
  width: '100%',
  maxHeight: '100%',
  overflow: 'hidden',
  pointerEvents: 'auto',
})

export const SheetFrame = SheetFrameFrame.extractable(
  forwardRef(({ __scopeSheet, ...props }: SheetScopedProps<YStackProps>, forwardedRef) => {
    const context = useSheetContext(SHEET_NAME, __scopeSheet)
    const composedContentRef = useComposedRefs(forwardedRef, context.contentRef)
    return <SheetFrameFrame ref={composedContentRef} {...props} />
  })
)

// set all the way off screen
const HIDDEN_SIZE = 10_000

const sheetComponents = {
  Handle: SheetHandle,
  Frame: SheetFrame,
  Overlay: SheetOverlay,
  ScrollView: SheetScrollView,
}

export const Sheet = withStaticProperties(
  themeable(
    forwardRef<View, SheetProps>(function Sheet(props, ref) {
      const {
        __scopeSheet,
        snapPoints: snapPointsProp = [80],
        open: openProp,
        defaultOpen,
        children: childrenProp,
        position: positionProp,
        onPositionChange,
        onOpenChange,
        defaultPosition,
        dismissOnOverlayPress = true,
        animationConfig,
        dismissOnSnapToBottom = false,
        disableDrag: disableDragProp,
        modal = false,
        handleDisableScroll = true,
        zIndex = 40,
      } = props

      if (process.env.NODE_ENV === 'development') {
        if (snapPointsProp.some((p) => p < 0 || p > 100)) {
          // eslint-disable-next-line no-console
          console.warn(
            `⚠️ Invalid snapPoint given, snapPoints must be between 0 and 100, equal to percent height of frame`
          )
        }
      }

      const driver = getAnimationDriver()
      if (!driver) {
        throw new Error(`Must set animations in tamagui.config.ts`)
      }

      // allows for sheets to be controlled by other components
      const controller = useContext(SheetControllerContext)
      const isHidden = controller?.hidden || false
      const disableDrag = disableDragProp ?? controller?.disableDrag
      const themeName = useThemeName()
      const contentRef = React.useRef<TamaguiElement>(null)
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

      const onOpenChangeInternal = (val: boolean) => {
        controller?.onOpenChange?.(val)
        onOpenChange?.(val)
      }

      const [open, setOpen] = useControllableState({
        prop: controller?.open ?? openProp,
        defaultProp: defaultOpen || true,
        onChange: onOpenChangeInternal,
        strategy: 'most-recent-wins',
      })

      const [frameSize, setFrameSize] = useState<number>(0)

      const snapPoints = useMemo(
        () => (dismissOnSnapToBottom ? [...snapPointsProp, 0] : snapPointsProp),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [JSON.stringify(snapPointsProp), dismissOnSnapToBottom]
      )

      // lets set -1 to be always the "open = false" position
      const [position_, setPosition_] = useControllableState({
        prop: positionProp,
        defaultProp: defaultPosition || (open ? 0 : -1),
        onChange: onPositionChange,
        strategy: 'most-recent-wins',
      })
      const position = open === false ? -1 : position_

      // reset position to fully open on re-open after dismissOnSnapToBottom
      if (open && dismissOnSnapToBottom && position === snapPoints.length - 1) {
        setPosition_(0)
      }

      const setPosition = useCallback(
        (next: number) => {
          // close on dismissOnSnapToBottom (and set position so it animates)
          if (dismissOnSnapToBottom && next === snapPoints.length - 1) {
            setOpen(false)
          } else {
            setPosition_(next)
          }
        },
        [dismissOnSnapToBottom, snapPoints.length, setPosition_, setOpen]
      )

      const animatedNumber = driver.useAnimatedNumber(HIDDEN_SIZE)

      // native only fix
      const at = useRef(0)
      driver.useAnimatedNumberReaction(animatedNumber, (value) => {
        at.current = value
        scrollBridge.paneY = value
      })

      const [isResizing, setIsResizing] = useState(true)
      useIsomorphicLayoutEffect(() => {
        if (!isResizing) {
          setIsResizing(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [modal])

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

      const positions = useMemo(
        () => snapPoints.map((point) => getPercentSize(point, frameSize)),
        [frameSize, snapPoints]
      )

      const animateTo = useEvent((position: number) => {
        const current = animatedNumber.getValue()
        if (isHidden && open) return
        if (!current) return
        if (frameSize === 0) return
        const hiddenValue = frameSize === 0 ? HIDDEN_SIZE : frameSize
        const toValue = isHidden || position === -1 ? hiddenValue : positions[position]
        if (at.current === toValue) return
        stopSpring()
        if (isHidden || isResizing) {
          if (isResizing) {
            setIsResizing(false)
          }
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

      const panResponder = useMemo(
        () => {
          if (disableDrag) return
          if (!frameSize) return

          const minY = positions[0]
          scrollBridge.paneMinY = minY
          let startY = at.current

          function makeUnselectable(val: boolean) {
            if (!selectionStyleSheet) return
            if (!val) {
              selectionStyleSheet.innerText = ``
            } else {
              selectionStyleSheet.innerText = `:root * { user-select: none !important; -webkit-user-select: none !important; }`
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

          const onMoveShouldSet = (_e: GestureResponderEvent, { dy }: PanResponderGestureState) => {
            const isScrolled = scrollBridge.y !== 0
            console.log('isScrolled', isScrolled, previouslyScrolling)
            if (isScrolled) {
              previouslyScrolling = true
              return false
            }
            if (previouslyScrolling) {
              previouslyScrolling = false
              return true
            }
            const isDraggingUp = dy < 0
            const isAtTop = scrollBridge.paneY <= scrollBridge.paneMinY
            console.log('isAtTop', isAtTop, isDraggingUp)
            // prevent drag once at top and pulling up
            if (isAtTop) {
              if (!isScrolled && isDraggingUp) {
                return false
              }
            }
            // we could do some detection of other touchables and cancel here..
            console.log(Math.abs(dy) > 8)
            return Math.abs(dy) > 8
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
              console.log('move', to)
              animatedNumber.setValue(to, { type: 'direct' })
            },
            onPanResponderEnd: finish,
            onPanResponderTerminate: finish,
            onPanResponderRelease: finish,
          })
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [disableDrag, animateTo, frameSize, positions, setPosition]
      )

      let handleComponent: React.ReactElement | null = null
      let overlayComponent: React.ReactElement | null = null
      let frameComponent: React.ReactElement | null = null

      // TODO do more radix-like and don't require direct children descendents
      React.Children.forEach(childrenProp, (child) => {
        if (isValidElement(child)) {
          const name = child.type?.['staticConfig']?.componentName
          switch (name) {
            case 'SheetHandle':
              handleComponent = child
              break
            case 'Sheet':
              frameComponent = child
              break
            case 'SheetOverlay':
              overlayComponent = child
              break
            default:
              // eslint-disable-next-line no-console
              console.warn('Warning: passed invalid child to Sheet', child)
          }
        }
      })

      const preventShown = controller?.hidden && controller?.open

      const animatedStyle = driver.useAnimatedNumberStyle(animatedNumber, (val) => {
        return {
          transform: [{ translateY: frameSize === 0 ? HIDDEN_SIZE : val }],
        }
      })

      if (preventShown) {
        return null
      }

      // temp until reanimated useAnimatedNumber fix
      const AnimatedView = driver['NumberView'] ?? driver.View

      /**
       * This is a hacky workaround for native:
       */
      const [isShowingInnerSheet, setIsShowingInnerSheet] = useState(false)
      const shouldHideParentSheet = !isWeb && modal && isShowingInnerSheet
      const parentSheetContext = useContext(SheetInsideSheetContext)
      const onInnerSheet = useCallback((hasChild: boolean) => {
        setIsShowingInnerSheet(hasChild)
      }, [])
      useIsomorphicLayoutEffect(() => {
        if (!parentSheetContext || !open) return
        parentSheetContext(true)
        return () => {
          parentSheetContext(false)
        }
      }, [parentSheetContext, open])

      const contents = (
        <SheetProvider
          modal={modal}
          contentRef={contentRef}
          dismissOnOverlayPress={dismissOnOverlayPress}
          dismissOnSnapToBottom={dismissOnSnapToBottom}
          open={open}
          hidden={isHidden}
          scope={__scopeSheet}
          position={position}
          snapPoints={snapPoints}
          setPosition={setPosition}
          setOpen={setOpen}
          scrollBridge={scrollBridge}
        >
          {isResizing || shouldHideParentSheet ? null : overlayComponent}

          <AnimatedView
            ref={ref}
            {...panResponder?.panHandlers}
            onLayout={(e) => {
              const next = e.nativeEvent.layout.height
              setFrameSize((prev) => {
                const isBigChange = Math.abs(prev - next) > 50
                setIsResizing(isBigChange)
                return next
              })
            }}
            pointerEvents={open && !shouldHideParentSheet ? 'auto' : 'none'}
            style={[
              {
                position: 'absolute',
                zIndex,
                width: '100%',
                height: '100%',
                opacity: shouldHideParentSheet ? 0 : 1,
              },
              animatedStyle,
            ]}
          >
            {handleComponent}

            <RemoveScroll
              enabled={open && modal && handleDisableScroll}
              as={Slot}
              allowPinchZoom
              shards={[contentRef]}
              // causes lots of bugs on touch web on site
              removeScrollBar={false}
            >
              {isResizing ? null : frameComponent}
            </RemoveScroll>
          </AnimatedView>
        </SheetProvider>
      )

      if (modal) {
        const modalContents = (
          <Portal zIndex={zIndex}>
            <Theme name={themeName}>{contents}</Theme>
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
  ),
  sheetComponents
)

const SheetInsideSheetContext = createContext<((hasChild: boolean) => void) | null>(null)

export const ControlledSheet = Sheet as FunctionComponent<
  Omit<SheetProps, 'open' | 'onOpenChange'> & RefAttributes<View>
> &
  typeof sheetComponents

/* -------------------------------------------------------------------------------------------------*/

function getPercentSize(point?: number, frameSize?: number) {
  if (!frameSize) return 0
  if (point === undefined) {
    // eslint-disable-next-line no-console
    console.warn(`No snapPoint`)
    return 0
  }
  const pct = point / 100
  const next = Math.round(frameSize - pct * frameSize)
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

type SheetControllerContextValue = {
  disableDrag?: boolean
  open?: boolean
  // hide without "closing" to prevent re-animation when shown again
  hidden?: boolean
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void)
}

const SheetControllerContext = createContext<SheetControllerContextValue | null>(null)

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
    <SheetControllerContext.Provider value={memoValue}>{children}</SheetControllerContext.Provider>
  )
}

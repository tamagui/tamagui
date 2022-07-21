import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  Slot,
  TamaguiElement,
  Theme,
  composeEventHandlers,
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
import { ScopedProps, createContextScope } from '@tamagui/create-context'
import { Portal } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { XStack, XStackProps, YStack, YStackProps } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, {
  ReactNode,
  createContext,
  forwardRef,
  isValidElement,
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
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponder,
  PanResponderGestureState,
  ScrollView,
  ScrollViewProps,
  View,
} from 'react-native'

const SHEET_NAME = 'Sheet'
const SHEET_HANDLE_NAME = 'SheetHandle'

type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>

export type SheetProps = ScopedProps<
  {
    open?: boolean
    defaultOpen?: boolean
    onChangeOpen?: OpenChangeHandler
    position?: number
    defaultPosition?: number
    snapPoints?: number[]
    onChangePosition?: PositionChangeHandler
    children?: ReactNode
    dismissOnOverlayPress?: boolean
    dismissOnSnapToBottom?: boolean
    animationConfig?: Animated.SpringAnimationConfig
    disableDrag?: boolean
    modal?: boolean

    /**
     * @see https://github.com/theKashey/react-remove-scroll#usage
     */
    allowPinchZoom?: RemoveScrollProps['allowPinchZoom']
  },
  'Sheet'
>

type PositionChangeHandler = (position: number) => void

type OpenChangeHandler = ((open: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>

type ScrollBridge = {
  enabled: boolean
  y: number
  scrollStartY: number
  drag: (dy: number) => void
  release: (state: { dy: number; vy: number }) => void
}

type SheetContextValue = Required<
  Pick<SheetProps, 'open' | 'position' | 'snapPoints' | 'dismissOnOverlayPress'>
> & {
  hidden: boolean
  setPosition: PositionChangeHandler
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  allowPinchZoom: RemoveScrollProps['allowPinchZoom']
  contentRef: React.RefObject<TamaguiElement>
  dismissOnSnapToBottom: boolean
  scrollBridge: ScrollBridge
  modal: boolean
}

const [createSheetContext, createSheetScope] = createContextScope(SHEET_NAME)
const [SheetProvider, useSheetContext] = createSheetContext<SheetContextValue>(
  SHEET_NAME,
  {} as any
)

/* -------------------------------------------------------------------------------------------------
 * SheetHandle
 * -----------------------------------------------------------------------------------------------*/

export const SheetHandleFrame = styled(XStack, {
  name: SHEET_HANDLE_NAME,
  height: 10,
  borderRadius: 100,
  backgroundColor: '$background',
  position: 'absolute',
  pointerEvents: 'auto',
  zIndex: 10,
  y: -18,
  top: 0,
  left: '35%',
  right: '35%',
  opacity: 0.5,

  hoverStyle: {
    opacity: 0.7,
  },
})

type SheetScopedProps<A> = ScopedProps<A, 'Sheet'>

export const SheetHandle = SheetHandleFrame.extractable(
  ({ __scopeSheet, ...props }: SheetScopedProps<XStackProps>) => {
    const context = useSheetContext(SHEET_HANDLE_NAME, __scopeSheet)

    if (context.open === false) {
      return null
    }

    return (
      <SheetHandleFrame
        onPress={() => {
          // don't toggle to the bottom snap position when dismissOnSnapToBottom set
          const max = context.snapPoints.length + (context.dismissOnSnapToBottom ? -1 : 0)
          const nextPos = (context.position + 1) % max
          context.setPosition(nextPos)
        }}
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
      // TODO still have as const bug
    } as const,
  },
})

export type SheetOverlayProps = GetProps<typeof SheetOverlayFrame>

export const SheetOverlay = SheetOverlayFrame.extractable(
  ({ __scopeSheet, ...props }: SheetScopedProps<SheetOverlayProps>) => {
    const context = useSheetContext(SHEET_OVERLAY_NAME, __scopeSheet)
    return (
      <RemoveScroll
        enabled={context.open && context.modal}
        as={Slot}
        allowPinchZoom={context.allowPinchZoom}
        shards={[context.contentRef]}
        // causes lots of bugs on touch web on site
        removeScrollBar={false}
      >
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
      </RemoveScroll>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * SheetScrollView
 * -----------------------------------------------------------------------------------------------*/

const SHEET_SCROLL_VIEW_NAME = 'SheetScrollView'

export const SheetScrollView = forwardRef<ScrollView, ScrollViewProps>(
  ({ __scopeSheet, ...props }: SheetScopedProps<ScrollViewProps>, ref) => {
    const { scrollBridge } = useSheetContext(SHEET_SCROLL_VIEW_NAME, __scopeSheet)
    const [scrollEnabled, setScrollEnabled] = useState(true)
    const state = useRef({
      dy: 0,
      // store a few recent dys to get velocity on release
      dys: [] as number[],
    })

    const release = () => {
      setScrollEnabled(true)
      const recentDys = state.current.dys.slice(-10)
      const dist = recentDys.length
        ? recentDys.reduce((a, b, i) => a + b - (recentDys[i - 1] ?? recentDys[0]), 0)
        : 0
      const avgDy = dist / recentDys.length
      const vy = avgDy * 0.075
      state.current.dys = []
      scrollBridge.release({
        dy: state.current.dy,
        vy,
      })
    }

    return (
      <ScrollView
        ref={ref}
        scrollEventThrottle={16} // todo release we can just grab the last dY and estimate vY using a sample of last dYs
        {...props}
        scrollEnabled={props.scrollEnabled || scrollEnabled}
        onScroll={composeEventHandlers<NativeSyntheticEvent<NativeScrollEvent>>(
          props.onScroll,
          (e) => {
            const { y } = e.nativeEvent.contentOffset
            scrollBridge.y = y
            if (y > 0) {
              scrollBridge.scrollStartY = -1
            }
          }
        )}
        onResponderMove={composeEventHandlers(props.onResponderMove, (e) => {
          const { pageY } = e.nativeEvent
          if (scrollBridge.y <= 0) {
            if (scrollBridge.scrollStartY === -1) {
              scrollBridge.scrollStartY = pageY
            }
            const dy = pageY - scrollBridge.scrollStartY
            if (dy <= 0) {
              setScrollEnabled(true)
              return
            }
            setScrollEnabled(false)
            scrollBridge.drag(dy)
            state.current.dy = dy
            state.current.dys.push(dy)
            // only do every so often, cut down to 10 again
            if (state.current.dys.length > 100) {
              state.current.dys = state.current.dys.slice(-10)
            }
          }
        })}
        onResponderReject={composeEventHandlers(props.onResponderReject, release)}
        onResponderTerminate={composeEventHandlers(props.onResponderTerminate, release)}
        onResponderRelease={composeEventHandlers(props.onResponderRelease, release)}
        style={[
          {
            flex: 1,
          },
          props.style,
        ]}
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

export const Sheet = withStaticProperties(
  themeable(
    forwardRef<View, SheetProps>((props, ref) => {
      const {
        __scopeSheet,
        snapPoints: snapPointsProp = [80],
        open: openProp,
        defaultOpen,
        children: childrenProp,
        position: positionProp,
        onChangePosition,
        onChangeOpen,
        defaultPosition,
        dismissOnOverlayPress = true,
        animationConfig,
        dismissOnSnapToBottom = false,
        disableDrag: disableDragProp,
        modal = false,
        allowPinchZoom,
      } = props

      if (process.env.NODE_ENV === 'development') {
        if (snapPointsProp.some((p) => p < 0 || p > 100)) {
          console.warn(
            `⚠️ Invalid snapPoint given, snapPoints must be between 0 and 100, equal to percent height of frame`
          )
        }
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
        scrollStartY: -1,
        drag: () => {},
        release: () => {},
      }))

      const onChangeOpenInternal = (val: boolean) => {
        controller?.onChangeOpen?.(val)
        onChangeOpen?.(val)
      }

      const [open, setOpen] = useControllableState({
        prop: controller?.open ?? openProp,
        defaultProp: defaultOpen || true,
        onChange: onChangeOpenInternal,
        strategy: controller ? 'most-recent-wins' : 'prop-wins',
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
        onChange: onChangePosition,
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
          }
          setPosition_(next)
        },
        [dismissOnSnapToBottom, snapPoints.length, setPosition_, setOpen]
      )

      const positionValue = useRef<Animated.Value>()
      if (!positionValue.current) {
        positionValue.current = new Animated.Value(HIDDEN_SIZE)
      }

      const [isResizing, setIsResizing] = useState(true)
      useIsomorphicLayoutEffect(() => {
        if (!isResizing) {
          setIsResizing(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [modal])

      const spring = useRef<Animated.CompositeAnimation | null>(null)
      function stopSpring() {
        spring.current?.stop()
        spring.current = null
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
        const current = positionValue.current
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
          Animated.timing(current, {
            useNativeDriver: !isWeb,
            toValue,
            duration: 0,
          }).start()
          at.current = toValue
          return
        }
        // dont bounce on initial measure to bottom
        const overshootClamping = at.current === HIDDEN_SIZE
        spring.current = Animated.spring(current, {
          useNativeDriver: !isWeb,
          toValue,
          overshootClamping,
          ...animationConfig,
        })
        spring.current.start(({ finished }) => {
          if (finished) {
            stopSpring()
          }
        })
      })

      useIsomorphicLayoutEffect(() => {
        animateTo(position)
      }, [isHidden, frameSize, position, animateTo])

      // native only fix
      const at = useRef(0)
      useEffect(() => {
        positionValue.current!.addListener(({ value }) => {
          at.current = value
        })
        return () => {
          positionValue.current!.removeAllListeners()
        }
      }, [])

      const panResponder = useMemo(
        () => {
          if (disableDrag) return
          if (!frameSize) return

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const pos = positionValue.current!
          const minY = positions[0]
          let startY = at.current

          function makeUnselectable(val: boolean) {
            if (!selectionStyleSheet) return
            if (!val) {
              selectionStyleSheet.innerText = ``
            } else {
              selectionStyleSheet.innerText = `:root * { user-select: none !important; -webkit-user-select: none !important; }`
            }
          }

          const release = ({ vy, dy }: { dy: number; vy: number }) => {
            isExternalDrag = false
            previouslyScrolling = false
            makeUnselectable(false)
            const at = dy + startY
            // seems liky vy goes up to about 4 at the very most (+ is down, - is up)
            // lets base our multiplier on the total layout height
            const end = at + frameSize * vy * 0.33
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
            release(state)
          }

          let previouslyScrolling = false

          const onMoveShouldSet = (_e: GestureResponderEvent, { dy }: PanResponderGestureState) => {
            if (scrollBridge.y !== 0) {
              previouslyScrolling = true
              return false
            }
            if (scrollBridge.y === 0 && dy < 0) {
              return false
            }
            if (previouslyScrolling) {
              previouslyScrolling = false
              return true
            }
            // we could do some detection of other touchables and cancel here..
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
            pos.setValue(resisted(to, minY))
          }

          scrollBridge.release = release

          return PanResponder.create({
            onMoveShouldSetPanResponder: (...args) => {
              const res = onMoveShouldSet(...args)
              // console.log('res', res, scrollBridge.y)
              return res
            },
            onPanResponderGrant: grant,
            onPanResponderMove: (_e, { dy }) => {
              const to = dy + startY
              pos.setValue(resisted(to, minY))
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
              console.warn('Warning: passed invalid child to Sheet', child)
          }
        }
      })

      const preventShown = controller?.hidden && controller?.open

      if (preventShown) {
        return null
      }

      const contents = (
        <SheetProvider
          modal={modal}
          contentRef={contentRef}
          dismissOnOverlayPress={dismissOnOverlayPress}
          dismissOnSnapToBottom={dismissOnSnapToBottom}
          allowPinchZoom={allowPinchZoom}
          open={open}
          hidden={isHidden}
          scope={__scopeSheet}
          position={position}
          snapPoints={snapPoints}
          setPosition={setPosition}
          setOpen={setOpen}
          scrollBridge={scrollBridge}
        >
          {isResizing ? null : overlayComponent}
          {/* no fancy hidden animation etc for handle for now */}
          {isHidden ? null : handleComponent}
          <Animated.View
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
            pointerEvents={open ? 'auto' : 'none'}
            style={{
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              height: '100%',
              transform: [{ translateY: frameSize === 0 ? HIDDEN_SIZE : positionValue.current }],
            }}
          >
            {isResizing ? null : frameComponent}
          </Animated.View>
        </SheetProvider>
      )

      if (modal) {
        return (
          <Portal>
            <Theme name={themeName}>{contents}</Theme>
          </Portal>
        )
      }

      return contents
    })
  ),
  {
    Handle: SheetHandle,
    Frame: SheetFrame,
    Overlay: SheetOverlay,
    ScrollView: SheetScrollView,
  }
)

/* -------------------------------------------------------------------------------------------------*/

function getPercentSize(point?: number, frameSize?: number) {
  if (!frameSize) return 0
  if (point === undefined) {
    console.warn(`No snapPoint`)
    return 0
  }
  const pct = point / 100
  const next = frameSize - pct * frameSize
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
  onChangeOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void)
}

const SheetControllerContext = createContext<SheetControllerContextValue | null>(null)

export const SheetController = ({
  children,
  onChangeOpen: onChangeOpenProp,
  ...value
}: Partial<SheetControllerContextValue> & { children?: React.ReactNode }) => {
  const onChangeOpen = useEvent(onChangeOpenProp)

  const memoValue = useMemo(
    () => ({
      open: value.open,
      hidden: value.hidden,
      disableDrag: value.disableDrag,
      onChangeOpen,
    }),
    [onChangeOpen, value.open, value.hidden, value.disableDrag]
  )

  return (
    <SheetControllerContext.Provider value={memoValue}>{children}</SheetControllerContext.Provider>
  )
}

export { createSheetScope }

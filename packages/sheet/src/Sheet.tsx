import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  Slot,
  TamaguiElement,
  Theme,
  isClient,
  isWeb,
  mergeEvent,
  styled,
  themeable,
  useEvent,
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
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Animated,
  GestureResponderEvent,
  PanResponder,
  PanResponderGestureState,
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

type SheetContextValue = Required<
  Pick<SheetProps, 'open' | 'position' | 'snapPoints' | 'dismissOnOverlayPress'>
> & {
  hidden: boolean
  setPosition: PositionChangeHandler
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  allowPinchZoom: RemoveScrollProps['allowPinchZoom']
  contentRef: React.RefObject<TamaguiElement>
  dismissOnSnapToBottom: boolean
}

const [createSheetContext, createSheetScope] = createContextScope(SHEET_NAME)
const [SheetProvider, useSheetContext] = createSheetContext<SheetContextValue>(
  SHEET_NAME,
  {} as any
)

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
        enabled={context.open}
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

const selectionStyleSheet = isClient ? document.createElement('style') : null
if (selectionStyleSheet) {
  document.head.appendChild(selectionStyleSheet)
}

const SHEET_FRAME_NAME = 'SheetFrame'

export const SheetFrameFrame = styled(YStack, {
  name: SHEET_FRAME_NAME,
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
    const context = useSheetContext(SHEET_FRAME_NAME, __scopeSheet)
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
        modal,
        allowPinchZoom,
      } = props

      // allows for sheets to be controlled by other components
      const controller = useContext(SheetControllerContext)
      const isHidden = controller?.hidden || false
      const disableDrag = disableDragProp ?? controller?.disableDrag
      const themeName = useThemeName()
      const contentRef = React.useRef<TamaguiElement>(null)

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
      useLayoutEffect(() => {
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
        const pos = positionValue.current
        if (isHidden && open) return
        if (!pos) return
        if (frameSize === 0) return
        const hiddenValue = frameSize === 0 ? HIDDEN_SIZE : frameSize
        const toValue = isHidden || position === -1 ? hiddenValue : positions[position]
        if (pos['_value'] === toValue) return
        stopSpring()
        if (isHidden || isResizing) {
          if (isResizing) {
            setIsResizing(false)
          }
          Animated.timing(pos, {
            useNativeDriver: !isWeb,
            toValue,
            duration: 0,
          }).start()
          return
        }
        // dont bounce on initial measure to bottom
        const overshootClamping = pos['_value'] === HIDDEN_SIZE
        spring.current = Animated.spring(pos, {
          useNativeDriver: !isWeb,
          toValue,
          overshootClamping,
          ...animationConfig,
        })
        spring.current.start(({ finished }) => finished && stopSpring())
      })

      useLayoutEffect(() => {
        animateTo(position)
      }, [isHidden, frameSize, position, animateTo])

      const panResponder = useMemo(() => {
        if (disableDrag) return
        if (!frameSize) return

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const pos = positionValue.current!
        const minY = positions[0]
        let startY = pos['_value']

        function makeUnselectable(val: boolean) {
          if (!selectionStyleSheet) return
          if (!val) {
            selectionStyleSheet.innerText = ``
          } else {
            selectionStyleSheet.innerText = `:root * { user-select: none !important; -webkit-user-select: none !important; }`
          }
        }

        const finish = (_e: GestureResponderEvent, { vy, dy }: PanResponderGestureState) => {
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

        return PanResponder.create({
          onMoveShouldSetPanResponder: (_e, { dy }) => {
            // we could do some detection of other touchables and cancel here..
            return Math.abs(dy) > 6
          },
          onPanResponderGrant: () => {
            makeUnselectable(true)
            stopSpring()
            startY = pos['_value']
          },
          onPanResponderMove: (_e, { dy }) => {
            const to = dy + startY
            pos.setValue(resisted(to, minY))
          },
          onPanResponderEnd: finish,
          onPanResponderTerminate: finish,
          onPanResponderRelease: finish,
        })
      }, [disableDrag, animateTo, frameSize, positions, setPosition])

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
            case 'SheetFrame':
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
          <Portal visible={open}>
            <Theme name={themeName}>{contents}</Theme>
          </Portal>
        )
      }

      return contents
    }),
    {
      componentName: 'Sheet',
    }
  ),
  {
    Handle: SheetHandle,
    Frame: SheetFrame,
    Overlay: SheetOverlay,
  }
)

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

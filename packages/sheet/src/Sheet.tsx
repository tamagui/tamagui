/* eslint-disable react-hooks/rules-of-hooks */

import {
  GetProps,
  isSSR,
  isWeb,
  mergeEvent,
  styled,
  themeable,
  withStaticProperties,
} from '@tamagui/core'
import { ScopedProps, createContextScope } from '@tamagui/create-context'
import { XStack, XStackProps, YStack } from '@tamagui/stacks'
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
import { Animated, PanResponder, View } from 'react-native'

const SHEET_NAME = 'Sheet'
const SHEET_HANDLE_NAME = 'SheetHandle'

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
    animationConfig?: Animated.SpringAnimationConfig
  },
  'Sheet'
>

type PositionChangeHandler =
  | ((position: number) => void)
  | React.Dispatch<React.SetStateAction<number>>

type OpenChangeHandler = ((open: boolean) => void) | React.Dispatch<React.SetStateAction<boolean>>

type SheetContextValue = Required<
  Pick<SheetProps, 'open' | 'position' | 'snapPoints' | 'dismissOnOverlayPress'>
> & {
  setPosition: React.Dispatch<React.SetStateAction<number>>
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
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
          const nextPos = (context.position + 1) % context.snapPoints.length
          context.setPosition(nextPos)
        }}
        {...props}
      />
    )
  }
)

export const SheetOverlayFrame = styled(YStack, {
  name: 'SheetOverlay',
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
    const context = useSheetContext(SHEET_HANDLE_NAME, __scopeSheet)
    return (
      <SheetOverlayFrame
        closed={context.open === false}
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

export const SheetFrame = styled(YStack, {
  name: 'SheetFrame',
  flex: 1,
  backgroundColor: '$background',
  borderTopLeftRadius: '$4',
  borderTopRightRadius: '$4',
  padding: '$4',
  width: '100%',
  pointerEvents: 'auto',
})

const useIsSSR = () => {
  const [val, setVal] = useState(isWeb ? isSSR : false)
  useEffect(() => {
    if (isWeb && !isSSR) {
      setVal(false)
    }
  }, [])
  return val
}

// set all the way off screen
const HIDDEN_SIZE = 10_000

export const Sheet = withStaticProperties(
  themeable(
    forwardRef<View, SheetProps>((props, ref) => {
      const {
        __scopeSheet,
        snapPoints: snapPointsProp = [80, 10],
        open: openProp,
        defaultOpen,
        children: childrenProp,
        position: positionProp,
        onChangePosition,
        onChangeOpen,
        defaultPosition,
        dismissOnOverlayPress = true,
        animationConfig,
      } = props

      const isServerSide = useIsSSR()

      // we can put non-server side hooks after conditional because based on env
      if (isServerSide) {
        return null
      }

      // allows for sheets to be controlled by other components
      let controller: SheetControllerContextValue | null = null
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        controller = useContext(SheetControllerContext)
      } catch {
        // uncontrolled
      }

      const onChangeOpenInternal = (val: boolean) => {
        controller?.onChangeOpen?.(val)
        onChangeOpen?.(val)
      }

      const [open, setOpen] = useControllableState({
        prop: controller?.visible ?? openProp,
        defaultProp: defaultOpen || true,
        onChange: onChangeOpenInternal,
        strategy: controller ? 'most-recent-wins' : 'prop-wins',
      })

      const [frameSize, setFrameSize] = useState<number>(0)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const snapPoints = useMemo(() => snapPointsProp, [JSON.stringify(snapPointsProp)])

      // lets set -1 to be always the "open = false" position
      const [position_, setPosition] = useControllableState({
        prop: positionProp,
        defaultProp: defaultPosition || (open ? 0 : -1),
        onChange: onChangePosition,
      })
      const position = open === false ? -1 : position_
      const positionValue = useRef<Animated.Value>()
      const spring = useRef<Animated.CompositeAnimation | null>(null)

      // open must set position
      if (open && position < 0) {
        setPosition(0)
      }

      function stopSpring() {
        spring.current?.stop()
        spring.current = null
      }

      const positions = useMemo(
        () => snapPoints.map((point) => getPercentSize(point, frameSize)),
        [frameSize, snapPoints]
      )

      if (!positionValue.current) {
        positionValue.current = new Animated.Value(HIDDEN_SIZE)
      }

      const animateTo = useCallback(
        (position: number) => {
          if (!positionValue.current) return
          if (frameSize === 0) return
          const toValue =
            position === -1 ? (frameSize === 0 ? HIDDEN_SIZE : frameSize) : positions[position]
          if (positionValue.current['_value'] === toValue) return
          stopSpring()
          // dont bounce on initial measure to bottom
          const overshootClamping = positionValue.current['_value'] === HIDDEN_SIZE
          spring.current = Animated.spring(positionValue.current, {
            useNativeDriver: !isWeb,
            toValue,
            overshootClamping,
            ...animationConfig,
          })
          spring.current.start(({ finished }) => finished && stopSpring())
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [positions, frameSize, JSON.stringify(animationConfig || null)]
      )

      useLayoutEffect(() => {
        animateTo(position)
      }, [position, animateTo])

      const panResponder = useMemo(() => {
        if (!frameSize) return

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const pos = positionValue.current!
        const minY = positions[0]
        let startY = pos['_value']

        return PanResponder.create({
          onMoveShouldSetPanResponder: (_e, { dy }) => {
            // we could do some detection of other touchables and cancel here..
            // console.log('wut is', _e)
            return Math.abs(dy) > 6
          },
          onPanResponderGrant: () => {
            stopSpring()
            startY = pos['_value']
          },
          onPanResponderMove: (_e, { dy }) => {
            const to = dy + startY
            pos.setValue(resisted(to, minY))
          },
          onPanResponderRelease: (_e, { vy, dy }) => {
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
          },
        })
      }, [animateTo, frameSize, positions, setPosition])

      let handleComponent: React.ReactElement | null = null
      let overlayComponent: React.ReactElement | null = null
      let frameComponent: React.ReactElement | null = null

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

      return (
        <SheetProvider
          dismissOnOverlayPress={dismissOnOverlayPress}
          open={open}
          scope={__scopeSheet}
          position={position}
          snapPoints={snapPoints}
          setPosition={setPosition}
          setOpen={setOpen}
        >
          {overlayComponent}
          {handleComponent}
          <Animated.View
            ref={ref}
            {...panResponder?.panHandlers}
            onLayout={(e) => {
              setFrameSize(e.nativeEvent.layout.height)
            }}
            pointerEvents="none"
            style={{
              position: 'absolute',
              zIndex: 10,
              width: '100%',
              height: '100%',
              transform: [{ translateY: frameSize === 0 ? HIDDEN_SIZE : positionValue.current }],
            }}
          >
            {frameComponent}
          </Animated.View>
        </SheetProvider>
      )
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
  visible: boolean
  onChangeOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void)
}

const SheetControllerContext = createContext<SheetControllerContextValue>({
  visible: false,
})

export const SheetController = ({
  children,
  ...value
}: SheetControllerContextValue & { children?: React.ReactNode }) => {
  const memoValue = useMemo(
    () => value,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value.visible]
  )

  // always up to date, todo useEvent
  memoValue.onChangeOpen = value.onChangeOpen

  return (
    <SheetControllerContext.Provider value={memoValue}>{children}</SheetControllerContext.Provider>
  )
}

export { createSheetScope }

/* eslint-enable react-hooks/rules-of-hooks */

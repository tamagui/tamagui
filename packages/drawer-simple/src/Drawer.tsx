import { isSSR, isWeb, styled, themeable, withStaticProperties } from '@tamagui/core'
import { ScopedProps, createContextScope } from '@tamagui/create-context'
import { XStack, XStackProps, YStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import React, {
  ReactNode,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Animated, LayoutRectangle, PanResponder, View } from 'react-native'

type PositionChangeHandler =
  | ((position: number) => void)
  | React.Dispatch<React.SetStateAction<number>>

const DRAWER_NAME = 'Drawer'
const DRAWER_HANDLE_NAME = 'DrawerHandle'

export const DrawerHandleFrame = styled(XStack, {
  name: DRAWER_HANDLE_NAME,
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

export const DrawerHandle = DrawerHandleFrame.extractable(
  ({ __scopeDrawer, ...props }: ScopedProps<XStackProps, 'Drawer'>) => {
    const context = useDrawerContext(DRAWER_HANDLE_NAME, __scopeDrawer)

    return (
      <DrawerHandleFrame
        onPress={() => {
          const nextPos = (context.position + 1) % context.snapPoints.length
          context.setPosition(nextPos)
        }}
        {...props}
      />
    )
  }
)

type DrawerContextValue = {
  position: number
  snapPoints: number[]
  setPosition: React.Dispatch<React.SetStateAction<number>>
}

const [createDrawerContext, createDrawerScope] = createContextScope(DRAWER_NAME)
const [DrawerProvider, useDrawerContext] = createDrawerContext<DrawerContextValue>(
  DRAWER_NAME,
  {} as any
)

export const DrawerBackdrop = styled(YStack, {
  name: 'DrawerBackdrop',
  backgroundColor: '$color',
  fullscreen: true,
  opacity: 0.2,
})

export const DrawerFrame = styled(YStack, {
  name: 'DrawerFrame',
  flex: 1,
  backgroundColor: '$background',
  borderTopLeftRadius: '$4',
  borderTopRightRadius: '$4',
  padding: '$4',
  width: '100%',
})

export type DrawerProps = ScopedProps<
  {
    open?: boolean
    defaultOpen?: boolean
    defaultPosition?: number
    snapPoints?: number[]
    position?: number
    onChangePosition?: PositionChangeHandler
    children?: ReactNode
  },
  'Drawer'
>

const useIsSSR = () => {
  const [val, setVal] = useState(isWeb ? isSSR : false)
  useEffect(() => {
    if (isWeb && !isSSR) {
      setVal(false)
    }
  }, [])
  return val
}

export const Drawer = withStaticProperties(
  themeable(
    forwardRef<View, DrawerProps>((props, ref) => {
      const {
        __scopeDrawer,
        snapPoints: snapPointsProp = [80, 10],
        children: childrenProp,
        position: positionProp,
        onChangePosition,
        defaultPosition,
        ...rest
      } = props
      const isServerSide = useIsSSR()

      const [position, setPosition] = useControllableState({
        prop: positionProp,
        defaultProp: defaultPosition || 0,
        onChange: onChangePosition,
        strategy: 'most-recent-wins',
      })

      const [layout, setLayout] = useState<LayoutRectangle>()

      const positionValue = useRef<Animated.Value>()
      if (!positionValue.current) {
        positionValue.current = new Animated.Value(position)
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
      const snapPoints = useMemo(() => snapPointsProp, [JSON.stringify(snapPointsProp)])

      // we can put non-server side hooks after conditional because based on env
      if (isServerSide) {
        return null
      }

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const spring = useRef<Animated.CompositeAnimation | null>(null)

      function stopSpring() {
        spring.current?.stop()
        spring.current = null
      }

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const positions = useMemo(
        () => snapPoints.map((point) => getYForPosition(point, layout)),
        [layout, snapPoints]
      )

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const animateTo = useCallback(
        (position: number) => {
          if (!positionValue.current) return
          const toValue = positions[position]
          stopSpring()
          spring.current = Animated.spring(positionValue.current, {
            useNativeDriver: !isWeb,
            toValue,
          })
          spring.current.start(({ finished }) => finished && stopSpring())
        },
        [positions]
      )

      // eslint-disable-next-line react-hooks/rules-of-hooks
      useLayoutEffect(() => {
        animateTo(position)
      }, [position, animateTo])

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const panResponder = useMemo(() => {
        if (!layout) return
        console.log('setup pan')

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
            const end = at + layout.height * vy * 0.33
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
      }, [layout, positions, setPosition])

      let handleComponent: React.ReactElement | null = null
      let backdropComponent: React.ReactElement | null = null
      let frameComponent: React.ReactElement | null = null

      React.Children.forEach(childrenProp, (child) => {
        if (isValidElement(child)) {
          switch (child.type?.['staticConfig'].componentName) {
            case 'DrawerHandle':
              handleComponent = child
              break
            case 'DrawerFrame':
              frameComponent = child
              break
            case 'DrawerBackdrop':
              backdropComponent = child
              break
            default:
              console.warn('Warning: passed invalid child to Drawer', child)
          }
        }
      })

      return (
        <DrawerProvider
          scope={__scopeDrawer}
          position={position}
          snapPoints={snapPoints}
          setPosition={setPosition}
        >
          {backdropComponent}
          {handleComponent}
          <Animated.View
            {...panResponder?.panHandlers}
            onLayout={(e) => {
              setLayout(e.nativeEvent.layout)
            }}
            style={{
              width: '100%',
              height: '100%',
              transform: [{ translateY: positionValue.current }],
            }}
          >
            {frameComponent}
          </Animated.View>
        </DrawerProvider>
      )
    }),
    {
      componentName: 'Drawer',
    }
  ),
  {
    Handle: DrawerHandle,
    Frame: DrawerFrame,
    Backdrop: DrawerBackdrop,
  }
)

function getYForPosition(point?: number, layout?: LayoutRectangle) {
  if (!layout) return 0
  if (point === undefined) {
    console.warn(`No snapPoint`)
    return 0
  }
  const pct = point / 100
  const next = layout.height - pct * layout.height
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

export { createDrawerScope }

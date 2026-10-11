import { FocusScope } from '@tamagui/focus-scope'
import type { Dispatch, SetStateAction } from 'react'
import React, { forwardRef, useRef, useState } from 'react'
import { Animated, PanResponder } from 'react-native'
import type { ViewProps, TamaguiElement } from 'tamagui'
import {
  createStyledHOC,
  AnimatePresence,
  View,
  YStack,
  createStyledContext,
  styled,
  useControllableState,
  withStaticProperties,
} from 'tamagui'

export const DrawerContext = createStyledContext<{
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}>({
  open: false,
  setOpen: () => {},
})

const SwipeDismissableComponent = React.forwardRef<
  TamaguiElement,
  ViewProps & { onDismiss: () => void; children: any; dismissAfter?: number }
>(({ onDismiss, children, dismissAfter = 80, ...rest }, ref) => {
  const pan = useRef(new Animated.Value(0)).current
  const [dragStarted, setDragStarted] = useState(false)
  const dismissAfterRef = useRef(dismissAfter)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
      },
      onPanResponderMove: (_, gestureState) => {
        const { dx } = gestureState
        if (dx < 0) {
          setDragStarted(true)
          pan.setValue(dx)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setDragStarted(false)
        if (gestureState.dx < -dismissAfterRef.current) {
          onDismiss()
        } else {
          Animated.spring(pan, {
            toValue: 0,
            overshootClamping: true,
            useNativeDriver: false,
          }).start()
        }
      },
    })
  ).current

  return (
    <View ref={ref} height="100%" pointerEvents={dragStarted ? 'none' : 'auto'} {...rest}>
      <Animated.View
        style={{ height: '100%', transform: [{ translateX: pan }] }}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  )
})

const DrawerFrame = styled(YStack, {
  paddingVertical: '2',
  width: 210,
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  backgroundColor: 'background',
  x: 0,
  gap: '4',
  render: 'nav',
})

type DrawerProps = {
  open: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * When true, uses a portal to render at the very top of the root TamaguiProvider.
   */
  portalToRoot?: boolean
}

const Overlay = styled(YStack, {
  name: 'DrawerOverlay',
  context: DrawerContext,
  opacity: 'enter:0 exit:0',
  position: 'absolute',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 100_000 - 1,
  pointerEvents: 'auto',
})

const DrawerOverlay = createStyledHOC(Overlay, (props, ref) => {
  const { setOpen } = DrawerContext.useStyledContext()
  return <Overlay ref={ref} onPress={() => setOpen(false)} {...props} />
})

const DrawerSwipeable = forwardRef<
  TamaguiElement,
  Omit<React.ComponentProps<typeof SwipeDismissableComponent>, 'onDismiss'>
>((props, ref) => {
  const { setOpen, open: _open } = DrawerContext.useStyledContext()
  return (
    <SwipeDismissableComponent
      onDismiss={() => setOpen(false)}
      z={1000_000_000}
      position="absolute"
      {...props}
      ref={ref}
    />
  )
})

const DrawerContent = createStyledHOC(DrawerFrame, (props, ref) => {
  const { children, ...rest } = props

  return (
    <FocusScope trapped enabled={true} loop>
      <DrawerFrame
        ref={ref}
        transition="medium"
        x={`enter:${-(rest.width || 210)}px exit:${-(rest.width || 210)}px`}
        {...rest}
        theme="accent"
      >
        {children}
      </DrawerFrame>
    </FocusScope>
  )
})

const DrawerImpl = ({
  open = false,
  onOpenChange,
  children,
}: DrawerProps & { children?: React.ReactNode }) => {
  const [_open, setOpen] = useControllableState({
    prop: open,
    defaultProp: false,
    onChange: onOpenChange,
  })

  const content = open && <>{children}</>
  return (
    <DrawerContext.Provider open={_open} setOpen={setOpen}>
      <AnimatePresence>{open && content}</AnimatePresence>
    </DrawerContext.Provider>
  )
}

export const Drawer = withStaticProperties(DrawerImpl, {
  Content: DrawerContent,
  Overlay: DrawerOverlay,
  Swipeable: DrawerSwipeable,
  Portal: ({ children }) => children,
})

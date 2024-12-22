import { FocusScope } from '@tamagui/focus-scope'
import { Portal } from '@tamagui/portal'
import type { Dispatch, SetStateAction } from 'react'
import React, { forwardRef, useRef, useState } from 'react'
import { Modal, PanResponder, Platform } from 'react-native'
import type { Animated } from 'react-native'
import type { PortalProps, StackProps, TamaguiElement } from 'tamagui'
import {
  Stack,
  YStack,
  createStyledContext,
  styled,
  useConfiguration,
  useControllableState,
  usePropsAndStyle,
  withStaticProperties,
} from 'tamagui'
import { AnimatePresence } from '@tamagui/animate-presence'

export const DrawerContext = createStyledContext<{
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}>({
  open: false,
  setOpen: () => {},
})

const SwipeDismissableComponent = React.forwardRef<
  TamaguiElement,
  StackProps & { onDismiss: () => void; children: any; dismissAfter?: number }
>(({ onDismiss, children, dismissAfter = 80, ...rest }, ref) => {
  const { animationDriver } = useConfiguration()
  const { useAnimatedNumber, useAnimatedNumberStyle } = animationDriver
  const AnimatedView = (animationDriver.View ?? Stack) as typeof Animated.View
  const pan = useAnimatedNumber(0)
  const [props, style] = usePropsAndStyle(rest)
  const [dragStarted, setDragStarted] = useState(false)
  const dismissAfterRef = useRef(dismissAfter)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const { dx } = gestureState
        if (dx < 0) {
          setDragStarted(true)
          pan.setValue(dx, {
            type: 'direct',
          })
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        setDragStarted(false)
        if (gestureState.dx < -dismissAfterRef.current) {
          if (onDismiss) {
            onDismiss()
          }
        } else {
          pan.setValue(0, {
            type: 'spring',
            overshootClamping: true,
          })
        }
      },
    })
  ).current

  const panStyle = useAnimatedNumberStyle(pan, (val) => {
    'worklet'
    return {
      transform: [{ translateX: val }],
    }
  })

  return (
    <AnimatedView
      ref={ref}
      style={[
        panStyle,
        {
          height: '100%',
          ...(style as any),
          ...(dragStarted && {
            pointerEvents: 'none',
          }),
        },
      ]}
      {...panResponder.panHandlers}
      {...(props as any)}
    >
      {children}
    </AnimatedView>
  )
})

const DrawerFrame = styled(YStack, {
  variants: {
    unstyled: {
      false: {
        themeInverse: true,
        paddingVertical: '$2',
        tag: 'nav',
        width: 210,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '$background',
        x: 0,
        gap: '$4',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
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
  enterStyle: {
    opacity: 0,
  },
  exitStyle: {
    opacity: 0,
  },

  variants: {
    unstyled: {
      false: {
        fullscreen: true,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100_000 - 1,
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const DrawerOverlay = Overlay.styleable((props, ref) => {
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
      zIndex={1000_000_000}
      position="absolute"
      {...props}
      ref={ref}
    />
  )
})

const DrawerContent = DrawerFrame.styleable((props, ref) => {
  const { children, ...rest } = props

  return (
    <FocusScope trapped enabled={true} loop>
      <DrawerFrame
        ref={ref}
        animation="medium"
        enterStyle={{ x: -(rest.width || rest.w || 210) }}
        exitStyle={{ x: -(rest.width || rest.w || 210) }}
        {...rest}
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
  portalToRoot,
  ...rest
}: DrawerProps & { children?: React.ReactNode }) => {
  const [_open, setOpen] = useControllableState({
    prop: open,
    defaultProp: false,
    onChange: onOpenChange,
  })
  // biome-ignore lint/complexity/noUselessFragments: necessary for AnimatedPresence
  const content = open && <React.Fragment key="content">{children}</React.Fragment>
  return (
    <DrawerContext.Provider open={_open} setOpen={setOpen}>
      <AnimatePresence>{open && content}</AnimatePresence>
    </DrawerContext.Provider>
  )
}

const DrawerPortal = (props: PortalProps) => {
  return Platform.select({
    web: <Portal zIndex={1000000000} {...props} />,
    native: (
      <Modal animationType="none" transparent={true}>
        {props.children}
      </Modal>
    ),
  })
}

export const Drawer = withStaticProperties(DrawerImpl, {
  Content: DrawerContent,
  Overlay: DrawerOverlay,
  Swipeable: DrawerSwipeable,
  Portal: DrawerPortal,
})

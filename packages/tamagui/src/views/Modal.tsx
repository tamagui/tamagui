import {
  AnimatedStack,
  AnimatedStackProps,
  Theme,
  isTouchDevice,
  isWeb,
  styled,
  useThemeName,
} from '@tamagui/core'
import React, { useLayoutEffect } from 'react'
import { Modal as ModalNative, ModalProps as ModalPropsReact } from 'react-native'

import { prevent } from '../helpers/prevent'
import { useDebounceValue } from '../hooks/useDebounce'
import { YStack } from './Stacks'

export type ModalProps = Omit<ModalPropsReact, 'children'> &
  AnimatedStackProps & {
    visible?: boolean
    overlayBackground?: string
    overlayDismisses?: boolean
    children?: any | ((isOpen?: boolean) => any)
  }

export const Modal = (props: ModalProps) => {
  const {
    // modal specific props
    visible = true,
    animationType = 'slide', // keep this only for native for now
    onRequestClose,
    onShow,
    // ios specific
    presentationStyle,
    transparent = isWeb,
    supportedOrientations,
    onDismiss,
    onOrientationChange,
    // android specific
    hardwareAccelerated,
    statusBarTranslucent,
    // overlay
    overlayBackground = 'rgba(0,0,0,0.5)',
    overlayDismisses,
    // children
    children,
    height,
    width,
    minHeight,
    minWidth,
    maxWidth,
    maxHeight,
    velocity,
    animation,
    ...rest
  } = props

  // only shared between both
  const modalProps: ModalPropsReact = {
    transparent,
    visible,
    onRequestClose,
    onShow,
    presentationStyle,
    supportedOrientations,
    onDismiss,
    onOrientationChange,
    hardwareAccelerated,
    statusBarTranslucent,
  }

  const themeName = useThemeName()
  const finalChildren = typeof children === 'function' ? children(visible) : children

  if (isWeb) {
    const pointerEvents = visible ? 'auto' : 'none'
    const modalVisible = useDebounceValue(visible, visible ? 200 : 0)

    useLayoutEffect(() => {
      if (visible) {
        document.body.classList.add('modal-open')
        return () => {
          document.body.classList.remove('modal-open')
        }
      }
    }, [visible])

    // this fixes page getting stuck at top, at the expense of a flicker
    if (isTouchDevice) {
      useLayoutEffect(() => {
        if (visible) {
          return () => {
            const og = document.body.style.display
            setTimeout(() => {
              document.body.style.display = 'none'
              setTimeout(() => {
                document.body.style.display = og
              }, 0)
            })
          }
        }
      }, [visible])
    }

    return (
      <ModalNative {...modalProps} visible={modalVisible}>
        <Theme name={themeName}>
          <YStack
            position="absolute"
            ref={preventFormFocusBug as any}
            fullscreen
            pointerEvents={pointerEvents}
            backgroundColor={visible ? overlayBackground : 'transparent'}
            alignItems="center"
            justifyContent="center"
            onPressOut={overlayDismisses ? onRequestClose : undefined}
            onPress={onDismiss}
          >
            <AnimatedStack
              {...{
                height,
                width,
                minHeight,
                minWidth,
                maxWidth,
                maxHeight,
                velocity,
                pointerEvents,
                animateState: modalVisible ? 'in' : 'out',
                animation,
              }}
            >
              <ModalYStack onPress={prevent} pointerEvents={pointerEvents} {...rest}>
                {finalChildren}
              </ModalYStack>
            </AnimatedStack>
          </YStack>
        </Theme>
      </ModalNative>
    )
  }

  return (
    <ModalNative animationType={animationType} {...modalProps}>
      <Theme name={themeName}>
        <YStack flex={1} {...rest} backgroundColor="$bg">
          {finalChildren}
        </YStack>
      </Theme>
    </ModalNative>
  )
}

export const ModalYStack = styled(YStack, {
  backgroundColor: '$bg',
  borderRadius: 12,
  alignItems: 'center',
  position: 'relative',
  shadowColor: '$shadowColor',
  shadowRadius: 20,
  shadowOffset: { height: 10, width: 0 },
  flex: 1,
  maxHeight: '100%',
})

function preventFormFocusBug(node: any) {
  for (const child of Array.from(document.body.children)) {
    if (child.contains(node)) {
      const preventFormFocusBug = (e) => e.stopPropagation()
      child.addEventListener('mousedown', preventFormFocusBug, true)
    }
  }
}

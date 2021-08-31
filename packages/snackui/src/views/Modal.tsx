import React from 'react'
import { Modal as ModalNative, ModalProps as ModalPropsReact } from 'react-native'

import { prevent } from '../helpers/prevent'
import { useDebounceValue } from '../hooks/useDebounce'
import { Theme, useTheme, useThemeName } from '../hooks/useTheme'
import { isWeb } from '../platform'
import { StackProps } from '../StackProps'
import { AnimatedStackProps, AnimatedVStack } from './AnimatedStack'
import { AbsoluteVStack, VStack } from './Stacks'

// TODO if we add `closableButton` prop we can control exit animation nicely

export type ModalProps = Omit<ModalPropsReact, 'children'> &
  Omit<AnimatedStackProps, 'animateState'> & {
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

  const theme = useTheme()

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

    return (
      <ModalNative {...modalProps} visible={modalVisible}>
        <Theme name={themeName}>
          <AbsoluteVStack
            ref={preventFormFocusBug as any}
            fullscreen
            pointerEvents={pointerEvents}
            backgroundColor={visible ? overlayBackground : 'transparent'}
            alignItems="center"
            justifyContent="center"
            onPressOut={overlayDismisses ? onRequestClose : undefined}
            onPress={onDismiss}
          >
            <AnimatedVStack
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
              <ModalPane onPress={prevent} pointerEvents={pointerEvents} {...rest}>
                {finalChildren}
              </ModalPane>
            </AnimatedVStack>
          </AbsoluteVStack>
        </Theme>
      </ModalNative>
    )
  }

  return (
    <ModalNative animationType={animationType} {...modalProps}>
      <Theme name={themeName}>
        <VStack flex={1} {...rest} backgroundColor={theme.backgroundColor}>
          {finalChildren}
        </VStack>
      </Theme>
    </ModalNative>
  )
}

function ModalPane(props: StackProps) {
  const theme = useTheme()
  return (
    <VStack
      backgroundColor={theme.backgroundColor}
      borderRadius={26}
      alignItems="center"
      position="relative"
      shadowColor={theme.shadowColor}
      shadowRadius={180}
      flex={1}
      maxHeight="100%"
      {...props}
    />
  )
}

function preventFormFocusBug(node: any) {
  for (const child of Array.from(document.body.children)) {
    if (child.contains(node)) {
      const preventFormFocusBug = (e) => e.stopPropagation()
      child.addEventListener('mousedown', preventFormFocusBug, true)
    }
  }
}

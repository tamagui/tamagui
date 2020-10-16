import React, { useEffect } from 'react'
import {
  Modal as ModalNative,
  ModalProps as ModalPropsReact,
  TouchableOpacity,
} from 'react-native'

import { isWeb } from '../constants'
import { prevent } from '../helpers/prevent'
import { useDebounceValue } from '../hooks/useDebounce'
import { AnimatedStackProps, AnimatedVStack } from './AnimatedStack'
import { AbsoluteVStack, VStack } from './Stacks'

// TODO if we add `closableButton` prop we can control exit animation nicely

export type ModalProps = ModalPropsReact &
  Omit<AnimatedStackProps, 'animateState'> & {
    visible?: boolean
    overlayBackground?: string
    overlayDismisses?: boolean
  }

export const Modal = (props: ModalProps) => {
  const {
    // modal specific props
    visible = true,
    animationType = 'slide', // keep this only for native for now
    transparent = true,
    onRequestClose,
    onShow,
    // ios specific
    presentationStyle,
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
  const modalProps = {
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

  if (isWeb) {
    const pointerEvents = visible ? 'auto' : 'none'
    const modalVisible = useDebounceValue(visible, visible ? 300 : 0)
    return (
      <ModalNative {...modalProps} visible={modalVisible}>
        <AbsoluteVStack
          fullscreen
          pointerEvents={pointerEvents}
          backgroundColor={visible ? overlayBackground : 'transparent'}
          alignItems="center"
          justifyContent="center"
          onPress={overlayDismisses ? onRequestClose : undefined}
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
              animateState: visible ? 'in' : 'out',
              animation,
            }}
          >
            <VStack
              backgroundColor="#fff"
              borderRadius={15}
              alignItems="center"
              position="relative"
              overflow="hidden"
              shadowColor="rgba(0,0,0,0.5)"
              shadowRadius={40}
              onPress={prevent}
              flex={1}
              pointerEvents={pointerEvents}
              {...rest}
            >
              {children}
            </VStack>
          </AnimatedVStack>
        </AbsoluteVStack>
      </ModalNative>
    )
  }

  return (
    <ModalNative animationType={animationType} {...modalProps}>
      {/* fix for native: https://github.com/facebook/react-native/issues/26892 */}
      <TouchableOpacity
        activeOpacity={1}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        onPressOut={(e) => {
          if (e.nativeEvent?.locationY) {
            onRequestClose?.()
          }
        }}
      >
        <VStack flex={1} {...rest} backgroundColor="green">
          {children}
        </VStack>
      </TouchableOpacity>
    </ModalNative>
  )
}

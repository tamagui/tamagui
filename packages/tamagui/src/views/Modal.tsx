import { AnimatePresence } from '@tamagui/animate-presence'
import {
  Theme,
  isTouchDevice,
  isWeb,
  styled,
  useIsomorphicLayoutEffect,
  useThemeName,
} from '@tamagui/core'
import { YStack, YStackProps } from '@tamagui/stacks'
import { useDebounceValue } from '@tamagui/use-debounce'
import React from 'react'
import {
  ModalBaseProps,
  Modal as ModalNative,
  ModalPropsAndroid,
  ModalPropsIOS,
} from 'react-native'

import { prevent } from '../helpers/prevent'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

type ModalPropsReact = ModalBaseProps & ModalPropsIOS & ModalPropsAndroid

export type ModalProps = Omit<ModalPropsReact, 'children'> &
  YStackProps & {
    visible?: boolean
    overlayBackground?: string
    overlayDismisses?: boolean
    children?: any | ((open?: boolean) => any)
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
    animation = 'modal',
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

    useIsomorphicLayoutEffect(() => {
      if (visible) {
        document.body.classList.add('modal-open')
        return () => {
          document.body.classList.remove('modal-open')
        }
      }
    }, [visible])

    // this fixes page getting stuck at top, at the expense of a flicker
    if (isTouchDevice) {
      useIsomorphicLayoutEffect(() => {
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
            <AnimatePresence>
              {visible && (
                <YStack
                  {...{
                    height,
                    width,
                    minHeight,
                    minWidth,
                    maxWidth,
                    maxHeight,
                    pointerEvents,
                    animation: animation as any,
                  }}
                >
                  {/* @ts-ignore */}
                  <ModalYStack onPress={prevent} pointerEvents={pointerEvents} {...rest}>
                    {finalChildren}
                  </ModalYStack>
                </YStack>
              )}
            </AnimatePresence>
          </YStack>
        </Theme>
      </ModalNative>
    )
  }

  return (
    <ModalNative animationType={animationType} {...modalProps}>
      <Theme name={themeName}>
        <YStack flex={1} {...rest} backgroundColor="$background">
          {finalChildren}
        </YStack>
      </Theme>
    </ModalNative>
  )
}

export const ModalYStack = styled(YStack, {
  backgroundColor: '$background',
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

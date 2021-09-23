import React, { memo, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { useForceUpdate } from '../hooks/useForceUpdate'
import { isWeb } from '../platform'
import { AnimatedVStack } from './AnimatedStack'
import { AbsoluteVStack, VStack } from './Stacks'
import { Text } from './Text'

export type ToastOptions = {
  duration?: number
  type?: 'info' | 'success' | 'error'
}

let clear = () => {}

let show: (text: string, options?: ToastOptions) => void = (text) => {
  console.warn('Note:', text)
}

export const Toast = {
  clear,
  show: (text: string, options?: ToastOptions) => show(text, options),
  error: (text: string, options?: Omit<ToastOptions, 'type'>) =>
    show(text, { ...options, type: 'error' }),
  success: (text: string, options?: Omit<ToastOptions, 'type'>) =>
    show(text, { ...options, type: 'success' }),
}

if (typeof window !== 'undefined') {
  window['Toast'] = Toast
}

export const ToastRoot = memo(function ToastRoot() {
  const forceUpdate = useForceUpdate()
  const stateRef = useRef({
    show: false,
    text: '',
    type: 'info',
    timeout: null,
  })
  const setState = (x: any) => {
    stateRef.current = x
    forceUpdate()
  }

  useEffect(() => {
    return () => {
      clearTimeout(stateRef.current.timeout ?? 0)
    }
  }, [])

  clear = () => {
    setState({ show: false, text: '' })
  }

  show = useCallback(
    (text: string, { duration = 3000, type = 'info' }: ToastOptions = {}) => {
      clearTimeout(stateRef.current.timeout ?? 0)
      const timeout = setTimeout(() => {
        setState({
          show: false,
          text: '',
          type,
          timeout: null,
        })
      }, duration)
      setState({
        show: true,
        text,
        type,
        timeout,
      })
    },
    [stateRef]
  )

  const state = stateRef.current

  const contents = (
    <AbsoluteVStack
      pointerEvents="none"
      fullscreen
      alignItems="center"
      justifyContent="flex-end"
      zIndex={10000000000}
      padding="5%"
    >
      {state.show && !!state.text && (
        <AnimatedVStack>
          <VStack
            backgroundColor={
              // TODO theme
              state.type === 'info'
                ? 'rgba(100, 140, 100, 0.95)'
                : state.type === 'success'
                ? 'rgba(20,180,120,0.95)'
                : 'rgba(190,60,60, 0.95)'
            }
            shadowColor="rgba(0,0,0,0.35)"
            shadowOffset={{ height: 10, width: 0 }}
            shadowRadius={40}
            borderRadius={12}
            paddingHorizontal={18}
            paddingVertical={12}
          >
            <Text color="#fff" fontSize={18} fontWeight="600">
              {state.text}
            </Text>
          </VStack>
        </AnimatedVStack>
      )}
    </AbsoluteVStack>
  )

  const portalEl = document.getElementById('toasts')

  if (isWeb && portalEl) {
    return createPortal(contents, portalEl)
  }

  return contents
})

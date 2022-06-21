import { AnimatePresence } from '@tamagui/animate-presence'
import { AnimationKeys, Theme, isWeb } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import { Paragraph } from '@tamagui/text'
import { useForceUpdate } from '@tamagui/use-force-update'
import { memo, useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export type ToastOptions = {
  duration?: number
  type?: 'info' | 'success' | 'error'
}

let clear = () => {}

let show: (content: any, options?: ToastOptions) => void = (content) => {
  console.warn('Note:', content)
}

export const Toast = {
  clear,
  show: (content: any, options?: ToastOptions) => show(content, options),
  error: (content: any, options?: Omit<ToastOptions, 'type'>) =>
    show(content, { ...options, type: 'error' }),
  success: (content: any, options?: Omit<ToastOptions, 'type'>) =>
    show(content, { ...options, type: 'success' }),
}

if (typeof window !== 'undefined') {
  window['Toast'] = Toast
}

export const ToastRoot = memo(function ToastRoot(props: { animation?: AnimationKeys }) {
  const forceUpdate = useForceUpdate()
  const stateRef = useRef({
    show: false,
    content: '',
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
    setState({ show: false, content: '' })
  }

  show = useCallback(
    (content: any, { duration = 3000, type = 'info' }: ToastOptions = {}) => {
      clearTimeout(stateRef.current.timeout ?? 0)
      const timeout = setTimeout(() => {
        setState({
          show: false,
          content: '',
          type,
          timeout: null,
        })
      }, duration)
      setState({
        show: true,
        content,
        type,
        timeout,
      })
    },
    [stateRef]
  )

  const state = stateRef.current

  const contents = (
    <YStack
      position="absolute"
      pointerEvents="none"
      fullscreen
      alignItems="center"
      justifyContent="flex-end"
      zIndex={10000000000}
      padding="5%"
    >
      <Theme name={state.type === 'info' ? null : state.type === 'success' ? 'green' : 'red'}>
        <AnimatePresence>
          {state.show && !!state.content && (
            <YStack
              animation={props.animation || ('toast' as any)}
              backgroundColor="$background"
              elevation="$2"
              borderRadius="$4"
              paddingHorizontal="$4"
              paddingVertical="$3"
            >
              <Paragraph>{state.content}</Paragraph>
            </YStack>
          )}
        </AnimatePresence>
      </Theme>
    </YStack>
  )

  const portalEl = document.getElementById('toasts')

  if (isWeb && portalEl) {
    return createPortal(contents, portalEl)
  }

  return contents
})

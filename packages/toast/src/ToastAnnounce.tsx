import {
  GetProps,
  Stack,
  TamaguiElement,
  Text,
  styled,
  useEvent,
  useIsomorphicLayoutEffect,
} from '@tamagui/core'
import { Portal } from '@tamagui/portal'
import { VisuallyHidden } from '@tamagui/visually-hidden'
import * as React from 'react'

import { TOAST_NAME } from './constants'
import { ScopedProps, useToastProviderContext } from './ToastProvider'

const ToastAnnounceExcludeFrame = styled(Stack, {
  name: 'ToastAnnounceExclude',
})
type ToastAnnounceExcludeFrameProps = GetProps<typeof ToastAnnounceExcludeFrame>
type ToastAnnounceExcludeProps = ToastAnnounceExcludeFrameProps & {
  altText?: string
}

const ToastAnnounceExclude = React.forwardRef<TamaguiElement, ToastAnnounceExcludeProps>(
  (props: ScopedProps<ToastAnnounceExcludeProps>, forwardedRef) => {
    const { __scopeToast, altText, ...announceExcludeProps } = props

    return (
      <ToastAnnounceExcludeFrame
        data-toast-announce-exclude=""
        data-toast-announce-alt={altText || undefined}
        {...announceExcludeProps}
        ref={forwardedRef}
      />
    )
  }
)

/* -----------------------------------------------------------------------------------------------*/

interface ToastAnnounceProps
  extends Omit<GetProps<typeof VisuallyHidden>, 'children'>,
    ScopedProps<{ children: string[] }> {}

const ToastAnnounce: React.FC<ToastAnnounceProps> = (
  props: ScopedProps<ToastAnnounceProps>
) => {
  const { __scopeToast, children, ...announceProps } = props
  const context = useToastProviderContext(TOAST_NAME, __scopeToast)
  const [renderAnnounceText, setRenderAnnounceText] = React.useState(false)
  const [isAnnounced, setIsAnnounced] = React.useState(false)

  // render text content in the next frame to ensure toast is announced in NVDA
  useNextFrame(() => setRenderAnnounceText(true))

  // cleanup after announcing
  React.useEffect(() => {
    const timer = setTimeout(() => setIsAnnounced(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return isAnnounced ? null : (
    <Portal asChild>
      <VisuallyHidden {...announceProps}>
        {renderAnnounceText && (
          <Text>
            {context.label} {children}
          </Text>
        )}
      </VisuallyHidden>
    </Portal>
  )
}

/* -----------------------------------------------------------------------------------------------*/

function useNextFrame(callback = () => {}) {
  const fn = useEvent(callback)
  useIsomorphicLayoutEffect(() => {
    let raf1 = 0
    let raf2 = 0
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(fn)
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [fn])
}

export {
  ToastAnnounce,
  ToastAnnounceProps,
  ToastAnnounceExclude,
  ToastAnnounceExcludeProps,
}

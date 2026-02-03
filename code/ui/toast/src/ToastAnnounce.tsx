import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { GetProps, TamaguiElement } from '@tamagui/core'
import { View, Text, styled, useEvent } from '@tamagui/core'
import { Portal } from '@tamagui/portal'
import { startTransition } from '@tamagui/start-transition'
import { VisuallyHidden } from '@tamagui/visually-hidden'
import * as React from 'react'

import type { ScopedProps } from './ToastProvider'
import { useToastProviderContext } from './ToastProvider'

const ToastAnnounceExcludeFrame = styled(View, {
  name: 'ToastAnnounceExclude',
})

type ToastAnnounceExcludeFrameProps = GetProps<typeof ToastAnnounceExcludeFrame>

type ToastAnnounceExcludeExtraProps = {
  altText?: string
}

type ToastAnnounceExcludeProps = ToastAnnounceExcludeFrameProps &
  ToastAnnounceExcludeExtraProps

const ToastAnnounceExclude = React.forwardRef<TamaguiElement, ToastAnnounceExcludeProps>(
  (props, forwardedRef) => {
    const { altText, ...announceExcludeProps } = props

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
  extends
    Omit<GetProps<typeof VisuallyHidden>, 'children'>,
    ScopedProps<{ children: string[] }> {}

const ToastAnnounce: React.FC<ToastAnnounceProps> = (
  props: ScopedProps<ToastAnnounceProps>
) => {
  const { scope, children, ...announceProps } = props
  const context = useToastProviderContext(scope)
  const [renderAnnounceText, setRenderAnnounceText] = React.useState(false)
  const [isAnnounced, setIsAnnounced] = React.useState(false)

  // render text content in the next frame to ensure toast is announced in NVDA
  useNextFrame(() => {
    startTransition(() => {
      setRenderAnnounceText(true)
    })
  })

  // cleanup after announcing
  React.useEffect(() => {
    const timer = setTimeout(() => setIsAnnounced(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return isAnnounced ? null : (
    <Portal>
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
  ToastAnnounceExclude,
  type ToastAnnounceExcludeProps,
  type ToastAnnounceProps,
}

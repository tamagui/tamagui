import '@tamagui/polyfill-dev'

import { isWeb } from '@tamagui/constants'
import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import { createPortal } from 'react-dom'

import type { PortalProps } from './PortalProps'

export const Portal = React.memo(
  ({ host = globalThis.document?.body, ...props }: PortalProps) => {
    const contents = (
      <YStack
        contain="strict"
        fullscreen
        // @ts-expect-error ok on web
        position={isWeb ? 'fixed' : 'absolute'}
        maxWidth={isWeb ? '100vw' : '100%'}
        maxHeight={isWeb ? '100vh' : '100%'}
        pointerEvents="none"
        {...props}
      />
    )

    const [hostElement, setHostElement] = React.useState<any>(null)

    useIsomorphicLayoutEffect(() => {
      setHostElement(host)
    }, [host])

    if (hostElement && props.children) {
      return createPortal(contents, hostElement) as any
    }

    // ssr return null
    return null
  }
)

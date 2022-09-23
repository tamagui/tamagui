/* eslint-disable react-hooks/rules-of-hooks */
import '@tamagui/polyfill-dev'

import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { PortalProps } from './PortalProps'

export const Portal = ({ host = globalThis.document?.body, ...props }: PortalProps) => {
  const contents = (
    <YStack
      pointerEvents="box-none"
      contain="strict"
      fullscreen
      // @ts-expect-error ok on web
      position={isWeb ? 'fixed' : 'absolute'}
      maxWidth={isWeb ? '100vw' : '100%'}
      maxHeight={isWeb ? '100vh' : '100%'}
      {...props}
    />
  )

  const [hostElement, setHostElement] = React.useState<any>(null)

  useIsomorphicLayoutEffect(() => {
    setHostElement(host)
  }, [host])

  if (hostElement) {
    return createPortal(contents, hostElement)
  }

  // ssr return null
  return null
}

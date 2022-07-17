/* eslint-disable react-hooks/rules-of-hooks */
import '@tamagui/polyfill-dev'

import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/core'
import { YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { createPortal } from 'react-dom'

export type PortalProps = YStackProps & {
  host?: any // element
}

export const Portal = ({ host = globalThis.document?.body, ...props }: PortalProps) => {
  const contents = (
    <YStack
      pointerEvents="box-none"
      fullscreen
      // @ts-expect-error ok on web
      position={isWeb ? 'fixed' : 'absolute'}
      maxWidth={isWeb ? '100vw' : '100%'}
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

import '@tamagui/polyfill-dev'

import { isServer } from '@tamagui/constants'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import { createPortal } from 'react-dom'

import { useStackedZIndex } from '@tamagui/z-index-stack'
import { getStackedZIndexProps } from './helpers'
import type { PortalProps } from './PortalProps'

// web only version

export const Portal = React.memo((propsIn: PortalProps) => {
  if (isServer) {
    return null
  }

  const { host = globalThis.document?.body, stackZIndex, children, ...props } = propsIn
  const zIndex = useStackedZIndex(getStackedZIndexProps(propsIn))

  return createPortal(
    <YStack
      contain="strict"
      fullscreen
      // @ts-expect-error ok on web
      position="fixed"
      maxWidth="100vw"
      maxHeight="100vh"
      pointerEvents="none"
      {...props}
      zIndex={zIndex}
    >
      {children}
    </YStack>,
    host
  ) as any
})

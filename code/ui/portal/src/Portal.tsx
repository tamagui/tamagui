import '@tamagui/polyfill-dev'

import { isServer } from '@tamagui/constants'
import { useStackedZIndex } from '@tamagui/z-index-stack'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { getStackedZIndexProps } from './helpers'
import type { PortalProps } from './PortalProps'

export const Portal = React.memo((propsIn: PortalProps) => {
  if (isServer) {
    return null
  }

  const body = globalThis.document?.body

  if (!body) {
    return propsIn.children
  }

  const { children, passThrough } = propsIn
  const zIndex = useStackedZIndex(getStackedZIndexProps(propsIn))

  if (passThrough) {
    return children
  }

  return createPortal(
    <span
      style={{
        zIndex,
        position: 'fixed',
        inset: 0,
        contain: 'strict',
        pointerEvents: 'none',
      }}
    >
      {children}
    </span>,
    body
  )
})

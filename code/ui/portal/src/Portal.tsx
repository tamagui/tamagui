import '@tamagui/polyfill-dev'

import { isServer } from '@tamagui/constants'
import { TamaguiRoot } from '@tamagui/web'
import { useStackedZIndex, ZIndexHardcodedContext } from '@tamagui/z-index-stack'
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

  // provide computed z-index to children so nested portals can stack above
  const content = (
    <ZIndexHardcodedContext.Provider value={zIndex}>
      {children}
    </ZIndexHardcodedContext.Provider>
  )

  return createPortal(
    <TamaguiRoot
      style={{
        zIndex,
        position: 'fixed',
        inset: 0,
        contain: 'strict',
        pointerEvents: 'none',
        // prevent mobile browser from scrolling/moving this fixed element
        touchAction: 'none',
        display: 'flex',
      }}
    >
      {content}
    </TamaguiRoot>,
    body
  )
})

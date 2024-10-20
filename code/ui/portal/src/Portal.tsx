import '@tamagui/polyfill-dev'

import { isServer } from '@tamagui/constants'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import { createPortal } from 'react-dom'

import type { PortalProps } from './PortalProps'

// web only version

const CurrentPortalZIndices: Record<string, number> = {}

export const Portal = React.memo(
  ({
    host = globalThis.document?.body,
    stackZIndex,
    zIndex: zIndexProp = 1000,
    ...props
  }: PortalProps) => {
    if (isServer) {
      return null
    }

    const zIndex = (() => {
      if (stackZIndex) {
        const highest = Object.values(CurrentPortalZIndices).reduce(
          (acc, cur) => Math.max(acc, cur),
          0
        )
        return Math.max(stackZIndex, highest + 1)
      }
      if (zIndexProp) {
        return zIndexProp
      }
    })()

    const id = React.useId()
    React.useEffect(() => {
      if (typeof zIndex === 'number') {
        CurrentPortalZIndices[id] = zIndex
        return () => {
          delete CurrentPortalZIndices[id]
        }
      }
    }, [zIndex])

    return createPortal(
      <YStack
        contain="strict"
        fullscreen
        // @ts-expect-error ok on web
        position="fixed"
        maxWidth="100vw"
        maxHeight="100vh"
        pointerEvents="none"
        zIndex={zIndex}
        {...props}
      />,
      host
    ) as any
  }
)

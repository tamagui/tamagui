import * as React from 'react'
import '@tamagui/polyfill-dev'

import { isServer } from '@tamagui/constants'
import { YStack } from '@tamagui/stacks'

import ReactDOM from 'react-dom'

import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import type { PortalProps } from './PortalProps'

// web only version

export const Portal = React.memo(
  ({ host = globalThis.document?.body, ...props }: PortalProps) => {
    if (isServer) {
      return null
    }

    const didFinishSSR = useDidFinishSSR()

    const contents = (
      <YStack
        contain="strict"
        fullscreen
        // @ts-expect-error ok on web
        position="fixed"
        maxWidth="100vw"
        maxHeight="100vh"
        pointerEvents="none"
        {...props}
      />
    )

    return ReactDOM.createPortal(didFinishSSR ? contents : null, host) as any
  }
)

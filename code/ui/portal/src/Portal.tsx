import '@tamagui/polyfill-dev'

import { YStack } from '@tamagui/stacks'
import { useDidFinishSSR } from '@tamagui/use-did-finish-ssr'
import { useStackedZIndex } from '@tamagui/z-index-stack'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { getStackedZIndexProps } from './helpers'
import type { PortalProps } from './PortalProps'

// root div for inserting portals into
// were creating this because otherwise we get bad freezes if you hydrate into document.documentElement
let rootDiv: HTMLDivElement | null = null

function getRootDiv() {
  if (rootDiv) {
    return rootDiv
  }

  const DEFAULT_PORTAL_ROOT = process.env.TAMAGUI_DEFAULT_PORTAL_ROOT
    ? document.querySelector(process.env.TAMAGUI_DEFAULT_PORTAL_ROOT)!
    : globalThis.document?.body

  rootDiv = document.createElement('div')
  rootDiv.style.display = 'contents'
  rootDiv.id = `tamagui-root-portal`
  DEFAULT_PORTAL_ROOT.appendChild(rootDiv)

  rootDiv
}

// web only version

export const Portal = React.memo((propsIn: PortalProps) => {
  const isHydated = useDidFinishSSR()

  if (!isHydated) {
    return null
  }

  const { host = getRootDiv(), stackZIndex, children, ...props } = propsIn
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

/* eslint-disable react-hooks/rules-of-hooks */
import '@tamagui/polyfill-dev'

import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/core'
import { YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { Modal } from 'react-native'

export type PortalProps = YStackProps

export const Portal = (props: PortalProps) => {
  const contents = <YStack pointerEvents="none" fullscreen {...props} />

  if (!isWeb) {
    // check if theme stays in context here
    return (
      <Modal visible transparent pointerEvents="none">
        {contents}
      </Modal>
    )
  }

  const [hostElement, setHostElement] = React.useState<any>(null)

  useIsomorphicLayoutEffect(() => {
    setHostElement(globalThis.document?.body)
  }, [])

  if (hostElement) {
    return createPortal(contents, hostElement)
  }

  // ssr return null
  return null
}

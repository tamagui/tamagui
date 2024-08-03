import * as React from 'react'
import { YStack } from '@tamagui/stacks'

// @ts-ignore
import { Platform, RootTagContext } from 'react-native'

import { PortalItem } from './GorhomPortal'
import type { PortalProps } from './PortalProps'

const isFabric = global?.nativeFabricUIManager
let createPortal
if (isFabric) {
  createPortal = require('react-native/Libraries/Renderer/shims/ReactFabric').createPortal
} else {
  createPortal = require('react-native/Libraries/Renderer/shims/ReactNative').createPortal
}

export const Portal = (props: PortalProps) => {
  const rootTag = React.useContext(RootTagContext)

  const contents = (
    <YStack
      pointerEvents="box-none"
      fullscreen
      position="absolute"
      maxWidth="100%"
      zIndex={100000}
      {...props}
    />
  )

  if (Platform.OS === 'android' || !rootTag) {
    return <PortalItem hostName="root">{contents}</PortalItem>
  }

  return createPortal(contents, rootTag)
}

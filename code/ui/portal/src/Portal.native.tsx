import { YStack } from '@tamagui/stacks'
import * as React from 'react'
// @ts-ignore
import { Platform, RootTagContext } from 'react-native'

import { PortalItem } from './GorhomPortal'
import type { PortalProps } from './PortalProps'
import { useStackedZIndex } from './useStackedZIndex'

const isFabric = global?.nativeFabricUIManager
let createPortal
if (isFabric) {
  createPortal = require('react-native/Libraries/Renderer/shims/ReactFabric').createPortal
} else {
  createPortal = require('react-native/Libraries/Renderer/shims/ReactNative').createPortal
}

export const Portal = (propsIn: PortalProps) => {
  const { stackZIndex, ...props } = propsIn

  const rootTag = React.useContext(RootTagContext)
  const zIndex = useStackedZIndex(propsIn)

  const contents = (
    <YStack
      pointerEvents="box-none"
      fullscreen
      position="absolute"
      maxWidth="100%"
      {...props}
      zIndex={zIndex}
    />
  )

  if (
    process.env.TAMAGUI_USE_NATIVE_PORTAL === 'false' ||
    Platform.OS === 'android' ||
    !rootTag
  ) {
    return <PortalItem hostName="root">{contents}</PortalItem>
  }

  return createPortal(contents, rootTag)
}

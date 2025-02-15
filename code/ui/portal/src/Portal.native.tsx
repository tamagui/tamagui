import { YStack } from '@tamagui/stacks'
import { useStackedZIndex } from '@tamagui/z-index-stack'
import * as React from 'react'
import { RootTagContext } from 'react-native'
import { IS_FABRIC, USE_NATIVE_PORTAL } from './constants'
import { GorhomPortalItem } from './GorhomPortalItem'
import { getStackedZIndexProps } from './helpers'
import type { PortalProps } from './PortalProps'

const createPortal = (() => {
  if (IS_FABRIC) {
    try {
      return require('react-native/Libraries/Renderer/shims/ReactFabric').createPortal
    } catch (err) {
      console.info(`Note: error importing portal, defaulting to non-native portals`, err)
      return null
    }
  }
  try {
    return require('react-native/Libraries/Renderer/shims/ReactNative').createPortal
  } catch (err) {
    console.info(`Note: error importing portal, defaulting to non-native portals`, err)
    return null
  }
})()

export const Portal = (propsIn: PortalProps) => {
  const { stackZIndex, ...props } = propsIn

  const rootTag = React.useContext(RootTagContext)
  const zIndex = useStackedZIndex(getStackedZIndexProps(propsIn))

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

  if (!createPortal || !USE_NATIVE_PORTAL || !rootTag) {
    return <GorhomPortalItem hostName="root">{contents}</GorhomPortalItem>
  }

  return createPortal(contents, rootTag)
}

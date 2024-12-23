import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import { RootTagContext } from 'react-native'
import { IS_FABRIC, USE_NATIVE_PORTAL } from './constants'
import type { PortalProps } from './PortalProps'
import { useStackedZIndex } from './useStackedZIndex'
import { GorhomPortalItem } from './GorhomPortalItem'

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

  if (!createPortal || !USE_NATIVE_PORTAL || !rootTag) {
    return <GorhomPortalItem hostName="root">{contents}</GorhomPortalItem>
  }

  return createPortal(contents, rootTag)
}

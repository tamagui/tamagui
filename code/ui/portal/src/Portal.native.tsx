import { View } from '@tamagui/core'
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
      const ReactFabricShimModule = require('react-native/Libraries/Renderer/shims/ReactFabric')

      return (
        ReactFabricShimModule?.default?.createPortal ?? ReactFabricShimModule.createPortal
      )
    } catch (err) {
      console.info(`Note: error importing portal, defaulting to non-native portals`, err)
      return null
    }
  }
  try {
    const ReactNativeShimModule =
      require('react-native/Libraries/Renderer/shims/ReactNative')

    return (
      ReactNativeShimModule?.default?.createPortal ?? ReactNativeShimModule.createPortal
    )
  } catch (err) {
    console.info(`Note: error importing portal, defaulting to non-native portals`, err)
    return null
  }
})()

export const Portal = (propsIn: PortalProps) => {
  const rootTag = React.useContext(RootTagContext)
  const zIndex = useStackedZIndex(getStackedZIndexProps(propsIn))

  const { children, passThrough } = propsIn

  const contents = (
    <View
      pointerEvents="box-none"
      position="absolute"
      inset={0}
      maxWidth="100%"
      zIndex={zIndex}
      passThrough={passThrough}
    >
      {children}
    </View>
  )

  if (!createPortal || !USE_NATIVE_PORTAL || !rootTag) {
    return (
      <GorhomPortalItem passThrough={passThrough} hostName="root">
        {contents}
      </GorhomPortalItem>
    )
  }

  return createPortal(contents, rootTag)
}

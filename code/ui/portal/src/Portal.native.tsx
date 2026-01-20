import { View } from '@tamagui/core'
import { useStackedZIndex } from '@tamagui/z-index-stack'
import * as React from 'react'
import { RootTagContext } from 'react-native'
import { USE_NATIVE_PORTAL } from './constants'
import { GorhomPortalItem } from './GorhomPortalItem'
import { getStackedZIndexProps } from './helpers'
import type { PortalProps } from './PortalProps'

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

  const createPortal = (globalThis as any).__tamagui_portal_create

  if (!createPortal || !USE_NATIVE_PORTAL || !rootTag) {
    return (
      <GorhomPortalItem passThrough={passThrough} hostName="root">
        {contents}
      </GorhomPortalItem>
    )
  }

  return createPortal(contents, rootTag)
}

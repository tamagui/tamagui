import { YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { AppRegistry } from 'react-native'
import { createPortal } from 'react-native/Libraries/Renderer/shims/ReactNative'

export type PortalProps = YStackProps

let root = 0
const og = AppRegistry.runApplication.bind(AppRegistry)
AppRegistry.runApplication = function (...args) {
  root = args[1]?.rootTag
  return og(...args)
}

export const Portal = (props: PortalProps) => {
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

  if (root) {
    return createPortal(contents, root)
  }

  return null
}

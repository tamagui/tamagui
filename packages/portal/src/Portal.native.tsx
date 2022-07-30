import { YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
// @ts-ignore
import { RootTagContext } from 'react-native'
import { createPortal } from 'react-native/Libraries/Renderer/shims/ReactNative'

export type PortalProps = YStackProps

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

  if (rootTag) {
    return createPortal(contents, rootTag)
  }

  return null
}

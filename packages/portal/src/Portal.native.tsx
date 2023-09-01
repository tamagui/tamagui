import { YStack } from '@tamagui/stacks'
import * as React from 'react'
// @ts-ignore
import { Platform, RootTagContext } from 'react-native'
import { createPortal } from 'react-native/Libraries/Renderer/shims/ReactNative'

import { PortalItem } from './GorhomPortal'
import { PortalProps } from './PortalProps'

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

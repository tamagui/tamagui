import { YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
// @ts-ignore
import { RootTagContext } from 'react-native'
import { createPortal } from 'react-native/Libraries/Renderer/shims/ReactNative'

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

  if (rootTag) {
    return createPortal(contents, rootTag)
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.warn(
      `Missing rootTag, this is a bug - you may need a different React Native version, or to avoid using "modal" on native.`
    )
  }

  return null
}

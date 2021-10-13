import { SSRProvider } from '@react-aria/ssr'
import { OverlayProvider } from '@react-native-aria/overlays'
import * as React from 'react'

// bugfix esbuild strips react
React['keep']

export const PopoverProvider = (props: { children?: any }) => {
  return (
    <SSRProvider>
      <OverlayProvider>{props.children}</OverlayProvider>
    </SSRProvider>
  )
}

import { OverlayProvider } from '@react-native-aria/overlays'
import * as React from 'react'

// bugfix esbuild strips react
React['createElement']

export const PopoverProvider = (props: { children?: any }) => {
  return (
    <>
      <OverlayProvider>{props.children}</OverlayProvider>
    </>
  )
}

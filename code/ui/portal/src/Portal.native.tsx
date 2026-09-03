import { View } from '@tamagui/core'
import { getPortal, NativePortal } from '@tamagui/native'
import { useStackedZIndex } from '@tamagui/z-index-stack'
import { GorhomPortalItem } from './GorhomPortalItem'
import { getStackedZIndexProps } from './helpers'
import type { PortalProps } from './PortalProps'

// react-native parses zIndex as a 32-bit int (RawValue casts number props to
// `int`), so anything above INT32_MAX wraps around silently — most notably
// Number.MAX_SAFE_INTEGER, which becomes -1 and renders the portal *behind*
// app content. Clamp so "as high as possible" stays as high as possible.
const MAX_INT32_Z_INDEX = 2147483647

export const Portal = (propsIn: PortalProps) => {
  const stackedZIndex = useStackedZIndex(getStackedZIndexProps(propsIn))
  const zIndex = Math.min(stackedZIndex, MAX_INT32_Z_INDEX)
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

  const portalState = getPortal().state

  // use teleport if available (best option - preserves context)
  if (portalState.type === 'teleport') {
    return <NativePortal hostName="root">{contents}</NativePortal>
  }

  // fall back to Gorhom portal system (JS-based, needs context re-propagation)
  return (
    <GorhomPortalItem passThrough={passThrough} hostName="root">
      {contents}
    </GorhomPortalItem>
  )
}

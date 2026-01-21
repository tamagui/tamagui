import { View } from '@tamagui/core'
import { getNativePortalState, NativePortal } from '@tamagui/native-portal'
import { useStackedZIndex } from '@tamagui/z-index-stack'
import { GorhomPortalItem } from './GorhomPortalItem'
import { getStackedZIndexProps } from './helpers'
import type { PortalProps } from './PortalProps'

export const Portal = (propsIn: PortalProps) => {
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

  const portalState = getNativePortalState()

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

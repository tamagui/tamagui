import { YStack } from '@tamagui/stacks'
import { PortalItem } from './GorhomPortal'
import type { PortalProps } from './PortalProps'

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

  return <PortalItem hostName="root">{contents}</PortalItem>
}

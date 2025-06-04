import type { YStackProps } from '@tamagui/stacks'
import type { StackZIndexProp } from '@tamagui/z-index-stack/types'

export type PortalProps = YStackProps & {
  host?: any // element
  inactive?: boolean
  stackZIndex?: StackZIndexProp
}

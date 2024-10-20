import type { YStackProps } from '@tamagui/stacks'

export type PortalProps = YStackProps & {
  host?: any // element
  inactive?: boolean
  stackZIndex?: number
}

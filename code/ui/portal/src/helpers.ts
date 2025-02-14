import { getTokenValue } from '@tamagui/web'
import type { PortalProps } from './PortalProps'

export const getStackedZIndexProps = (propsIn: PortalProps) => {
  return {
    stackZIndex: propsIn.stackZIndex,
    zIndex:
      typeof propsIn.zIndex === 'undefined' || propsIn.zIndex === 'unset'
        ? undefined
        : getTokenValue(propsIn.zIndex as any, 'zIndex'),
  }
}

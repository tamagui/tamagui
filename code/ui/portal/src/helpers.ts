import { getTokenValue, type ViewProps } from '@tamagui/web'
import type { PortalProps } from './PortalProps'

export const getStackedZIndexProps = (propsIn: PortalProps) => {
  return {
    stackZIndex: propsIn.stackZIndex,
    zIndex: resolveViewZIndex(propsIn.zIndex),
  }
}

export const resolveViewZIndex = (zIndex: ViewProps['zIndex']) => {
  return typeof zIndex === 'undefined' || zIndex === 'unset'
    ? undefined
    : typeof zIndex === 'number'
      ? zIndex
      : getTokenValue(zIndex as any, 'zIndex')
}

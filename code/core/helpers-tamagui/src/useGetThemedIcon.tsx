import { getFontSize } from '@tamagui/font-size'
import type { SizeTokens, Token } from '@tamagui/web'

import { getIcon } from './getIcon'
import type { ColorProp } from './useCurrentColor'
import { useCurrentColor } from './useCurrentColor'

export const getThemedIconSize = (
  size: SizeTokens | number | null | undefined,
  scaleIcon = 1
) => {
  return (typeof size === 'number' ? size * 0.5 : getFontSize(size as Token)) * scaleIcon
}

export const useGetThemedIcon = (props: { color: ColorProp; size?: number }) => {
  const color = useCurrentColor(props.color)
  return (el: any) => {
    return getIcon(el, {
      ...props,
      color,
    })
  }
}

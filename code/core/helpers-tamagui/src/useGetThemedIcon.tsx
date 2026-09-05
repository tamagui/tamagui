import { resolveSize } from '@tamagui/size'
import type { SizeTokens } from '@tamagui/web'

import { getIcon } from './getIcon'
import type { ColorProp } from './useCurrentColor'
import { useCurrentColor } from './useCurrentColor'

/** icon px for a size: the recipe's icon (font size on the 4px grid), numbers are px */
export const getThemedIconSize = (
  size: SizeTokens | number | null | undefined,
  scaleIcon = 1
) => {
  if (typeof size === 'number') return size * scaleIcon
  return resolveSize(size).icon * scaleIcon
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

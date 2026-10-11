import { getFontSize } from '@tamagui/font-size'

import { getIcon } from './getIcon'
import type { ColorProp } from './useCurrentColor'
import { useCurrentColor } from './useCurrentColor'

/** icon px for a size: numbers are px, strings are font size keys, else the 16px default */
export const getThemedIconSize = (
  size: string | number | boolean | null | undefined,
  scaleIcon = 1
) => {
  if (typeof size === 'number') return size * scaleIcon
  if (typeof size === 'string') return getFontSize(size as any) * scaleIcon
  return 16 * scaleIcon
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

import { getIcon } from './getIcon'
import type { ColorProp } from './useCurrentColor'
import { useCurrentColor } from './useCurrentColor'

export const useGetThemedIcon = (props: { color: ColorProp; size?: number }) => {
  const color = useCurrentColor(props.color)
  return (el: any) => {
    return getIcon(el, {
      ...props,
      color,
    })
  }
}

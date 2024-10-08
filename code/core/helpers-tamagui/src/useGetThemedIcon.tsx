import React from 'react'
import type { ColorProp } from './useCurrentColor'
import { useCurrentColor } from './useCurrentColor'

export const useGetThemedIcon = (props: { color: ColorProp; size: number }) => {
  const color = useCurrentColor(props.color)
  return (el: any) => {
    if (!el) return el
    if (React.isValidElement(el)) {
      return React.cloneElement(el, {
        ...props,
        color,
        // @ts-expect-error
        ...el.props,
      })
    }
    return React.createElement(el, props)
  }
}

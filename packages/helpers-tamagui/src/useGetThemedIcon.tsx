import { cloneElement, createElement, isValidElement } from 'react'

import { ColorProp, useCurrentColor } from './useCurrentColor'

export const useGetThemedIcon = (props: { color: ColorProp; size: number }) => {
  const color = useCurrentColor(props.color)
  return (el: any) => {
    if (!el) return el
    const next = {
      ...props,
      color,
    }
    return isValidElement(el) ? cloneElement(el, next) : createElement(el, next)
  }
}

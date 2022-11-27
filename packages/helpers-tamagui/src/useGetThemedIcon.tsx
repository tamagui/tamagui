import { cloneElement, createElement, isValidElement } from 'react'

import { ColorProp, useCurrentColor } from './useCurrentColor'

export const useGetThemedIcon = (props: { color: ColorProp; size: number }) => {
  const color = useCurrentColor(props.color)
  return (el: any) => {
    if (!el) return el
    if (isValidElement(el)) {
      return cloneElement(el, {
        ...props,
        // @ts-expect-error
        ...el.props,
      })
    }
    return createElement(el, props)
  }
}

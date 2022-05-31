import React, { isValidElement } from 'react'

import { ColorProp, useCurrentColor } from './useCurrentColor'

export const useGetThemedIcon = (props: { color: ColorProp; size: number }) => {
  const color = useCurrentColor(props.color)
  return (el: any) => {
    if (isValidElement(el)) {
      return el
    }
    if (el) {
      return React.createElement(el, {
        ...props,
        color,
      })
    }
    return el
  }
}

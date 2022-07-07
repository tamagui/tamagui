import React, { isValidElement } from 'react'

import { ColorProp, useCurrentColor } from './useCurrentColor'

export const useGetThemedIcon = (props: { color: ColorProp; size: number }) => {
  const color = useCurrentColor(props.color)
  return (el: any) => {
    if (el) {
      if (isValidElement(el)) {
        return React.cloneElement(el as any, {
          ...props,
          color,
          // @ts-ignore
          ...el.props,
        })
      }
      return React.createElement(el, {
        ...props,
        color,
      })
    }
    return el
  }
}

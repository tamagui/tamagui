import React from 'react'

export const getIcon = (
  el: any,
  props: {
    size?: number
    color?: string
  }
) => {
  if (!el) return el
  if (React.isValidElement(el)) {
    return React.cloneElement(el, {
      ...props,
      // @ts-expect-error
      ...el.props,
    })
  }
  return React.createElement(el, props)
}

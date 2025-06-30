import React from "react"

export const useGetIcon = () => {
  return (el: any, props: any) => {
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
}
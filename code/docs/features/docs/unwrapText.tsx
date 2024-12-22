import React from 'react'

export function unwrapText(children: any) {
  return React.Children.toArray(children).map((x) => {
    // @ts-ignore
    return x?.props?.children ? x.props.children : x
  })
}

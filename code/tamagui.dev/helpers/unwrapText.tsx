import React from 'react'

export function unwrapText(children: any) {
  // console.log('React.Children.toArray(children)', React.Children.toArray(children))
  return React.Children.toArray(children).map((x) => {
    // console.log('x', x.type)
    // @ts-ignore
    return x?.props?.children ? x.props.children : x
  })
}

import { Children } from 'react'

export function getBashText(children: any): any {
  return Children.toArray(children).flatMap((x) => {
    // @ts-ignore
    return x?.props?.children ? getBashText(x.props.children).join('') : x
  })
}

/**
 * Credit to geist-ui/react, it's initialy copied from there and updated.
 * 
 * MIT License

Copyright (c) 2020 Geist UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import React, {
  Children,
  type ReactElement,
  type ReactNode,
  cloneElement,
  isValidElement,
} from 'react'

type ReactChildArray = ReturnType<typeof React.Children.toArray>

export function flattenChildrenKeyless(children: ReactNode): ReactChildArray {
  const childrenArray = React.Children.toArray(children)
  return childrenArray.reduce((flatChildren: ReactChildArray, child) => {
    if ((child as React.ReactElement<any>).type === React.Fragment) {
      return flatChildren.concat(
        flattenChildren((child as React.ReactElement<any>).props.children)
      )
    }
    flatChildren.push(child)
    return flatChildren
  }, [])
}

export function flattenChildren(
  children: ReactNode,
  componentNamesToIgnore?: string[],
  depth = 0,
  keys: (string | number)[] = []
): ReactNode[] {
  return Children.toArray(children)
    .flatMap((elem) => {
      if (isValidElement(elem)) {
        if (
          typeof (elem as any)?.type == 'function' &&
          componentNamesToIgnore?.some((skipComponentName) =>
            (elem.type as any).displayName.includes(skipComponentName)
          )
        ) {
          return (elem as any).props.children
        }
      }
      return elem
    })
    .reduce((acc: ReactNode[], node: any, nodeIndex) => {
      if (node.type === React.Fragment) {
        acc.push.apply(
          acc,
          flattenChildren(
            node.props.children,
            componentNamesToIgnore,
            depth + 1,
            keys.concat(node.key || nodeIndex)
          )
        )
      } else {
        if (isValidElement(node)) {
          acc.push(
            cloneElement(node, {
              key: keys.concat(String(node.key)).join('.'),
            })
          )
        } else if (typeof node === 'string' || typeof node === 'number') {
          acc.push(node)
        }
      }
      return acc
    }, [])
}

export const pickChildren = <Props = any>(
  _children: ReactNode | undefined,
  targetChild: React.ElementType,
  componentNamesToIgnore?: string[]
) => {
  const children = flattenChildren(_children, componentNamesToIgnore)
  const target: ReactElement<Props>[] = []
  const withoutTargetChildren = React.Children.map(children, (item) => {
    if (!isValidElement(item)) return item
    if (isInstanceOfComponent(item, targetChild)) {
      // @ts-expect-error
      target.push(cloneElement(item))
      return null
    }
    return item
  })

  const targetChildren = target.length >= 0 ? target : undefined

  return {
    targetChildren,
    withoutTargetChildren,
  }
}

export const isInstanceOfComponent = (
  element: React.ReactElement | ReactNode | undefined,
  targetElement: React.ElementType
) => {
  const matches =
    (element as any)?.type === targetElement ||
    (typeof (element as any)?.type == 'function' &&
      ((element as any)?.type?.displayName === (targetElement as any).displayName ||
        (element as any)?.type?.displayName ===
          (targetElement as any).displayName + 'Wrapper'))
  return matches
}

export const filterNull = <T extends unknown | null | undefined>(
  t: T
): t is NonNullable<T> => {
  return t != null
}

export const create = <Props extends {}>(
  Component: React.ComponentType<Props>,
  displayName: string
) => {
  const MenuComponent: React.FC<Props> = (props: Props) => {
    return <Component {...(props as any)} />
  }
  MenuComponent.displayName = displayName

  return MenuComponent
}

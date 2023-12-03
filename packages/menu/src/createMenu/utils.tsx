/**
 * Credit to geist-ui/react for this file, it's copied from there.
 */

import React, {
  Children,
  ReactChild,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
} from 'react'

type ReactChildArray = ReturnType<typeof React.Children.toArray>

export function flattenChildrenKeyless(children: React.ReactNode): ReactChildArray {
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
  depth = 0,
  keys: (string | number)[] = []
): ReactChild[] {
  return Children.toArray(children).reduce((acc: ReactChild[], node: any, nodeIndex) => {
    if (node.type === React.Fragment) {
      acc.push.apply(
        acc,
        flattenChildren(
          node.props.children,
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

export const pickChildren = <Props = any,>(
  _children: React.ReactNode | undefined,
  targetChild: React.ElementType
) => {
  const children = flattenChildren(_children)
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
  element: React.ReactElement | React.ReactChild | undefined,
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

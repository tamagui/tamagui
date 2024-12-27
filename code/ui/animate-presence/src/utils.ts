import { isValidElement, Children, type ReactElement, type ReactNode } from 'react'

export type ComponentKey = string | number

export const getChildKey = (child: ReactElement<any>): ComponentKey => child.key || ''

export function onlyElements(children: ReactNode): ReactElement<any>[] {
  const filtered: ReactElement<any>[] = []

  // We use forEach here instead of map as map mutates the component key by preprending `.$`
  Children.forEach(children, (child) => {
    if (isValidElement(child)) filtered.push(child)
  })

  return filtered
}

export function invariant(condition: any, log: string, ...logVars: string[]) {
  if (!condition) {
    throw new Error(
      process.env.NODE_ENV === 'development'
        ? log
            .split('%s')
            .flatMap((chunk, i) => [chunk, logVars[i]])
            .join('')
        : log
    )
  }
}

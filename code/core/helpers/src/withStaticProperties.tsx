import React from 'react'

const Decorated = Symbol()

type Combined<A, B> = A & B

export const withStaticProperties = <A extends Function, B>(
  component: A,
  staticProps: B
): Combined<A, B> => {
  // clone component if already wrapped once
  const next = (() => {
    if (component[Decorated]) {
      const _ = React.forwardRef((props, ref) =>
        React.createElement(component as any, { ...props, ref })
      )
      // attach existing things again
      for (const key in component) {
        const v = component[key]
        // @ts-ignore
        _[key] = v && typeof v === 'object' ? { ...v } : v
      }
    }
    return component
  })()

  // add new things
  Object.assign(next, staticProps)
  next[Decorated] = true

  return next as any as A & B
}

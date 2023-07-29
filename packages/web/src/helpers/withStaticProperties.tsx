import { createElement, forwardRef } from 'react'

const Decorated = Symbol()

export const withStaticProperties = function <A extends Function, B>(
  component: A,
  staticProps: B
): A & B {
  // clone component if already wrapped once
  const next = (() => {
    if (component[Decorated]) {
      return forwardRef((props, ref) =>
        createElement(component as any, { ...props, ref })
      )
    }
    return component
  })()

  // attach existing things again
  for (const key in component) {
    const v = component[key]
    // @ts-ignore
    next[key] = v && typeof v === 'object' ? { ...v } : v
  }

  // add new things
  Object.assign(next, staticProps)
  next[Decorated] = true

  return next as any as A & B
}

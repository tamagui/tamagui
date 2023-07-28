const WarnReAssignSymbol = Symbol()

export const withStaticProperties = function <A extends Function, B>(
  component: A,
  staticProps: B
): A & B {
  // clone if object to stay immutable
  const next = typeof component === 'function' ? component : { ...(component as any) }

  // nice dev helper that avoids super confusing errors
  if (process.env.NODE_ENV === 'development') {
    if (next[WarnReAssignSymbol]) {
      throw new Error(
        `Error: You're calling withStaticProperties() on a component that already has withStaticProperties() assigned to it! This will cause super strange errors.`
      )
    }
    next[WarnReAssignSymbol] = true
  }

  Object.assign(next, staticProps)
  return next as A & B
}

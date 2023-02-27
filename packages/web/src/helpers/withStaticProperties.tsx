export const withStaticProperties = function <A extends Function, B>(
  component: A,
  staticProps: B
): A & B {
  // clone if object to stay immutable
  const next = typeof component === 'function' ? component : { ...(component as any) }
  Object.assign(next, staticProps)
  return next as A & B
}

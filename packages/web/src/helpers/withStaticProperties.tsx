export const withStaticProperties = function <A extends Function, B>(
  component: A,
  staticProps: B
): A & B {
  // clone if object to stay immutable
  const next =
    typeof component === 'function' ? component.bind({}) : { ...(component as any) }
  // need to clone staticProps too so they don't get overwritten
  if (next.staticProps) {
    next.staticProps = { ...next.staticProps }
  }
  Object.assign(next, staticProps)
  return next as A & B
}

export const withStaticProperties = function <A extends Function, B>(
  component: A,
  staticProps: B
): A & B {
  Object.assign(component, staticProps)
  return component as any
}

const Decorated = Symbol()

type Combined<A, B> = A & B

export const withStaticProperties = <A extends Function, B extends Record<string, any>>(
  component: A,
  staticProps: B
): Combined<A, B> => {
  // add static properties
  Object.assign(component, staticProps)
  component[Decorated] = true

  return component as any
}

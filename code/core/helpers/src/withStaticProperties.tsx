const Decorated = Symbol()

type Combined<A, B> = A & B

export const withStaticProperties = <A extends Function, B extends Record<string, any>>(
  component: A,
  staticProps: B
): Combined<A, B> => {
  const out = (() => {
    if ((component as any)[Decorated]) {
      // never mutate an already-decorated component: assigning onto a shared
      // compound component (e.g. withStaticProperties(Tooltip, { Content }))
      // would replace its sub-components globally, remounting every currently
      // open instance the next time it renders (tamagui.dev promo tooltip
      // jumped mid-hover when a lazy-loaded bento chunk did exactly this)
      return typeof component === 'function'
        ? Object.assign(component.bind(null), component)
        : { ...(component as any) }
    }
    return component
  })() as any

  Object.assign(out, staticProps)
  out[Decorated] = true

  return out as any
}

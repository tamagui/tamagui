import { TamaguiComponent } from '../types'

export const withStaticProperties = function <
  A extends TamaguiComponent | Function,
  ExtraStaticProps
>(
  component: A,
  staticProps: ExtraStaticProps
): A extends TamaguiComponent<infer A, infer B, infer C, infer D, infer E>
  ? TamaguiComponent<A, B, C, D, E & ExtraStaticProps>
  : A & ExtraStaticProps {
  // clone if object to stay immutable
  const next = typeof component === 'function' ? component : { ...(component as any) }
  Object.assign(next, staticProps)
  return next as any
}

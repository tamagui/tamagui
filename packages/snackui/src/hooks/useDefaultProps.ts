// could this optimize?

export function useDefaultProps<A extends Object>(a: Partial<A>, b: A): A {
  return { ...a, ...b }
}

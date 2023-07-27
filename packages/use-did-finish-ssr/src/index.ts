import { useSyncExternalStore } from 'react'

const emptyFn = () => {}
const emptyFnFn = () => emptyFn

export function useDidFinishSSR<A extends any = boolean>(value?: A): A | false {
  return useSyncExternalStore(
    emptyFnFn,
    () => (value == undefined ? true : value),
    () => false as any
  )
}

type FunctionOrValue<Value> = Value extends () => infer X ? X : Value

export function useClientValue<Value extends any>(
  value?: Value
): FunctionOrValue<Value> | undefined {
  const done = useDidFinishSSR()
  return !done ? undefined : typeof value === 'function' ? value() : value
}

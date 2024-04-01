// import { useSyncExternalStore } from 'react'
import * as rscSafeReact from '@tamagui/rsc-safe'
const { useSyncExternalStore } = rscSafeReact

const emptyFn = () => {}
const emptyFnFn = () => emptyFn

export function useDidFinishSSR<A = boolean>(value?: A): A | false {
  if (process.env.TAMAGUI_TARGET === 'native') {
    // @ts-expect-error
    return value ?? true
  }

  return useSyncExternalStore(
    emptyFnFn,
    () => (value == undefined ? true : value),
    () => false as any
  )
}

type FunctionOrValue<Value> = Value extends () => infer X ? X : Value

export function useClientValue<Value>(value?: Value): FunctionOrValue<Value> | undefined {
  const done = useDidFinishSSR()
  return !done ? undefined : typeof value === 'function' ? value() : value
}

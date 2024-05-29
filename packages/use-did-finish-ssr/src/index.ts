import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from 'react'

const emptyFn = () => {}
const emptyFnFn = () => emptyFn

export function useDidFinishSSR<A = boolean>(
  value?: A,
  options?: {
    sync?: boolean
  }
): A | false {
  if (process.env.TAMAGUI_TARGET === 'native') {
    // @ts-expect-error
    return value ?? true
  }

  if (options?.sync) {
    return useSyncExternalStore(
      emptyFnFn,
      () => (value == undefined ? true : value),
      () => false as any
    )
  }

  const [cur, setCur] = useState<any>(value)
  useEffect(() => {
    setCur(value ?? true)
  }, [])
  return cur ?? false
}

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function useDidFinishSSRSync<A = boolean>(value?: A): A | false {
  return useDidFinishSSR(value, {
    sync: true,
  })
}

type FunctionOrValue<Value> = Value extends () => infer X ? X : Value

export function useClientValue<Value>(value?: Value): FunctionOrValue<Value> | undefined {
  const done = useDidFinishSSR()
  return !done ? undefined : typeof value === 'function' ? value() : value
}

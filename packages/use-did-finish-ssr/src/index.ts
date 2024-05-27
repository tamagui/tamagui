import { useEffect, useLayoutEffect, useState } from 'react'

const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect

export function useDidFinishSSR<A = boolean>(value?: A): A | false {
  if (process.env.TAMAGUI_TARGET === 'native') {
    // @ts-expect-error
    return value ?? true
  }

  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  // @ts-expect-error
  return value === undefined ? hydrated : hydrated ? value : undefined
}

type FunctionOrValue<Value> = Value extends () => infer X ? X : Value

export function useClientValue<Value>(value?: Value): FunctionOrValue<Value> | undefined {
  const done = useDidFinishSSR()
  return !done ? undefined : typeof value === 'function' ? value() : value
}

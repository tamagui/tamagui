import * as React from 'react'
import { ClientOnlyContext } from './ClientOnly'

export { ClientOnly, ClientOnlyContext } from './ClientOnly'

export const useIsClientOnly = (): boolean => {
  return React.useContext(ClientOnlyContext)
}

export function useDidFinishSSR<A = boolean>(value?: A): A | false {
  const clientOnly = React.useContext(ClientOnlyContext)

  if (clientOnly || process.env.TAMAGUI_TARGET === 'native') {
    // @ts-expect-error
    return value ?? true
  }

  return React.useSyncExternalStore(
    subscribe,
    () => value ?? true,
    () => {
      return false as any
    }
  )
}

const subscribe = () => () => {}

type FunctionOrValue<Value> = Value extends () => infer X ? X : Value

export function useClientValue<Value>(value?: Value): FunctionOrValue<Value> | undefined {
  const done = useDidFinishSSR()
  // @ts-expect-error this is fine but started to error in ts latest
  return !done ? undefined : typeof value === 'function' ? value() : value
}

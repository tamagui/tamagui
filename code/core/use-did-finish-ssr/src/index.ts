import * as React from 'react'
import { ClientOnlyContext } from './ClientOnly'

export { ClientOnly, ClientOnlyContext } from './ClientOnly'

export const useIsClientOnly = (): boolean => {
  return React.useContext(ClientOnlyContext)
}

export function useDidFinishSSR(): boolean {
  const clientOnly = React.useContext(ClientOnlyContext)

  if (clientOnly || process.env.TAMAGUI_TARGET === 'native') {
    return true
  }

  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}

const subscribe = () => () => {}

type FunctionOrValue<Value> = Value extends () => infer X ? X : Value

export function useClientValue<Value>(value?: Value): FunctionOrValue<Value> | undefined {
  const done = useDidFinishSSR()
  // @ts-expect-error this is fine but started to error in ts latest
  return !done ? undefined : typeof value === 'function' ? value() : value
}

import * as React from 'react'

export function useDidFinishSSR<A = boolean>(value?: A): A | false {
  if (process.env.TAMAGUI_TARGET === 'native') {
    // @ts-expect-error
    return value ?? true
  }

  const [cur, setCur] = React.useState<any>(value)
  React.useEffect(() => {
    setCur(value ?? true)
  }, [])
  return cur ?? false
}

type FunctionOrValue<Value> = Value extends () => infer X ? X : Value

export function useClientValue<Value>(value?: Value): FunctionOrValue<Value> | undefined {
  const done = useDidFinishSSR()
  return !done ? undefined : typeof value === 'function' ? value() : value
}

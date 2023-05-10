import React, { createContext, useMemo } from 'react'

export type VariantContextProvider<Props extends Object = any> = React.FunctionComponent<
  Props & {
    children?: React.ReactNode
  }
> & {
  context: React.Context<any>
}

export function createVariantContext<
  Props extends Record<string, any>
>(): VariantContextProvider<Props> {
  const Context = createContext<any>(null)

  const Provider: VariantContextProvider = ({
    children,
    ...values
  }: Props & { children?: React.ReactNode }) => {
    return (
      <Context.Provider value={useMemo(() => values, [JSON.stringify(values)])}>
        {children}
      </Context.Provider>
    )
  }

  Provider.context = Context

  return Provider
}

import React, { createContext, useMemo } from 'react'

export type VariantProvider<Props extends Object = any> = React.FunctionComponent<
  Props & {
    children?: React.ReactNode
  }
> & {
  Context: React.Context<any>
  variants: Object
}

export function createVariantProvider<Variants extends Record<string, any>>(
  variants: Variants
): VariantProvider<Variants> {
  const Context = createContext<any>(null)

  const Provider: VariantProvider = ({
    children,
    ...values
  }: Variants & { children?: React.ReactNode }) => {
    return (
      <Context.Provider value={useMemo(() => values, [JSON.stringify(values)])}>
        {children}
      </Context.Provider>
    )
  }

  Provider.Context = Context
  Provider.variants = variants

  return Provider
}

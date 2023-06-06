import React, { createContext, useContext, useMemo } from 'react'

export type StyledContext<Props extends Object = any> = Omit<
  React.Context<Props>,
  'Provider'
> & {
  props: Object
  Provider: React.ProviderExoticComponent<
    Partial<Props> & {
      children?: React.ReactNode
    }
  >
}

export function createStyledContext<VariantProps extends Record<string, any>>(
  props: VariantProps
): StyledContext<VariantProps> {
  const OGContext = createContext<any>(null)
  const OGProvider = OGContext.Provider
  const Context = OGContext as any as StyledContext<VariantProps>

  const Provider = ({
    children,
    ...values
  }: VariantProps & { children?: React.ReactNode }) => {
    const stableMemoArray = Object.keys(props).map((key) => values[key])
    const value = useMemo(() => values, stableMemoArray)
    return <OGProvider value={value}>{children}</OGProvider>
  }

  // @ts-ignore
  Context.Provider = Provider
  Context.props = props

  return Context
}

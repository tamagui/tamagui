import React from 'react'
import type { Context, ProviderExoticComponent, ReactNode } from 'react'

import { objectIdentityKey } from './objectIdentityKey'

export type StyledContext<Props extends Object = any> = Omit<
  Context<Props>,
  'Provider'
> & {
  context: Context<Props>
  props: Object | undefined
  Provider: ProviderExoticComponent<
    Partial<Props | undefined> & {
      children?: ReactNode
      scope?: string
    }
  >

  useStyledContext: (scope?: string) => Props
}

// avoid react compiler - we aren't breaking its rules but it shouldn't compile this file because
// it will mis-interpret how we change the context value. in
const createReactContext = React[Math.random() ? 'createContext' : 'createContext']

export function createStyledContext<VariantProps extends Record<string, any>>(
  defaultValues?: VariantProps
): StyledContext<VariantProps> {
  const OGContext = createReactContext<VariantProps | undefined>(defaultValues)
  const OGProvider = OGContext.Provider
  const Context = OGContext as any as StyledContext<VariantProps>
  const scopedContexts = new Map<string, Context<VariantProps | undefined>>()

  function getOrCreateScopedContext(scope: string) {
    let ScopedContext = scopedContexts.get(scope)
    if (!ScopedContext) {
      ScopedContext = createReactContext<VariantProps | undefined>(defaultValues)
      scopedContexts.set(scope, ScopedContext)
    }
    return ScopedContext!
  }

  const Provider = ({
    children,
    scope,
    ...values
  }: VariantProps & { children?: ReactNode; scope: string }) => {
    const next = React.useMemo(() => {
      return {
        // this ! is a workaround for ts error
        ...defaultValues!,
        ...values,
      }
    }, [objectIdentityKey(values)])
    let Provider = OGProvider
    if (scope) {
      Provider = getOrCreateScopedContext(scope).Provider
    }
    return <Provider value={next}>{children}</Provider>
  }

  // use consumerComponent just to give a better error message
  const useStyledContext = (scope?: string) => {
    const context = scope ? getOrCreateScopedContext(scope) : OGContext
    return React.useContext(context!) as VariantProps
  }

  // @ts-ignore
  Context.Provider = Provider
  Context.props = defaultValues
  Context.context = OGContext as Context<VariantProps>
  Context.useStyledContext = useStyledContext

  return Context
}

export type ScopedProps<P, K extends string> = P & { [Key in `__scope${K}`]?: string }

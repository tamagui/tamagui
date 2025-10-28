import type { Context, ReactNode } from 'react'
import React, { useContext } from 'react'
import type { StyledContext } from '../types'
import { mergeProps } from './mergeProps'
import { objectIdentityKey } from './objectIdentityKey'

// test types:
// const x = createContext({})
// const y = x.Provider
// export const ButtonContext = createStyledContext({
//   size: '$4',
// })
// const z = useContext(ButtonContext.context)

// avoid react compiler - we aren't breaking its rules but it shouldn't compile this file because
// it will mis-interpret how we change the context value. in
const createReactContext = React[Math.random() ? 'createContext' : 'createContext']

export function createStyledContext<VariantProps extends Record<string, any>>(
  defaultValues?: VariantProps,
  namespace = ''
): StyledContext<VariantProps> {
  const OGContext = createReactContext<VariantProps | undefined>(defaultValues)
  const OGProvider = OGContext.Provider
  const Context = OGContext as any as StyledContext<VariantProps>
  const scopedContexts = new Map<string, Context<VariantProps | undefined>>()
  const LastScopeInNamespace = createReactContext<string>(namespace)

  function getOrCreateScopedContext(scope: string) {
    let ScopedContext = scopedContexts.get(scope)
    if (!ScopedContext) {
      ScopedContext = createReactContext<VariantProps | undefined>(defaultValues)
      scopedContexts.set(scope, ScopedContext)
    }
    return ScopedContext!
  }

  const getNamespacedScope = (scope: string) =>
    namespace ? `${namespace}--${scope}` : scope

  const Provider = ({
    children,
    scope: scopeIn,
    // performance: avoid creating objects
    __disableMergeDefaultValues,
    ...values
  }: VariantProps & { children?: ReactNode; scope: string }) => {
    const scope = getNamespacedScope(scopeIn)

    const next = React.useMemo(() => {
      if (__disableMergeDefaultValues) {
        // we already merged and want to keep ordering
        return values
      }
      return mergeProps(defaultValues!, values)
    }, [objectIdentityKey(values)])

    let ScopedProvider = OGProvider
    if (scope) {
      ScopedProvider = getOrCreateScopedContext(scope).Provider
    }
    return (
      <LastScopeInNamespace.Provider value={scope}>
        <ScopedProvider value={next as VariantProps}>{children}</ScopedProvider>
      </LastScopeInNamespace.Provider>
    )
  }

  // use consumerComponent just to give a better error message
  const useStyledContext = (scopeIn = '') => {
    const lastScopeInNamespace = useContext(LastScopeInNamespace)
    const scope = namespace
      ? scopeIn
        ? getNamespacedScope(scopeIn)
        : lastScopeInNamespace
      : scopeIn
    const context = scope ? getOrCreateScopedContext(scope) : OGContext
    const value = React.useContext(context!) as VariantProps
    return value
  }

  // @ts-expect-error we are overriding default provider
  Context.Provider = Provider
  Context.props = defaultValues
  Context.context = OGContext as Context<VariantProps>
  Context.useStyledContext = useStyledContext

  return Context
}

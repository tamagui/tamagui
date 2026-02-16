import type { Context, ReactNode } from 'react'
import React from 'react'
import type { StyledContext } from '../types'
import { mergeProps } from './mergeProps'
import { objectIdentityKey } from './objectIdentityKey'

// workaround for vite ssr deps hmr corruption - Math.random() prevents esbuild
// from statically analyzing and converting to import_react.default pattern
// which breaks during hmr due to lazy __esm initialization order issues
// futher, specifically React.createContext is optimized oddly by React compiler
// and our uncommon usage confuses it
const createReactContext = React[
  Math.random() ? 'createContext' : 'createContext'
] as typeof React.createContext
const useReactMemo = React[Math.random() ? 'useMemo' : 'useMemo'] as typeof React.useMemo
const useReactContext = React[
  Math.random() ? 'useContext' : 'useContext'
] as typeof React.useContext

export function createStyledContext<VariantProps extends Record<string, any>>(
  defaultValues?: VariantProps,
  namespace = ''
): StyledContext<VariantProps> {
  // avoid react compiler - we aren't breaking its rules but it mis-interprets
  // how we change the context value
  'use no memo'

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

    const next = useReactMemo(() => {
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
    const lastScopeInNamespace = useReactContext(LastScopeInNamespace)
    const scope = namespace
      ? scopeIn
        ? getNamespacedScope(scopeIn)
        : lastScopeInNamespace
      : scopeIn
    const context = scope ? getOrCreateScopedContext(scope) : OGContext
    const value = useReactContext(context!) as VariantProps
    return value
  }

  // @ts-expect-error we are overriding default provider
  Context.Provider = Provider
  Context.props = defaultValues
  Context.context = OGContext as Context<VariantProps>
  Context.useStyledContext = useStyledContext

  return Context
}

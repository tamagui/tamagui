// from radix
// https://github.com/radix-ui/primitives/blob/main/packages/react/context/src/createContext.tsx

import * as React from 'react'

export type ScopedProps<P, K extends string> = P & { [Key in `__scope${K}`]?: Scope }

export function createContext<ContextValueType extends object | null>(
  rootComponentName: string,
  defaultContext?: ContextValueType
) {
  const Context = React.createContext<ContextValueType | undefined>(defaultContext)

  function Provider(props: ContextValueType & { children: React.ReactNode }) {
    const { children, ...context } = props
    // Only re-memoize when prop values change

    const value = React.useMemo(() => context, Object.values(context)) as ContextValueType
    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  function useContext(consumerName: string): Exclude<typeof context, undefined> {
    const context = React.useContext(Context)
    if (context) return context as any
    if (defaultContext !== undefined) return defaultContext as any
    // if a defaultContext wasn't specified, it's a required context.
    throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``)
  }

  Provider.displayName = `${rootComponentName}Provider`
  return [Provider, useContext] as const
}

/* -------------------------------------------------------------------------------------------------
 * createContextScope
 * -----------------------------------------------------------------------------------------------*/

type ScopeHook = (scope: Scope) => { [__scopeProp: string]: Scope }

export type Scope<C = any> = { [scopeName: string]: React.Context<C>[] } | undefined

export interface CreateScope {
  scopeName: string
  (): ScopeHook
}

export function createContextScope(
  scopeName: string,
  createContextScopeDeps: CreateScope[] = []
) {
  let defaultContexts: any[] = []

  /* -----------------------------------------------------------------------------------------------
   * createContext
   * ---------------------------------------------------------------------------------------------*/

  function createContext<ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType
  ) {
    const BaseContext = React.createContext<ContextValueType | undefined>(defaultContext)
    const index = defaultContexts.length
    defaultContexts = [...defaultContexts, defaultContext]

    function Provider(
      props: ContextValueType & {
        scope: Scope<ContextValueType>
        children: React.ReactNode
      }
    ) {
      const { scope, children, ...context } = props
      const Context = scope?.[scopeName]?.[index] || BaseContext
      // Only re-memoize when prop values change

      const value = React.useMemo(
        () => context,
        Object.values(context)
      ) as ContextValueType
      return <Context.Provider value={value}>{children}</Context.Provider>
    }

    function useContext(
      consumerName: string,
      scope: Scope<ContextValueType | undefined>,
      options?: {
        warn?: boolean
        fallback?: Partial<ContextValueType>
      }
    ) {
      const Context = scope?.[scopeName]?.[index] || BaseContext
      const context = React.useContext(Context)
      if (context) return context
      // if a defaultContext wasn't specified, it's a required context.
      if (defaultContext !== undefined) return defaultContext
      const missingContextMessage = `\`${consumerName}\` must be used within \`${rootComponentName}\``
      // fallback can be given per-hook as well
      if (options?.fallback) {
        if (options?.warn !== false) {
          console.warn(missingContextMessage)
        }
        return options.fallback as ContextValueType
      }
      throw new Error(missingContextMessage)
    }

    Provider.displayName = `${rootComponentName}Provider`
    return [Provider, useContext] as const
  }

  /* -----------------------------------------------------------------------------------------------
   * createScope
   * ---------------------------------------------------------------------------------------------*/

  const createScope: CreateScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return React.createContext(defaultContext)
    })
    return function useScope(scope: Scope) {
      const contexts = scope?.[scopeName] || scopeContexts
      return React.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      )
    }
  }

  createScope.scopeName = scopeName
  return [
    createContext,
    composeContextScopes(createScope, ...createContextScopeDeps),
  ] as const
}

/* -------------------------------------------------------------------------------------------------
 * composeContextScopes
 * -----------------------------------------------------------------------------------------------*/

function composeContextScopes(...scopes: CreateScope[]) {
  const baseScope = scopes[0]
  if (scopes.length === 1) return baseScope

  const createScope: CreateScope = () => {
    const scopeHooks = scopes.map((createScope) => ({
      useScope: createScope(),
      scopeName: createScope.scopeName,
    }))

    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes, { useScope, scopeName }) => {
        // We are calling a hook inside a callback which React warns against to avoid inconsistent
        // renders, however, scoping doesn't have render side effects so we ignore the rule.

        const scopeProps = useScope(overrideScopes)
        const currentScope = scopeProps[`__scope${scopeName}`]
        return { ...nextScopes, ...currentScope }
      }, {})

      return React.useMemo(
        () => ({ [`__scope${baseScope.scopeName}`]: nextScopes }),
        [nextScopes]
      )
    }
  }

  createScope.scopeName = baseScope.scopeName
  return createScope
}

/* -----------------------------------------------------------------------------------------------*/

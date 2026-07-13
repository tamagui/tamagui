import type { Context, ReactNode } from 'react'
import React from 'react'
import type { StyledContext, StyledContextOptions } from '../types'
import { mergeProps } from './mergeProps'
import { objectIdentityKey } from './objectIdentityKey'

type EmptyDefault = Record<PropertyKey, never>

type EmptyDefaultOptions =
  | string
  | {
      namespace?: string
      keys?: never
    }

type StyledContextKey<Props> = Extract<keyof Props, string>

type OptionalStyledContextKeys<Props extends Record<string, any>> = {
  [Key in keyof Props]-?: {} extends Pick<Props, Key> ? Key : never
}[keyof Props]

type RequiredStyledContextKeys<Props extends Record<string, any>> = Exclude<
  keyof Props,
  OptionalStyledContextKeys<Props>
>

type FullDefaultValues<Props extends Record<string, any>> = {
  [Key in RequiredStyledContextKeys<Props>]: Props[Key]
} & {
  [Key in OptionalStyledContextKeys<Props>]: Props[Key] | undefined
}

type StyledContextFactory = {
  <
    VariantProps extends Record<string, any>,
    ConsumedKeys extends StyledContextKey<VariantProps>,
  >(
    defaultValues: VariantProps,
    namespaceOrOptions: StyledContextOptions<VariantProps, ConsumedKeys> & {
      keys: readonly ConsumedKeys[]
    }
  ): StyledContext<VariantProps, ConsumedKeys>;
  <VariantProps extends Record<string, any>>(
    defaultValues: EmptyDefault,
    namespaceOrOptions?: EmptyDefaultOptions
  ): StyledContext<VariantProps, never>;
  <VariantProps extends Record<string, any>>(
    defaultValues: VariantProps & FullDefaultValues<VariantProps>,
    namespaceOrOptions?: EmptyDefaultOptions
  ): StyledContext<VariantProps, StyledContextKey<VariantProps>>;
  <
    VariantProps extends Record<string, any>,
    ConsumedKeys extends StyledContextKey<VariantProps>,
  >(
    defaultValues: undefined,
    namespaceOrOptions: StyledContextOptions<VariantProps, ConsumedKeys> & {
      keys: readonly ConsumedKeys[]
    }
  ): StyledContext<VariantProps, ConsumedKeys>;
  <VariantProps extends Record<string, any> = Record<string, any>>(
    defaultValues?: undefined,
    namespaceOrOptions?: string
  ): StyledContext<VariantProps, never>
}

function isPlainObject(value: unknown): value is Record<string, any> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

// use const (not function declaration) to prevent esbuild from hoisting
// above __esm lazy init - function declarations get hoisted before
// import_react is initialized, causing undefined.default errors in SSR
export const createStyledContext = (<VariantProps extends Record<string, any>>(
  defaultValues?: VariantProps,
  namespaceOrOptions:
    | string
    | StyledContextOptions<VariantProps, StyledContextKey<VariantProps>> = ''
): StyledContext<VariantProps, StyledContextKey<VariantProps>> => {
  // avoid react compiler - we aren't breaking its rules but it mis-interprets
  // how we change the context value
  'use no memo'

  // lazy initialization fixes vite ssr hmr - module-level assignments can fail
  // when React is undefined during __esm re-initialization order issues.
  // also React.createContext is optimized oddly by React compiler and our
  // uncommon usage confuses it, so we use dynamic access
  const createReactContext = React[
    Math.random() ? 'createContext' : 'createContext'
  ] as typeof React.createContext
  const useReactMemo = React[
    Math.random() ? 'useMemo' : 'useMemo'
  ] as typeof React.useMemo
  const useReactContext = React[
    Math.random() ? 'useContext' : 'useContext'
  ] as typeof React.useContext

  const namespace =
    typeof namespaceOrOptions === 'string'
      ? namespaceOrOptions
      : namespaceOrOptions.namespace || ''
  const propKeys =
    typeof namespaceOrOptions === 'string'
      ? isPlainObject(defaultValues)
        ? (Object.keys(defaultValues) as StyledContextKey<VariantProps>[])
        : undefined
      : namespaceOrOptions.keys ||
        (isPlainObject(defaultValues)
          ? (Object.keys(defaultValues) as StyledContextKey<VariantProps>[])
          : undefined)

  const OGContext = createReactContext<VariantProps | undefined>(defaultValues)
  const OGProvider = OGContext.Provider
  const Context = OGContext as any as StyledContext<
    VariantProps,
    StyledContextKey<VariantProps>
  >
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
      return mergeProps(defaultValues || {}, values)
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
  Context.propKeys = propKeys
  Context.context = OGContext as Context<VariantProps>
  Context.useStyledContext = useStyledContext

  return Context
}) as StyledContextFactory

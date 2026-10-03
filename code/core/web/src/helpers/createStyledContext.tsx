import type { Context, ReactNode } from 'react'
import React from 'react'
import type { StyledContext, StyledContextOptions } from '../types'
import { isPlainObject } from './isObj'
import { mergeProps } from './mergeProps'
import { objectIdentityKey } from './objectIdentityKey'

type EmptyDefault = Record<PropertyKey, never>
type EmptyDefaultOptions = string | { namespace?: string; keys?: never }
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

export const createStyledContext = (<VariantProps extends Record<string, any>>(
  defaultValues?: VariantProps,
  namespaceOrOptions:
    | string
    | StyledContextOptions<VariantProps, StyledContextKey<VariantProps>> = ''
): StyledContext<VariantProps, StyledContextKey<VariantProps>> => {
  'use no memo'

  const namespace =
    typeof namespaceOrOptions === 'string'
      ? namespaceOrOptions
      : namespaceOrOptions.namespace || ''
  const defaultKeys = isPlainObject(defaultValues)
    ? (Object.keys(defaultValues) as StyledContextKey<VariantProps>[])
    : undefined
  const propKeys =
    typeof namespaceOrOptions === 'object' && namespaceOrOptions.keys
      ? namespaceOrOptions.keys
      : defaultKeys

  const OGContext = React.createContext<VariantProps | undefined>(defaultValues)
  const OGProvider = OGContext.Provider
  const Context = OGContext as any as StyledContext<
    VariantProps,
    StyledContextKey<VariantProps>
  >
  const scopedContexts = new Map<string, Context<VariantProps | undefined>>()
  const LastScopeInNamespace = React.createContext<string>(namespace)

  function getOrCreateScopedContext(scope: string) {
    let ScopedContext = scopedContexts.get(scope)
    if (!ScopedContext) {
      ScopedContext = React.createContext<VariantProps | undefined>(defaultValues)
      scopedContexts.set(scope, ScopedContext)
    }
    return ScopedContext!
  }

  const getNamespacedScope = (scope: string) =>
    namespace ? `${namespace}--${scope}` : scope

  const Provider = ({
    children,
    scope: scopeIn,
    __disableMergeDefaultValues,
    ...values
  }: VariantProps & { children?: ReactNode; scope: string }) => {
    const scope = getNamespacedScope(scopeIn)
    const next = React.useMemo(() => {
      if (__disableMergeDefaultValues) return values
      return mergeProps(defaultValues || {}, values)
    }, [objectIdentityKey(values)])

    const ScopedProvider = scope ? getOrCreateScopedContext(scope).Provider : OGProvider
    return (
      <LastScopeInNamespace.Provider value={scope}>
        <ScopedProvider value={next as VariantProps}>{children}</ScopedProvider>
      </LastScopeInNamespace.Provider>
    )
  }

  const useStyledContext = (scopeIn = '') => {
    const lastScopeInNamespace = React.useContext(LastScopeInNamespace)
    const scope = namespace
      ? scopeIn
        ? getNamespacedScope(scopeIn)
        : lastScopeInNamespace
      : scopeIn
    const context = scope ? getOrCreateScopedContext(scope) : OGContext
    return React.useContext(context!) as VariantProps
  }

  // @ts-expect-error we are overriding default provider
  Context.Provider = Provider
  Context.props = defaultValues
  Context.propKeys = propKeys
  Context.context = OGContext as Context<VariantProps>
  Context.useStyledContext = useStyledContext

  return Context
}) as StyledContextFactory

import React, { createContext, useContext, useMemo } from "react";

import { objectIdentityKey } from "./objectIdentityKey";

export type StyledContext<Props extends Object = any> = Omit<React.Context<Props>, "Provider"> & {
  context: React.Context<Props>;
  props: Object | undefined;
  Provider: React.ProviderExoticComponent<
    Partial<Props | undefined> & {
      children?: React.ReactNode;
      scope?: string;
    }
  >;
  useStyledContext: (scope?: string) => Props;
};

export function createStyledContext<VariantProps extends Record<string, any>>(
  defaultValues?: VariantProps,
): StyledContext<VariantProps> {
  const OGContext = createContext<VariantProps | undefined>(defaultValues);
  const OGProvider = OGContext.Provider;
  const Context = OGContext as any as StyledContext<VariantProps>;
  const scopedContext = new Map<string, React.Context<VariantProps | undefined>>();

  const Provider = ({
    children,
    scope,
    ...values
  }: VariantProps & { children?: React.ReactNode; scope: string }) => {
    const value = useMemo(() => {
      return {
        // this ! is a workaround for ts error
        ...defaultValues!,
        ...values,
      };
    }, [objectIdentityKey(values)]);
    if (scope) {
      const ScopedContext = scopedContext.get(scope);
      if (ScopedContext) {
        return <ScopedContext.Provider value={value}>{children}</ScopedContext.Provider>;
      } else {
        const NewlyCreatedScopedContext = createContext<VariantProps | undefined>(defaultValues);
        scopedContext.set(scope, NewlyCreatedScopedContext);
        return (
          <NewlyCreatedScopedContext.Provider value={value}>
            {children}
          </NewlyCreatedScopedContext.Provider>
        );
      }
    } else {
      return <OGProvider value={value}>{children}</OGProvider>;
    }
  };

  // use consumerComponent just to give a better error message
  const useStyledContext = (scope?: string) => {
    const context = scope ? scopedContext.get(scope) : OGContext;
    return useContext(context!) as VariantProps;
  };

  // @ts-ignore
  Context.Provider = Provider;
  Context.props = defaultValues;
  Context.context = OGContext as React.Context<VariantProps>;
  Context.useStyledContext = useStyledContext;

  return Context;
}

export type Scoped<T> = T & { scope?: string };

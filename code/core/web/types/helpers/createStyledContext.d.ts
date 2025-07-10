import type { Context, ProviderExoticComponent, ReactNode } from 'react';
export type StyledContext<Props extends Object = any> = Context<Props> & {
    context: Context<Props>;
    props: Object | undefined;
    Provider: ProviderExoticComponent<Partial<Props | undefined> & {
        children?: ReactNode;
        scope?: string;
    }>;
    useStyledContext: (scope?: string) => Props;
};
export declare function createStyledContext<VariantProps extends Record<string, any>>(defaultValues?: VariantProps, namespace?: string): StyledContext<VariantProps>;
export type ScopedProps<P, Scopes = string> = P & {
    scope?: Scopes;
};
//# sourceMappingURL=createStyledContext.d.ts.map
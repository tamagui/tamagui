import type { Context, ProviderExoticComponent, ReactNode } from 'react';
export type StyledContext<Props extends Object = any> = Omit<Context<Props>, 'Provider'> & {
    context: Context<Props>;
    props: Object | undefined;
    Provider: ProviderExoticComponent<Partial<Props | undefined> & {
        children?: ReactNode;
        scope?: string;
    }>;
    useStyledContext: (scope?: string) => Props;
};
export declare function createStyledContext<VariantProps extends Record<string, any>>(defaultValues?: VariantProps): StyledContext<VariantProps>;
export type ScopedProps<P, K extends string> = P & {
    [Key in `__scope${K}`]?: string;
};
//# sourceMappingURL=createStyledContext.d.ts.map
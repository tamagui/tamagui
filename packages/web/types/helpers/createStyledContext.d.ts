import React from "react";
export type StyledContext<Props extends Object = any> = Omit<React.Context<Props>, "Provider"> & {
    context: React.Context<Props>;
    props: Object | undefined;
    Provider: React.ProviderExoticComponent<Partial<Props | undefined> & {
        children?: React.ReactNode;
        scope?: string;
    }>;
    useStyledContext: (scope?: string) => Props;
};
export declare function createStyledContext<VariantProps extends Record<string, any>>(defaultValues?: VariantProps): StyledContext<VariantProps>;
export type Scoped<T> = T & {
    scope?: string;
};
//# sourceMappingURL=createStyledContext.d.ts.map
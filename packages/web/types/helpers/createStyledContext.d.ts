import React from 'react';
export type StyledContext<Props extends Object = any> = Omit<React.Context<Props>, 'Provider'> & {
    context: React.Context<Props>;
    props: Object;
    Provider: React.ProviderExoticComponent<Partial<Props> & {
        children?: React.ReactNode;
    }>;
};
export declare function createStyledContext<VariantProps extends Record<string, any>>(props: VariantProps): StyledContext<VariantProps>;
//# sourceMappingURL=createStyledContext.d.ts.map
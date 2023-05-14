import React from 'react';
export type StyledContext<Props extends Object = any> = Omit<React.Context<Props>, 'Provider'> & {
    variants: Object;
    Provider: React.ProviderExoticComponent<Props & {
        children?: React.ReactNode;
    }>;
};
export declare function createStyledContext<VariantProps extends Record<string, any>>(variants: VariantProps): StyledContext<VariantProps>;
//# sourceMappingURL=createStyledContext.d.ts.map
import React from 'react';
export type providerProvider<Props extends Object = any> = React.FunctionComponent<Props & {
    children?: React.ReactNode;
}> & {
    Context: React.Context<any>;
    variants: Object;
};
export declare function createVariantProvider<Variants extends Record<string, any>>(variants: Variants): providerProvider<Variants>;
//# sourceMappingURL=createVariantContext.d.ts.map
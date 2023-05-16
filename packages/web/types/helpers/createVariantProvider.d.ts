import React from 'react';
export type VariantProvider<Props extends Object = any> = React.FunctionComponent<Props & {
    children?: React.ReactNode;
}> & {
    Context: React.Context<any>;
    variants: Object;
};
export declare function createVariantProvider<Variants extends Record<string, any>>(variants: Variants): VariantProvider<Variants>;
//# sourceMappingURL=createVariantProvider.d.ts.map
import React from 'react';
export type VariantContextProvider<Props extends Object = any> = React.FunctionComponent<Props & {
    children?: React.ReactNode;
}> & {
    Context: React.Context<any>;
};
export declare function createVariantContext<Props extends Record<string, any>>(): VariantContextProvider<Props>;
//# sourceMappingURL=createVariantContext.d.ts.map
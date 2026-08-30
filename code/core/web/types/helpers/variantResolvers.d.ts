import type { GetStyleState, TamaguiInternalConfig, VariantResolverName } from '../types';
type CompiledVariantResolver = {
    key: string;
    parts: VariantResolverName[];
};
export declare function getCompiledVariantResolvers(variant: object): readonly CompiledVariantResolver[];
export declare function getVariantDefinition(variant: any, value: any, conf: TamaguiInternalConfig, { theme }: Partial<GetStyleState>): any;
export {};
//# sourceMappingURL=variantResolvers.d.ts.map
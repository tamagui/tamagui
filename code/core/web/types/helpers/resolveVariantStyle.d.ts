import type { GenericFonts, GetStyleState, LanguageContextType, TamaguiInternalConfig, VariantResolverName } from '../types';
type CompiledVariantResolver = {
    key: string;
    parts: VariantResolverName[];
};
export declare function getCompiledVariantResolvers(variant: object): readonly CompiledVariantResolver[];
export declare function getVariantDefinition(variant: any, value: any, conf: TamaguiInternalConfig, { theme }: Partial<GetStyleState>): any;
export declare function getFontsForLanguage(fonts: GenericFonts, language: LanguageContextType): any;
export declare const getVariantExtras: (styleState: GetStyleState) => any;
export declare function resolveVariantStyle(state: GetStyleState, variants: Record<string, any>, key: string, value: any, parentKey?: string, parentCondition?: unknown): void;
export {};
//# sourceMappingURL=resolveVariantStyle.d.ts.map
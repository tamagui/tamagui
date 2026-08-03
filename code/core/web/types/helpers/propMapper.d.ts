import type { DefaultTokenCategory, PropMapper, TamaguiInternalConfig } from '../types';
export declare const propMapper: PropMapper;
export declare function getFontFamilyFromNameOrVariable(input: any, conf: TamaguiInternalConfig): string | undefined;
export declare const defaultTokenCategories: Record<string, DefaultTokenCategory>;
export type RuntimeTokenCategory = DefaultTokenCategory | 'color' | 'font' | 'fontFamily';
export declare function getTokenCategoryForProperty(property: string): RuntimeTokenCategory | undefined;
//# sourceMappingURL=propMapper.d.ts.map
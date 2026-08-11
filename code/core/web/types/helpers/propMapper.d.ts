import type { PropMapper, TamaguiInternalConfig } from '../types'
export declare function appendFlatClause(
  prev: unknown,
  conditionSource: string,
  value: unknown
): string | undefined
export declare const propMapper: PropMapper
export declare function getFontFamilyFromNameOrVariable(
  input: any,
  conf: TamaguiInternalConfig
): string | undefined
export type StyleTokenCategory = 'size' | 'space' | 'radius' | 'zIndex' | 'fontSize'
export declare const tokenCategoryByProperty: Record<string, StyleTokenCategory>
export type RuntimeTokenCategory = StyleTokenCategory | 'color' | 'font' | 'fontFamily'
export declare function getTokenCategoryForProperty(
  property: string
): RuntimeTokenCategory | undefined
//# sourceMappingURL=propMapper.d.ts.map

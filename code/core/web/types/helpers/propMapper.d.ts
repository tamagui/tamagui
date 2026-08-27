import type { GetStyleState, PropMapper, StaticConfig, TamaguiInternalConfig } from '../types';
export declare function appendFlatClause(state: GetStyleState, prev: unknown, conditionSource: string, value: unknown): string | Record<string, any> | undefined;
export declare function getContextPropSet(staticConfig: StaticConfig): Set<string> | null;
export declare const propMapper: PropMapper;
export declare function getFontFamilyFromNameOrVariable(input: any, conf: TamaguiInternalConfig): string | undefined;
export * from './tokenCategories';
//# sourceMappingURL=propMapper.d.ts.map
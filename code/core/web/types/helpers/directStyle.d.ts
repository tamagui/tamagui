import { type ParsedValue } from '@tamagui/style-grammar/runtime';
import type { GetStyleState } from '../types';
export { directStyleSignature, flushDirectStyles } from './directStyleCSS';
export type MergeStyle = (state: GetStyleState, key: string, value: any, importance: number, disableNormalize?: boolean, originalValue?: any) => void;
export declare function resolveClauseChain(state: GetStyleState, source: string, start: number, end: number, property?: string, raw?: any, merge?: MergeStyle, originalValue?: any, contextOnly?: boolean, payloadStart?: number, payloadEnd?: number, warning?: number): number;
export declare function getDirectDynamicThemeAccess(state: GetStyleState): boolean | undefined;
export declare function contributeStyleString(state: GetStyleState, property: string, source: string, merge: MergeStyle, originalValue?: any, contextOnly?: boolean): boolean;
export declare function contributeFrontendValue(state: GetStyleState, property: string, value: ParsedValue, merge: MergeStyle, contextOnly?: boolean): boolean;
export declare function isConditionalStyleObject(state: GetStyleState, value: Record<string, any>, property?: string, merge?: MergeStyle, contextOnly?: boolean): number;
export declare function contributeVariantClauseValue(state: GetStyleState, property: string, value: any, conditionSource: string, merge: MergeStyle, originalValue?: any, contextOnly?: boolean): void;
export declare function contributeStyleValue(state: GetStyleState, property: string, value: any, merge: MergeStyle, originalValue?: any, contextOnly?: boolean): boolean;
export declare function clearDirectStyle(state: GetStyleState, property: string): void;
//# sourceMappingURL=directStyle.d.ts.map
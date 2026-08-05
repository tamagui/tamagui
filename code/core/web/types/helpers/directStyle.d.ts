import type { ParsedValue } from '@tamagui/style-grammar/runtime';
import type { GetStyleState } from '../types';
export type MergeStyle = (state: GetStyleState, key: string, value: any, importance: number, disableNormalize?: boolean, originalValue?: any) => void;
export declare function directStyleSignature(property: string, value: unknown, conditionKey?: string): string;
export declare function flushDirectStyles(state: GetStyleState, clear?: boolean): void;
export declare function getDirectDynamicThemeAccess(state: GetStyleState): boolean | undefined;
export declare function contributeStyleString(state: GetStyleState, property: string, source: string, merge: MergeStyle, originalValue?: any, contextOnly?: boolean): boolean;
export declare function contributeFrontendValue(state: GetStyleState, property: string, value: ParsedValue, merge: MergeStyle, contextOnly?: boolean): boolean;
export declare function contributeStyleValue(state: GetStyleState, property: string, value: any, merge: MergeStyle, originalValue?: any, contextOnly?: boolean): boolean;
export declare function clearDirectStyle(state: GetStyleState, property: string): void;
//# sourceMappingURL=directStyle.d.ts.map
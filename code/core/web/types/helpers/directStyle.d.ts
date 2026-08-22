import { type ClausePrecedenceKey, type ParsedValue } from '@tamagui/style-grammar/runtime';
import type { GetStyleState } from '../types';
export type MergeStyle = (state: GetStyleState, key: string, value: any, importance: number, disableNormalize?: boolean, originalValue?: any) => void;
type Condition = {
    key: string;
    active: boolean;
    emit: boolean;
    selector: string;
    wrappers?: string[];
    enter?: true;
    exit?: true;
    theme?: string;
    precedence: ClausePrecedenceKey;
    classRepetitions: number;
    unsupportedState?: string;
};
export declare function platformMatches(name: string): boolean;
/**
 * Resolve one modifier chain against the live state, or null when the runtime
 * has no such modifier. Exported because the variant scanner in `propMapper`
 * has to refuse exactly the chains this one refuses; two answers to "is this a
 * modifier" is how the prop and variant paths came to disagree about how much
 * of a bad value survives.
 */
export declare function getCondition(state: GetStyleState, source: string): Condition | null;
export declare function directStyleSignature(property: string, value: unknown, conditionKey?: string): string;
export declare function flushDirectStyles(state: GetStyleState, clear?: boolean): void;
export declare function getDirectDynamicThemeAccess(state: GetStyleState): boolean | undefined;
export declare function contributeStyleString(state: GetStyleState, property: string, source: string, merge: MergeStyle, originalValue?: any, contextOnly?: boolean): boolean;
export declare function contributeFrontendValue(state: GetStyleState, property: string, value: ParsedValue, merge: MergeStyle, contextOnly?: boolean): boolean;
export declare function contributeVariantClauseValue(state: GetStyleState, property: string, value: any, conditionSource: string, merge: MergeStyle, originalValue?: any, contextOnly?: boolean): void;
export declare function contributeStyleValue(state: GetStyleState, property: string, value: any, merge: MergeStyle, originalValue?: any, contextOnly?: boolean): boolean;
export declare function clearDirectStyle(state: GetStyleState, property: string): void;
export {};
//# sourceMappingURL=directStyle.d.ts.map
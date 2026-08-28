import type { AllGroupContexts, AnimationDriverLike, ComponentContextI, DebugProp, GetStyleResult, GetStyleState, SplitStyleProps, StaticConfig, TamaguiComponentState, TamaguiInternalConfig, ThemeParsed } from '../types';
import { styleOriginalValues } from './styleOriginalValues';
export { styleOriginalValues };
export { getStyleTokenProvenance, STYLE_TOKEN_PROVENANCE_KEY } from './styleProvenance';
export type { StyleDebugReceipt, StyleDebugTier, StyleTokenBinding, StyleTokenProvenance, } from './styleProvenance';
export type SplitStyles = ReturnType<typeof getSplitStyles>;
export type SplitStyleResult = ReturnType<typeof getSplitStyles>;
export type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfig, theme: ThemeParsed, themeName: string, componentState: TamaguiComponentState, styleProps: SplitStyleProps, parentSplitStyles?: GetStyleResult | null, context?: ComponentContextI, groupContext?: AllGroupContexts | null, elementType?: string, startedUnhydrated?: boolean, debug?: DebugProp, animationDriver?: AnimationDriverLike | null) => null | GetStyleResult;
export declare function isValidStyleKey(key: string, validStyles: Record<string, boolean>, accept?: Record<string, any>): boolean;
export declare const getSplitStyles: StyleSplitter;
export type MergeStyle = (state: GetStyleState, key: string, value: any, importance: number, disableNormalize?: boolean, originalValue?: any) => void;
export declare function platformMatches(name: string): boolean;
export declare function resolveClauseChain(state: GetStyleState, source: string, start: number, end: number, property?: string, raw?: any, merge?: MergeStyle, originalValue?: any, contextOnly?: boolean, payloadStart?: number, payloadEnd?: number, warning?: number, captureCell?: number, parentConditionId?: number): number;
export declare function directStyleSignature(property: string, value: unknown, conditionKey?: string): string;
export declare function flushDirectStyles(state: GetStyleState, clear?: boolean): void;
export declare function getDirectDynamicThemeAccess(state: GetStyleState): boolean | undefined;
export declare function contributeStyleString(state: GetStyleState, property: string, source: string, merge: MergeStyle, originalValue?: any, contextOnly?: boolean): boolean;
export declare function clearDirectStyle(state: GetStyleState, property: string): void;
export declare function getContextPropSet(staticConfig: StaticConfig): Set<string> | null;
export declare function getFontFamilyFromNameOrVariable(input: any, conf: TamaguiInternalConfig): string | undefined;
export * from './tokenCategories';
export declare function prepareStyleStaticConfig(staticConfig: StaticConfig): StaticConfig;
//# sourceMappingURL=getSplitStyles.d.ts.map
import type { AllGroupContexts, AnimationDriverLike, ComponentContextI, DebugProp, GetStyleResult, GetStyleState, SplitStyleProps, StaticConfig, TamaguiComponentState, TamaguiInternalConfig, ThemeParsed } from '../types';
import { getStyleStaticConfig, type StyleStaticConfig } from './styleStaticConfig';
export { getStyleStaticConfig };
import { styleOriginalValues } from './styleOriginalValues';
export { STYLE_TOKEN_PROVENANCE_KEY, getStyleTokenProvenance } from './styleProvenance';
export type { StyleDebugReceipt, StyleDebugTier, StyleTokenBinding, StyleTokenProvenance, } from './styleProvenance';
export { styleOriginalValues };
export type SplitStyles = ReturnType<typeof getSplitStyles>;
export type SplitStyleResult = ReturnType<typeof getSplitStyles>;
export type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfig, theme: ThemeParsed, themeName: string, componentState: TamaguiComponentState, styleProps: SplitStyleProps, parentSplitStyles?: GetStyleResult | null, context?: ComponentContextI, groupContext?: AllGroupContexts | null, elementType?: string, startedUnhydrated?: boolean, debug?: DebugProp, animationDriver?: AnimationDriverLike | null, styleStaticConfig?: StyleStaticConfig) => null | GetStyleResult;
export declare function isValidStyleKey(key: string, validStyles: Record<string, boolean>): boolean;
export declare const getSplitStyles: StyleSplitter;
export type MergeStyle = (state: GetStyleState, key: string, value: any, disableNormalize?: boolean, originalValue?: any) => void;
type ConditionalValueSink = (payload: any, condition: unknown, source: any) => void;
export declare function walkConditionalValue(state: GetStyleState, property: string, value: any, parent: unknown, sink: ConditionalValueSink | null, warnMode?: number, contextOnly?: boolean): boolean;
export declare function emitVariantStyle(state: GetStyleState, key: string, value: any, original: any, condition: unknown, disabled: boolean): void;
export declare function getFontFamilyFromNameOrVariable(input: any, conf: TamaguiInternalConfig): string | undefined;
export * from './tokenCategories';
//# sourceMappingURL=getSplitStyles.d.ts.map
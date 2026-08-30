import type { AllGroupContexts, AnimationDriverLike, ComponentContextI, DebugProp, GetStyleResult, GetStyleState, SplitStyleProps, StaticConfig, TamaguiComponentState, TamaguiInternalConfig, ThemeParsed } from '../types';
import { getStyleStaticConfig, type StyleStaticConfig } from './styleStaticConfig';
export { directStyleSignature, flushDirectStyles } from './directStyleCSS';
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
export declare function isValidStyleKey(key: string, validStyles: Record<string, boolean>, accept?: Record<string, any>): boolean;
export declare const getSplitStyles: StyleSplitter;
export type MergeStyle = (state: GetStyleState, key: string, value: any, importance: number, disableNormalize?: boolean, originalValue?: any) => void;
export declare function getDirectDynamicThemeAccess(state: GetStyleState): boolean | undefined;
export declare function contributeStyleString(state: GetStyleState, property: string, source: string, merge: MergeStyle, originalValue?: any, contextOnly?: boolean): boolean;
export declare function clearDirectStyle(state: GetStyleState, property: string): void;
export declare function getFontFamilyFromNameOrVariable(input: any, conf: TamaguiInternalConfig): string | undefined;
export * from './tokenCategories';
//# sourceMappingURL=getSplitStyles.d.ts.map
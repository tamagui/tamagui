import type { TamaguiComponentState } from '../interfaces/TamaguiComponentState';
import type { ComponentContextI, DebugProp, GetStyleResult, GetStyleState, SplitStyleProps, StaticConfig, TextStyleProps, ThemeParsed } from '../types';
export type SplitStyles = ReturnType<typeof getSplitStyles>;
export type SplitStyleResult = ReturnType<typeof getSplitStyles>;
type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfig, theme: ThemeParsed, themeName: string, componentState: TamaguiComponentState, styleProps: SplitStyleProps, parentSplitStyles?: GetStyleResult | null, context?: ComponentContextI, elementType?: string, debug?: DebugProp, skipThemeTokenResolution?: boolean) => GetStyleResult;
export declare const PROP_SPLIT = "-";
export declare const getSplitStyles: StyleSplitter;
export declare const getSubStyle: (styleState: GetStyleState, subKey: string, styleIn: Object, avoidMergeTransform?: boolean) => TextStyleProps;
export declare const useSplitStyles: StyleSplitter;
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
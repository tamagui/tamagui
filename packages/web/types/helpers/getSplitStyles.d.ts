import type { DebugProp, GetStyleResult, GetStyleState, SplitStyleState, StaticConfigParsed, TextStyleProps, ThemeParsed } from '../types';
import type { LanguageContextType } from '../views/FontLanguage.types';
export type SplitStyles = ReturnType<typeof getSplitStyles>;
export type SplitStyleResult = ReturnType<typeof getSplitStyles>;
type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, themeState: {
    theme: ThemeParsed;
    name: string;
}, state: SplitStyleState, parentSplitStyles?: GetStyleResult | null, languageContext?: LanguageContextType, elementType?: string, debug?: DebugProp) => GetStyleResult;
export declare const PROP_SPLIT = "-";
export declare const getSplitStyles: StyleSplitter;
export declare const getSubStyle: (styleState: GetStyleState, subKey: string, styleIn: Object, avoidDefaultProps?: boolean, avoidMergeTransform?: boolean) => TextStyleProps;
export declare const useSplitStyles: StyleSplitter;
export type FlatTransforms = Record<string, any>;
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
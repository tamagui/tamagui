import type { DebugProp, GetStyleResult, GetStyleState, SplitStyleState, StaticConfig, TextStyleProps, ThemeParsed } from '../types';
import type { LanguageContextType } from '../views/FontLanguage.types';
export type SplitStyles = ReturnType<typeof getSplitStyles>;
export type SplitStyleResult = ReturnType<typeof getSplitStyles>;
type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfig, themeState: {
    theme: ThemeParsed;
    name: string;
}, state: SplitStyleState, parentSplitStyles?: GetStyleResult | null, languageContext?: LanguageContextType, elementType?: string, debug?: DebugProp) => GetStyleResult;
export declare const PROP_SPLIT = "-";
export declare const getSplitStyles: StyleSplitter;
export declare const getSubStyle: (styleState: GetStyleState, subKey: string, styleIn: Object, avoidMergeTransform?: boolean) => TextStyleProps;
export declare const useSplitStyles: StyleSplitter;
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
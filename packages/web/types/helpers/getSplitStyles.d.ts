import type { ClassNamesObject, DebugProp, GetStyleResult, SplitStyleState, StaticConfigParsed, TamaguiInternalConfig, TextStyleProps, ThemeParsed } from '../types';
import type { FontLanguageProps, LanguageContextType } from '../views/FontLanguage.types';
type GetStyleState = {
    style: TextStyleProps;
    usedKeys: Record<string, number>;
    classNames: ClassNamesObject;
    staticConfig: StaticConfigParsed;
    theme: ThemeParsed;
    props: Record<string, any>;
    viewProps: Record<string, any>;
    state: SplitStyleState;
    conf: TamaguiInternalConfig;
    languageContext?: FontLanguageProps;
    avoidDefaultProps?: boolean;
    avoidMergeTransform?: boolean;
};
export type SplitStyles = ReturnType<typeof getSplitStyles>;
export type SplitStyleResult = ReturnType<typeof getSplitStyles>;
type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeParsed, state: SplitStyleState, parentSplitStyles?: GetStyleResult | null, languageContext?: LanguageContextType, elementType?: string, debug?: DebugProp) => GetStyleResult;
export declare const PROP_SPLIT = "-";
export declare const getSplitStyles: StyleSplitter;
export declare const getSubStyle: (styleState: GetStyleState, subKey: string, styleIn: Object, fontFamily?: string, avoidDefaultProps?: boolean, avoidMergeTransform?: boolean) => TextStyleProps;
export declare const useSplitStyles: StyleSplitter;
export type FlatTransforms = Record<string, any>;
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
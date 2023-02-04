import type { ViewStyle } from 'react-native';
import type { ClassNamesObject, DebugProp, GetStyleResult, SplitStyleState, StaticConfigParsed, TamaguiInternalConfig, ThemeParsed } from '../types';
import { FontLanguageProps, LanguageContextType } from '../views/FontLanguage.types';
import { FlatTransforms } from './mergeTransform';
type GetStyleState = {
    style: ViewStyle;
    usedKeys: Record<string, number>;
    classNames: ClassNamesObject;
    flatTransforms: FlatTransforms;
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
export declare const getSubStyle: (styleState: GetStyleState, subKey: string, styleIn: Object, avoidDefaultProps?: boolean, avoidMergeTransform?: boolean) => ViewStyle;
export declare const insertSplitStyles: StyleSplitter;
export declare const useSplitStyles: StyleSplitter;
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
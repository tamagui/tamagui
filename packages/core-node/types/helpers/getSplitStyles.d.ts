import type { ViewStyle } from 'react-native';
import type { DebugProp, MediaQueryKey, PseudoStyles, SplitStyleState, StackProps, StaticConfigParsed, TamaguiInternalConfig, ThemeParsed } from '../types';
import { FontLanguageProps, LanguageContextType } from '../views/FontLanguage.types';
import { RulesToInsert } from './insertStyleRule';
export declare type SplitStyles = ReturnType<typeof getSplitStyles>;
export declare type ClassNamesObject = Record<string, string>;
export declare type SplitStyleResult = ReturnType<typeof getSplitStyles>;
declare type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeParsed, state: SplitStyleState, defaultClassNames?: any, languageContext?: LanguageContextType, debug?: DebugProp) => {
    pseudos: PseudoStyles;
    medias: Record<MediaQueryKey, ViewStyle>;
    style: ViewStyle;
    classNames: ClassNamesObject;
    rulesToInsert: RulesToInsert;
    viewProps: StackProps;
    fontFamily: string | undefined;
    mediaKeys: string[];
};
export declare const PROP_SPLIT = "-";
export declare const pseudoCNInverse: {
    hover: string;
    focus: string;
    press: string;
};
export declare const getSplitStyles: StyleSplitter;
export declare const getSubStyle: (subKey: string, styleIn: Object, staticConfig: StaticConfigParsed, theme: ThemeParsed, props: any, state: SplitStyleState, conf: TamaguiInternalConfig, languageContext?: FontLanguageProps, avoidDefaultProps?: boolean) => ViewStyle;
export declare const insertSplitStyles: StyleSplitter;
export declare const useSplitStyles: StyleSplitter;
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
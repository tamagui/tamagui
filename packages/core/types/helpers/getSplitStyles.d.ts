import { ViewStyle } from 'react-native';
import type { DebugProp, MediaKeys, PseudoStyles, SplitStyleState, StackProps, StaticConfigParsed, TamaguiInternalConfig, ThemeObject } from '../types';
import { FontLanguageProps, LanguageContextType } from '../views/FontLanguage.types';
import { RulesToInsert } from './insertStyleRule';
export declare type SplitStyles = ReturnType<typeof getSplitStyles>;
export declare type ClassNamesObject = Record<string, string>;
export declare type SplitStyleResult = ReturnType<typeof getSplitStyles>;
declare type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeObject, state: SplitStyleState, defaultClassNames?: any, languageContext?: LanguageContextType, debug?: DebugProp) => {
    pseudos: PseudoStyles;
    medias: Record<MediaKeys, ViewStyle>;
    style: ViewStyle;
    classNames: ClassNamesObject;
    rulesToInsert: RulesToInsert;
    viewProps: StackProps;
};
export declare const PROP_SPLIT = "-";
export declare const pseudoCNInverse: {
    hover: string;
    focus: string;
    press: string;
};
export declare const getSplitStyles: StyleSplitter;
export declare const getSubStyle: (subKey: string, styleIn: Object, staticConfig: StaticConfigParsed, theme: ThemeObject, props: any, state: SplitStyleState, conf: TamaguiInternalConfig, languageContext?: FontLanguageProps, avoidDefaultProps?: boolean) => ViewStyle;
export declare const insertSplitStyles: StyleSplitter;
export declare const useSplitStyles: StyleSplitter;
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
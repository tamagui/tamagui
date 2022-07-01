import { ViewStyle } from 'react-native';
import { DebugProp, MediaKeys, PseudoStyles, SplitStyleState, StackProps, StaticConfigParsed, ThemeObject } from '../types';
export declare type SplitStyles = ReturnType<typeof getSplitStyles>;
export declare type ClassNamesObject = Record<string, string>;
export declare type SplitStyleResult = ReturnType<typeof getSplitStyles>;
declare type StyleSplitter = (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeObject, state: SplitStyleState, defaultClassNames?: any, debug?: DebugProp) => {
    pseudos: PseudoStyles;
    medias: Record<MediaKeys, ViewStyle>;
    style: ViewStyle;
    classNames: ClassNamesObject;
    rulesToInsert: [string, string][] | null;
    viewProps: StackProps;
};
export declare const PROP_SPLIT = "-";
export declare const pseudoCNInverse: {
    hover: string;
    focus: string;
    press: string;
};
export declare const getSplitStyles: StyleSplitter;
export declare const insertSplitStyles: StyleSplitter;
export declare const useSplitStyles: StyleSplitter;
export declare const getSubStyle: (styleIn: Object, staticConfig: StaticConfigParsed, theme: ThemeObject, props: any, state: SplitStyleState, avoidDefaultProps?: boolean) => ViewStyle;
export declare function normalizeStyleObject(style: any): void;
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
import { ViewStyle } from 'react-native';
import { PseudoStyles, SplitStyleState, StackProps, StaticConfigParsed, ThemeObject } from '../types';
export declare type SplitStyles = ReturnType<typeof getSplitStyles>;
export declare type ClassNamesObject = Record<string, string>;
export declare type SplitStyleResult = ReturnType<typeof getSplitStyles>;
export declare const getSplitStyles: (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeObject, state: SplitStyleState & {
    keepVariantsAsProps?: boolean;
}, defaultClassNames?: any) => {
    viewProps: StackProps;
    style: ViewStyle;
    medias: Record<string, ViewStyle>;
    pseudos: PseudoStyles;
    classNames: ClassNamesObject;
};
export declare const getSubStyle: (styleIn: Object, staticConfig: StaticConfigParsed, theme: ThemeObject, props: any, state: SplitStyleState, avoidDefaultProps?: boolean | undefined) => ViewStyle;
export declare function normalizeStyleObject(style: any): void;
//# sourceMappingURL=getSplitStyles.d.ts.map
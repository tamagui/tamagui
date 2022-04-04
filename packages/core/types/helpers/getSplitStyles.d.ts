import { ViewStyle } from 'react-native';
import { StackProps, StaticConfigParsed, ThemeObject } from '../types';
export declare type SplitStyles = ReturnType<typeof getSplitStyles>;
declare type PseudoStyles = {
    hoverStyle?: ViewStyle;
    pressStyle?: ViewStyle;
    focusStyle?: ViewStyle;
    exitStyle?: ViewStyle;
};
export declare type SplitStyleResult = ReturnType<typeof getSplitStyles>;
export declare const getSplitStyles: (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeObject) => {
    viewProps: StackProps;
    style: (ViewStyle | null)[];
    pseudos: PseudoStyles | null;
    classNames: string[] | null;
};
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
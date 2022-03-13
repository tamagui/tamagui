import { ViewStyle } from 'react-native';
import { StackProps, StaticConfigParsed, ThemeObject } from '../types';
export declare type SplitStyles = ReturnType<typeof getSplitStyles>;
declare type PseudoStyles = {
    hoverStyle?: ViewStyle;
    pressStyle?: ViewStyle;
    focusStyle?: ViewStyle;
};
export declare const getSplitStyles: (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeObject) => {
    viewProps: StackProps;
    style: any[];
    pseudos: PseudoStyles | null;
    classNames: string[] | null;
};
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
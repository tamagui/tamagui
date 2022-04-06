import { ViewStyle } from 'react-native';
import { StackProps, StaticConfigParsed, ThemeObject } from '../types';
import { ResolveVariableTypes } from './createPropMapper';
export declare type SplitStyles = ReturnType<typeof getSplitStyles>;
declare type PseudoStyles = {
    hoverStyle?: ViewStyle;
    pressStyle?: ViewStyle;
    focusStyle?: ViewStyle;
    exitStyle?: ViewStyle;
    enterStyle?: ViewStyle;
};
export declare type SplitStyleResult = ReturnType<typeof getSplitStyles>;
export declare const getSplitStyles: (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeObject, isMounted?: boolean, resolveVariablesAs?: ResolveVariableTypes | undefined) => {
    viewProps: StackProps;
    style: ViewStyle;
    pseudos: PseudoStyles | null;
    classNames: string[] | null;
};
export {};
//# sourceMappingURL=getSplitStyles.d.ts.map
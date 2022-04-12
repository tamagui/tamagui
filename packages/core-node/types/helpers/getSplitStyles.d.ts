import { ViewStyle } from 'react-native';
import { ComponentState } from '../defaultComponentState';
import { StackProps, StaticConfigParsed, ThemeObject } from '../types';
import { ResolveVariableTypes } from './createPropMapper';
export declare type SplitStyles = ReturnType<typeof getSplitStyles>;
export declare type PseudoStyles = {
    hoverStyle?: ViewStyle;
    pressStyle?: ViewStyle;
    focusStyle?: ViewStyle;
    enterStyle?: ViewStyle;
    exitStyle?: ViewStyle;
};
export declare type ClassNamesObject = Record<string, string>;
export declare type SplitStyleResult = ReturnType<typeof getSplitStyles>;
export declare const getSplitStyles: (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeObject, state: Partial<ComponentState> & {
    noClassNames?: boolean;
    resolveVariablesAs?: ResolveVariableTypes;
}, defaultClassNames?: ClassNamesObject | null | undefined) => {
    viewProps: StackProps;
    style: ViewStyle;
    medias: Record<string, ViewStyle>;
    pseudos: PseudoStyles;
    classNames: ClassNamesObject;
};
//# sourceMappingURL=getSplitStyles.d.ts.map
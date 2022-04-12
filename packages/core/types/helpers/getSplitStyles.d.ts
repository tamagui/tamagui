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
export declare type SplitStyleResult = ReturnType<typeof getSplitStyles>;
export declare const getSplitStyles: (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeObject, state: Partial<ComponentState>, resolveVariablesAs?: ResolveVariableTypes | undefined) => {
    viewProps: StackProps;
    style: ViewStyle;
    medias: {
        [x: string]: ViewStyle;
    };
    pseudos: PseudoStyles;
    classNames: string[] | null;
};
//# sourceMappingURL=getSplitStyles.d.ts.map
import { ViewStyle } from 'react-native';
import { StaticConfigParsed, ThemeObject } from '../types';
export declare type SplitStyles = ReturnType<typeof getSplitStyles>;
export declare const getSplitStyles: (props: {
    [key: string]: any;
}, staticConfig: StaticConfigParsed, theme: ThemeObject, isSplittingDefaultProps?: boolean | undefined) => {
    viewProps: Record<string, any>;
    style: any[];
    pseudos: {
        hoverStyle?: ViewStyle | undefined;
        pressStyle?: ViewStyle | undefined;
    } | null;
    classNames: string[] | null;
};
//# sourceMappingURL=getSplitStyles.d.ts.map
import { StyleObject } from '@tamagui/helpers';
import { ViewStyle } from 'react-native';
export declare type ViewStyleWithPseudos = ViewStyle & {
    hoverStyle?: ViewStyle;
    pressStyle?: ViewStyle;
    focusStyle?: ViewStyle;
};
export declare const pseudos: {
    hoverStyle: {
        name: string;
        priority: number;
    };
    pressStyle: {
        name: string;
        priority: number;
    };
    focusStyle: {
        name: string;
        priority: number;
    };
};
export declare function getStylesAtomic(stylesIn: ViewStyleWithPseudos, avoidCollection?: boolean): StyleObject[];
//# sourceMappingURL=getStylesAtomic.d.ts.map
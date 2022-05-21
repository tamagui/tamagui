import { StyleObject } from '@tamagui/helpers';
import { ViewStyle } from 'react-native';
export declare type ViewStyleWithPseudos = ViewStyle & {
    hoverStyle?: ViewStyle;
    pressStyle?: ViewStyle;
    focusStyle?: ViewStyle;
};
declare type AtomicStyleOptions = {
    splitTransforms?: boolean;
};
export declare const pseudos: {
    readonly hoverStyle: {
        readonly name: "hover";
        readonly priority: 1;
    };
    readonly pressStyle: {
        readonly name: "active";
        readonly priority: 2;
    };
    readonly focusStyle: {
        readonly name: "focus";
        readonly priority: 3;
    };
};
export declare function getStylesAtomic(stylesIn: ViewStyleWithPseudos, options?: AtomicStyleOptions): StyleObject[];
export declare const mergeTransform: (obj: ViewStyle, key: string, val: any, backwards?: boolean) => void;
export {};
//# sourceMappingURL=getStylesAtomic.d.ts.map
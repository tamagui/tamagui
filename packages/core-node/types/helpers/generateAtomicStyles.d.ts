import { StyleObject } from '@tamagui/helpers';
import { TextStyle, ViewStyle } from 'react-native';
import { PseudoDescriptor } from './pseudoDescriptors';
declare type Value = Object | Array<any> | string | number;
export declare type Style = {
    [key: string]: Value;
};
export declare const generateAtomicStyles: (style: ViewStyle & TextStyle, pseudo?: PseudoDescriptor) => StyleObject[];
export declare function expandStyles(style: any): Record<string, any>;
export declare const colorProps: {
    backgroundColor: boolean;
    borderColor: boolean;
    borderTopColor: boolean;
    borderRightColor: boolean;
    borderBottomColor: boolean;
    borderLeftColor: boolean;
    color: boolean;
    shadowColor: boolean;
    textDecorationColor: boolean;
    textShadowColor: boolean;
};
export {};
//# sourceMappingURL=generateAtomicStyles.d.ts.map
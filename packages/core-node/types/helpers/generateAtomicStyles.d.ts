import { StyleObject } from '@tamagui/helpers';
import { TextStyle, ViewStyle } from 'react-native';
import { PseudoDescriptor } from './pseudoDescriptors';
declare type Value = Object | Array<any> | string | number;
export declare type Style = {
    [key: string]: Value;
};
export declare const generateAtomicStyles: (style: ViewStyle & TextStyle, pseudo?: PseudoDescriptor) => StyleObject[];
export declare function expandStyles(style: any): {};
export declare function expandStyle(key: string, value: any): any;
export {};
//# sourceMappingURL=generateAtomicStyles.d.ts.map
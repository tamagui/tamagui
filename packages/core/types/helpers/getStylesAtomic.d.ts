import { StyleObject } from '@tamagui/helpers';
import { TextStyle, ViewStyle } from 'react-native';
import { PseudoDescriptor } from './pseudoDescriptors';
declare type ViewOrTextStyle = ViewStyle | TextStyle;
export declare type ViewStyleWithPseudos = ViewOrTextStyle & {
    hoverStyle?: ViewOrTextStyle;
    pressStyle?: ViewOrTextStyle;
    focusStyle?: ViewOrTextStyle;
};
export declare function getStylesAtomic(stylesIn: ViewStyleWithPseudos): StyleObject[];
export declare function getAtomicStyle(style: ViewOrTextStyle, pseudo?: PseudoDescriptor): StyleObject[];
export declare function styleToCSS(style: Record<string, any>): void;
declare type Value = Object | Array<any> | string | number;
export declare type Style = {
    [key: string]: Value;
};
export {};
//# sourceMappingURL=getStylesAtomic.d.ts.map
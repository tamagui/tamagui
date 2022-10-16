/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */
import { StyleObject } from '@tamagui/helpers';
import type { TextStyle, ViewStyle } from '@tamagui/types-react-native';
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
export {};
//# sourceMappingURL=getStylesAtomic.d.ts.map
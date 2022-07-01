import { StyleObject } from '@tamagui/helpers';
import { ViewStyle } from 'react-native';
import { PseudoDescriptor } from './pseudoDescriptors';
export declare type ViewStyleWithPseudos = ViewStyle & {
    hoverStyle?: ViewStyle;
    pressStyle?: ViewStyle;
    focusStyle?: ViewStyle;
};
export declare function getStylesAtomic(stylesIn: ViewStyleWithPseudos): StyleObject[];
export declare function getAtomicStyle(style: ViewStyle, pseudo?: PseudoDescriptor): StyleObject[];
//# sourceMappingURL=getStylesAtomic.d.ts.map
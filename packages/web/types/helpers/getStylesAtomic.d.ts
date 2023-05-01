/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */
import { StyleObject } from '@tamagui/helpers';
import type { ViewStyleWithPseudos } from '../types';
import { PseudoDescriptor } from './pseudoDescriptors';
export declare function getStylesAtomic(stylesIn: ViewStyleWithPseudos): StyleObject[];
export declare const generateAtomicStyles: (styleIn: ViewStyleWithPseudos, pseudo?: PseudoDescriptor) => StyleObject[];
export declare function styleToCSS(style: Record<string, any>): void;
//# sourceMappingURL=getStylesAtomic.d.ts.map
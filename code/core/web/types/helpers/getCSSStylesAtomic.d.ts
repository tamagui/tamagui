/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */
import type { StyleObject } from '@tamagui/helpers';
import { type StyleCompat } from '../config';
import type { ViewStyleWithPseudos } from '../types';
import type { PseudoDescriptor } from './pseudoDescriptors';
export declare function getCSSStylesAtomic(style: ViewStyleWithPseudos, styleCompat?: StyleCompat): StyleObject[];
export declare const getStyleAtomic: (style: ViewStyleWithPseudos, pseudo?: PseudoDescriptor, styleCompat?: StyleCompat) => StyleObject[];
export declare function styleToCSS(style: Record<string, any>, styleCompat?: StyleCompat): void;
//# sourceMappingURL=getCSSStylesAtomic.d.ts.map
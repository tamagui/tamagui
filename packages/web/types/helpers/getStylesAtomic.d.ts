/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */
import { StyleObject } from '@tamagui/helpers';
import type { DebugProp, ViewStyleWithPseudos } from '../types';
import { PseudoDescriptor } from './pseudoDescriptors';
export declare function getStylesAtomic(stylesIn: ViewStyleWithPseudos, debug?: DebugProp): StyleObject[];
export declare function transformsToString(transforms: any[]): string;
export declare const generateAtomicStyles: (style: ViewStyleWithPseudos, pseudo?: PseudoDescriptor) => StyleObject[];
export declare function styleToCSS(style: Record<string, any>): void;
//# sourceMappingURL=getStylesAtomic.d.ts.map
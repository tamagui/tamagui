/**
 * Some parts adapted from react-native-web
 * Copyright (c) Nicolas Gallagher licensed under the MIT license.
 */
import type { StyleObject } from '@tamagui/helpers';
import type { ViewStyleObject } from '../types';
export declare function getCSSStylesAtomic(style: ViewStyleObject): StyleObject[];
export declare function getCSSStyleAtomic(key: string, val: any, condition?: string, wrappers?: readonly string[], identity?: string, direct?: boolean, identityKey?: string): StyleObject | undefined;
export declare function styleToCSS(style: Record<string, any>): void;
//# sourceMappingURL=getCSSStylesAtomic.d.ts.map
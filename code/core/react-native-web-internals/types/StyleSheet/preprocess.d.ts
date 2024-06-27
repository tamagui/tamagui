/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
export declare const createBoxShadowValue: (style: Object) => void | string;
export declare const createTextShadowValue: (style: Object) => void | string;
/**
 * Preprocess styles
 */
export declare const preprocess: <T extends { [K in string]: any; }>(originalStyle: T) => T;
export declare const processStyle: <T extends { [K in string]: any; }>(originalStyle: T) => T;
//# sourceMappingURL=preprocess.d.ts.map
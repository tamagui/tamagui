/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */
import type { OrderedCSSStyleSheet } from './createOrderedCSSStyleSheet';
type Sheet = {
    id: string;
} & OrderedCSSStyleSheet;
export declare function createSheet(root?: HTMLElement, id?: string): Sheet;
export {};
//# sourceMappingURL=index.d.ts.map
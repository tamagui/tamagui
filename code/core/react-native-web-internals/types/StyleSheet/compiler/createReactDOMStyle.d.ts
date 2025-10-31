/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
type Style = {
    [K in string]: any;
};
export declare const createTransformValue: (style: Style) => string;
/**
 * Reducer
 */
export declare const createReactDOMStyle: (style: Style, isInline?: boolean) => Style;
export {};
//# sourceMappingURL=createReactDOMStyle.d.ts.map
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
export declare type ColorValue = null | string;
export declare type DimensionValue = null | number | string;
export declare type EdgeInsetsValue = {
    top: number;
    left: number;
    right: number;
    bottom: number;
};
export declare type GenericStyleProp<T> = null | void | T | false | '' | ReadonlyArray<GenericStyleProp<T>>;
export declare type LayoutValue = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export declare type LayoutEvent = {
    nativeEvent: {
        layout: LayoutValue;
        target: any;
    };
    timeStamp: number;
};
export declare type PointValue = {
    x: number;
    y: number;
};
declare type LayoutCallback = (x: number, y: number, width: number, height: number, left: number, top: number) => void;
declare type MeasureInWindowCallback = (left: number, top: number, width: number, height: number) => void;
export interface PlatformMethods {
    blur: () => void;
    focus: () => void;
    measure: (callback: LayoutCallback) => void;
    measureInWindow: (callback: MeasureInWindowCallback) => void;
    measureLayout: (relativeToNativeNode: {}, onSuccess: LayoutCallback, onFail: () => void) => void;
    setNativeProps: (nativeProps: {}) => void;
}
export {};
//# sourceMappingURL=types.d.ts.map
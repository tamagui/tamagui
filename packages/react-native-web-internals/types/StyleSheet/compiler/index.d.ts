/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */
declare type Value = Object | Array<any> | string | number;
declare type Style = {
    [K in string]: Value;
};
declare type Rule = string;
declare type Rules = Array<Rule>;
declare type RulesData = [Rules, number];
declare type CompiledStyle = {
    [K in string]: string | Array<string>;
};
declare type CompilerOutput = [CompiledStyle, Array<RulesData>];
export declare function atomic(style: Style): CompilerOutput;
/**
 * Compile simple style object to classic CSS rules.
 * No support for 'placeholderTextColor', 'scrollbarWidth', or 'pointerEvents'.
 */
export declare function classic(style: Style, name: string): CompilerOutput;
/**
 * Compile simple style object to inline DOM styles.
 * No support for 'animationKeyframes', 'placeholderTextColor', 'scrollbarWidth', or 'pointerEvents'.
 */
export declare function inline(originalStyle: Style, isRTL?: boolean): {
    [K in string]: unknown;
};
/**
 * Create a value string that normalizes different input values with a common
 * output.
 */
export declare function stringifyValueWithProperty(value: Value, property: string | null): string;
export {};
//# sourceMappingURL=index.d.ts.map
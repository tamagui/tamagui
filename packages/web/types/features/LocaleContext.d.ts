/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
/// <reference types="react" />
type Locale = string;
type WritingDirection = 'ltr' | 'rtl';
type LocaleValue = {
    direction?: WritingDirection;
    locale?: Locale;
};
export declare const LocaleContext: import("react").Context<LocaleValue>;
export declare function getLocaleDirection(locale: Locale): WritingDirection;
export declare function wrapWithLocaleProvider(locale?: Locale, direction?: WritingDirection, children?: any): any;
declare let CurrentLocaleContextProvider: import("react").Provider<LocaleValue>;
/**
 * Internal use only - for `core` to use the react-native-web provider, overriding the pure web version
 */
export declare function setLocaleContextProvider(next: typeof CurrentLocaleContextProvider): void;
export declare function useLocaleContext(): LocaleValue;
export {};
//# sourceMappingURL=LocaleContext.d.ts.map
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
type ProviderProps = LocaleValue & {
    children: any;
};
type IsLocaleRTL = (locale: string) => boolean;
export declare let LocaleContext: import("react").Context<LocaleValue>;
export declare function getLocaleDirection(locale: Locale): WritingDirection;
export declare function LocalProvider({ locale, direction, children }: ProviderProps): JSX.Element;
export declare function useLocaleContext(): LocaleValue;
/**
 * Determine the writing direction of a locale
 */
export declare let isLocaleRTL: IsLocaleRTL;
export {};
//# sourceMappingURL=locale.d.ts.map
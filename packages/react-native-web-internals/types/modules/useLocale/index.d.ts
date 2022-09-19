/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
declare type Locale = string;
declare type WritingDirection = 'ltr' | 'rtl';
declare type LocaleValue = {
    direction: WritingDirection;
    locale: Locale | null;
};
declare type ProviderProps = {
    children: any;
} & LocaleValue;
export declare function getLocaleDirection(locale: Locale): WritingDirection;
export declare function LocaleProvider(props: ProviderProps): any;
export declare function useLocaleContext(): LocaleValue;
export {};
//# sourceMappingURL=index.d.ts.map
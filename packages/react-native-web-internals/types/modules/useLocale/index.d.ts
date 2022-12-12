/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
type Locale = string;
type WritingDirection = 'ltr' | 'rtl';
type LocaleValue = {
    direction: WritingDirection;
    locale: Locale | null;
};
type ProviderProps = {
    children: any;
} & LocaleValue;
export declare function getLocaleDirection(locale: Locale): WritingDirection;
export declare function LocaleProvider(props: ProviderProps): any;
export declare function useLocaleContext(): LocaleValue;
export {};
//# sourceMappingURL=index.d.ts.map
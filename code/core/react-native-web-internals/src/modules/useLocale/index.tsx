import React from "react"; /**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */




import { isLocaleRTL } from './isLocaleRTL';

type Locale = string;
type WritingDirection = 'ltr' | 'rtl';

type LocaleValue = {
  // Locale writing direction.
  direction: WritingDirection;
  // Locale BCP47 language code: https://www.ietf.org/rfc/bcp/bcp47.txt
  locale: Locale | null;
};

type ProviderProps = {
  children: any;
} & LocaleValue;

const defaultLocale = {
  direction: 'ltr',
  locale: 'en-US'
};

const LocaleContext = React.createContext<LocaleValue>((defaultLocale as any));

export function getLocaleDirection(locale: Locale): WritingDirection {
  return isLocaleRTL(locale) ? 'rtl' : 'ltr';
}

export function LocaleProvider(props: ProviderProps) {
  const { direction, locale, children } = props;
  const needsContext = direction || locale;

  return needsContext ?
  <LocaleContext.Provider
    value={{
      direction: locale ? getLocaleDirection(locale) : direction,
      locale
    }}>

      {children}
    </LocaleContext.Provider> :

  children;

}

export function useLocaleContext(): LocaleValue {
  return React.useContext(LocaleContext);
}
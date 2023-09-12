/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, useContext, useMemo } from 'react'

type Locale = string
type WritingDirection = 'ltr' | 'rtl'
type LocaleValue = {
  // Locale writing direction.
  direction?: WritingDirection
  // Locale BCP47 language code: https://www.ietf.org/rfc/bcp/bcp47.txt
  locale?: Locale
}

type ProviderProps = LocaleValue & {
  children: any
}

type IsLocaleRTL = (locale: string) => boolean

const defaultLocale = {
  direction: 'ltr',
  locale: 'en-US',
} satisfies LocaleValue

export let LocaleContext = createContext<LocaleValue>(defaultLocale)

// /**
//  * Internal use only - for `core` to use the react-native-web provider, overriding the pure web version
//  */

// instead of doing this, we can just grab a rnw View and do <View lang=""> in LocalProvider + do rnw.useLocaleContext() in our useLocaleContext

// export function setupReactNativeWeb(
//   context: typeof LocaleContext,
//   isRTL: IsLocaleRTL
// ) {
//   LocaleContext = context
//   isLocaleRTL = isRTL
// }

export function getLocaleDirection(locale: Locale): WritingDirection {
  return isLocaleRTL(locale) ? 'rtl' : 'ltr'
}

export function LocalProvider({ locale, direction, children }: ProviderProps) {
  const value = useMemo(
    () => ({
      direction: locale ? getLocaleDirection(locale) : direction,
      locale,
    }),
    [direction, locale]
  )
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocaleContext(): LocaleValue {
  return useContext(LocaleContext)
}

/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const rtlScripts = new Set([
  'Arab',
  'Syrc',
  'Samr',
  'Mand',
  'Thaa',
  'Mend',
  'Nkoo',
  'Adlm',
  'Rohg',
  'Hebr',
])

const rtlLangs = new Set([
  'ae', // Avestan
  'ar', // Arabic
  'arc', // Aramaic
  'bcc', // Southern Balochi
  'bqi', // Bakthiari
  'ckb', // Sorani
  'dv', // Dhivehi
  'fa',
  'far', // Persian
  'glk', // Gilaki
  'he',
  'iw', // Hebrew
  'khw', // Khowar
  'ks', // Kashmiri
  'ku', // Kurdish
  'mzn', // Mazanderani
  'nqo', // N'Ko
  'pnb', // Western Punjabi
  'ps', // Pashto
  'sd', // Sindhi
  'ug', // Uyghur
  'ur', // Urdu
  'yi', // Yiddish
])

const cache = new Map()

/**
 * Determine the writing direction of a locale
 */
export let isLocaleRTL: IsLocaleRTL

isLocaleRTL = (locale: string): boolean => {
  if (cache.has(locale)) {
    return cache.get(locale)
  }
  let isRTL = false
  if (Intl.Locale) {
    const script = new Intl.Locale(locale).maximize().script
    isRTL = rtlScripts.has(script!)
  } else {
    // Fallback to inferring from language
    const lang = locale.split('-')[0]
    isRTL = rtlLangs.has(lang)
  }
  cache.set(locale, isRTL)
  return isRTL
}

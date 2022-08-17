import type { CountryCode, LanguageCode } from './types'

/**
 * Calculates locale based on provided language and countryCode
 * 1. If language is extended with region, then hyphenate and use as locale
 * 2. Else merge language and countryCode
 */
export function getLocale(language?: `${LanguageCode}`, countryCode?: `${CountryCode}`) {
  if (!language || !countryCode) {
    return ''
  }

  if (isLanguageExtended(language)) {
    return hyphenateLanguage(language)
  }
  return `${language}-${countryCode}`
}

function hyphenateLanguage(str: `${LanguageCode}`) {
  return str.replace('_', '-')
}

function isLanguageExtended(str?: `${LanguageCode}`) {
  if (!str) return false
  return str.includes('_') || str.includes('-')
}

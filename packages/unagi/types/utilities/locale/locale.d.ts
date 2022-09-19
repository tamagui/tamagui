import type { CountryCode, LanguageCode } from './types';
/**
 * Calculates locale based on provided language and countryCode
 * 1. If language is extended with region, then hyphenate and use as locale
 * 2. Else merge language and countryCode
 */
export declare function getLocale(language?: `${LanguageCode}`, countryCode?: `${CountryCode}`): string;
//# sourceMappingURL=locale.d.ts.map
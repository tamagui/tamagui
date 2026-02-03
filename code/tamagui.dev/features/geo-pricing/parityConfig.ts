/**
 * Purchasing Power Parity (PPP) pricing configuration
 *
 * Uses Cloudflare's CF-IPCountry header for geo detection.
 * Discounts stack with other promos (like beta discount).
 *
 * Tiers based on BigMac Index / PPP ratios:
 * - 40%: Very low purchasing power (ratio < 0.5)
 * - 30%: Low purchasing power (ratio 0.5-0.6)
 * - 25%: Medium-low purchasing power (ratio 0.6-0.7)
 * - 15%: Medium purchasing power (ratio 0.7-0.8)
 * - 0%: High purchasing power (US, UK, etc)
 */

export type ParityTier = {
  discount: number
  countries: string[] // ISO 3166-1 alpha-2 codes
}

// 40% off - very low purchasing power
const TIER_40: ParityTier = {
  discount: 40,
  countries: [
    'IN', // India
    'PK', // Pakistan
    'BD', // Bangladesh
    'NG', // Nigeria
    'EG', // Egypt
    'VN', // Vietnam
    'PH', // Philippines
    'ID', // Indonesia
    'UA', // Ukraine
    'KE', // Kenya
    'GH', // Ghana
    'TZ', // Tanzania
    'UG', // Uganda
    'NP', // Nepal
    'LK', // Sri Lanka
    'MM', // Myanmar
    'KH', // Cambodia
    'ET', // Ethiopia
    'ZM', // Zambia
    'ZW', // Zimbabwe
  ],
}

// 30% off - low purchasing power (from your screenshot 0.5-0.6)
const TIER_30: ParityTier = {
  discount: 30,
  countries: [
    'GR', // Greece
    'TT', // Trinidad and Tobago
    'AR', // Argentina
    'BR', // Brazil
    'CL', // Chile
    'CO', // Colombia
    'PE', // Peru
    'EC', // Ecuador
    'GY', // Guyana
    'IQ', // Iraq
    'JM', // Jamaica
    'KZ', // Kazakhstan
    'LT', // Lithuania
    'GA', // Gabon
    'RW', // Rwanda
    'BJ', // Benin
    'LV', // Latvia
    'GF', // French Guiana
    'ST', // Sao Tome
    'VC', // St Vincent
    'MX', // Mexico
    'SA', // Saudi Arabia
    'SI', // Slovenia
    'SK', // Slovakia
    'BY', // Belarus
    'TL', // Timor-Leste
    'AO', // Angola
    'CZ', // Czech Republic
    'PR', // Puerto Rico
    'RU', // Russia
    'TR', // Turkey
    'ZA', // South Africa
  ],
}

// 25% off - medium-low purchasing power (from your screenshot 0.6-0.7)
const TIER_25: ParityTier = {
  discount: 25,
  countries: [
    'AE', // UAE
    'ES', // Spain
    'CW', // Curacao
    'CY', // Cyprus
    'EE', // Estonia
    'IT', // Italy
    'KR', // South Korea
    'CG', // Congo
    'MT', // Malta
    'SG', // Singapore
    'DM', // Dominica
    'VE', // Venezuela
    'BM', // Bermuda
    'OM', // Oman
    'CN', // China
    'TW', // Taiwan
    'MY', // Malaysia
    'TH', // Thailand
  ],
}

// 15% off - medium purchasing power (from your screenshot 0.7-0.8)
const TIER_15: ParityTier = {
  discount: 15,
  countries: [
    'AT', // Austria
    'JP', // Japan
    'BE', // Belgium
    'BS', // Bahamas
    'DE', // Germany
    'FR', // France
    'RE', // Reunion
    'KW', // Kuwait
    'HK', // Hong Kong
    'LC', // Saint Lucia
    'GQ', // Grenada? no, looks like saba
    'QA', // Qatar
    'PG', // Papua New Guinea
    'TT', // Trinidad
    'UY', // Uruguay
    'GG', // Guernsey
    'IL', // Israel
    'SE', // Sweden
    'FI', // Finland
    'NO', // Norway
    'DK', // Denmark
    'NL', // Netherlands
    'IE', // Ireland
    'PT', // Portugal
    'PL', // Poland
    'HU', // Hungary
    'RO', // Romania
    'BG', // Bulgaria
    'HR', // Croatia
  ],
}

// all tiers for lookup
export const PARITY_TIERS = [TIER_40, TIER_30, TIER_25, TIER_15]

/**
 * Get the parity discount for a country code
 * @param countryCode ISO 3166-1 alpha-2 country code (from CF-IPCountry header)
 * @returns discount percentage (0-100) or 0 if no discount
 */
export function getParityDiscount(countryCode: string | null): number {
  if (!countryCode) return 0

  const code = countryCode.toUpperCase()

  for (const tier of PARITY_TIERS) {
    if (tier.countries.includes(code)) {
      return tier.discount
    }
  }

  return 0
}

/**
 * Get country name from code (for display)
 */
export const COUNTRY_NAMES: Record<string, string> = {
  IN: 'India',
  PK: 'Pakistan',
  BD: 'Bangladesh',
  NG: 'Nigeria',
  EG: 'Egypt',
  VN: 'Vietnam',
  PH: 'Philippines',
  ID: 'Indonesia',
  UA: 'Ukraine',
  KE: 'Kenya',
  GH: 'Ghana',
  AR: 'Argentina',
  GR: 'Greece',
  MX: 'Mexico',
  BR: 'Brazil',
  CL: 'Chile',
  CO: 'Colombia',
  PE: 'Peru',
  TH: 'Thailand',
  MY: 'Malaysia',
  CN: 'China',
  TW: 'Taiwan',
  KR: 'South Korea',
  JP: 'Japan',
  DE: 'Germany',
  FR: 'France',
  IT: 'Italy',
  ES: 'Spain',
  PT: 'Portugal',
  NL: 'Netherlands',
  BE: 'Belgium',
  AT: 'Austria',
  CH: 'Switzerland',
  SE: 'Sweden',
  NO: 'Norway',
  DK: 'Denmark',
  FI: 'Finland',
  PL: 'Poland',
  CZ: 'Czech Republic',
  HU: 'Hungary',
  RO: 'Romania',
  BG: 'Bulgaria',
  HR: 'Croatia',
  SI: 'Slovenia',
  SK: 'Slovakia',
  LT: 'Lithuania',
  LV: 'Latvia',
  EE: 'Estonia',
  IE: 'Ireland',
  SG: 'Singapore',
  HK: 'Hong Kong',
  AE: 'United Arab Emirates',
  SA: 'Saudi Arabia',
  IL: 'Israel',
  TR: 'Turkey',
  ZA: 'South Africa',
  NZ: 'New Zealand',
  AU: 'Australia',
  CA: 'Canada',
  GB: 'United Kingdom',
  US: 'United States',
}

export function getCountryName(code: string | null): string {
  if (!code) return 'Unknown'
  return COUNTRY_NAMES[code.toUpperCase()] || code.toUpperCase()
}

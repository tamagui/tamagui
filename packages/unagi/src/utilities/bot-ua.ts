/**
 * An alphabetized list of User Agents of known bots, combined from lists found at:
 * https://github.com/vercel/next.js/blob/d87dc2b5a0b3fdbc0f6806a47be72bad59564bd0/packages/next/server/utils.ts#L18-L22
 * https://github.com/GoogleChrome/rendertron/blob/6f681688737846b28754fbfdf5db173846a826df/middleware/src/middleware.ts#L24-L41
 */
const botUserAgents = [
  'AdsBot-Google',
  'applebot',
  'Baiduspider',
  'baiduspider',
  'Bytespider',
  '360Spider',
  'PetalBot',
  'Yisouspider',
  'bingbot',
  'Bingbot',
  'BingPreview',
  'bitlybot',
  'Discordbot',
  'DuckDuckBot',
  'Embedly',
  'facebookcatalog',
  'facebookexternalhit',
  'Google-PageRenderer',
  'Googlebot',
  'googleweblight',
  'ia_archive',
  'LinkedInBot',
  'Mediapartners-Google',
  'outbrain',
  'pinterest',
  'quora link preview',
  'redditbot',
  'rogerbot',
  'showyoubot',
  'SkypeUriPreview',
  'Slackbot',
  'Slurp',
  'sogou',
  'Storebot-Google',
  'TelegramBot',
  'tumblr',
  'Twitterbot',
  'vkShare',
  'W3C_Validator',
  'WhatsApp',
  'yandex',

  // SEO Tools
  'Seoradar',
  'W3C html2txt',
]

/**
 * Creates a regex based on the botUserAgents array
 */
const botUARegex = new RegExp(botUserAgents.join('|'), 'i')

/**
 * Determines if the request is from a bot, using the URL and User Agent
 */
export function isBotUA(url: URL, userAgent: string | null): boolean {
  return url.searchParams.has('_bot') || (!!userAgent && botUARegex.test(userAgent))
}

const { withTamagui } = require('@tamagui/next-plugin')
const withPlugins = require('next-compose-plugins')
const withFonts = require('next-fonts')
const withVideos = require('next-videos')
const withOptimizedImages = require('next-optimized-images')

Error.stackTraceLimit = Infinity

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'

const transform = withPlugins(
  [
    withOptimizedImages,
    withVideos,
    withFonts,
    withTamagui({
      config: './tamagui.config.ts',
      components: ['tamagui'],
      importsWhitelist: ['constants.js', 'colors.js'],
      logTimings: true,
      disableExtraction: false, //process.env.NODE_ENV === 'development',
    }),
    // for github pages
    (config) => {
      if (process.env.ON_GITHUB_PAGES) {
        console.log('Setting github pages base and asset paths')
        config.basePath = '/tamagui'
        config.assetPrefix = '/tamagui/'
      }
      return config
    },
  ],
  {
    // Next.js config
    async redirects() {
      return [
        {
          source: '/docs',
          destination: '/docs/installation',
          permanent: true,
        },
      ]
    },
  }
)

module.exports = function (name, { defaultConfig }) {
  defaultConfig.experimental.reactRoot = 'concurrent'
  defaultConfig.typescript.ignoreBuildErrors = true
  return transform(name, { defaultConfig })
}

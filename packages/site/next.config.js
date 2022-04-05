const { withTamagui } = require('@tamagui/next-plugin')
const withPlugins = require('next-compose-plugins')
const withFonts = require('next-fonts')
const withVideos = require('next-videos')
const withBundleAnalyzer = require('@next/bundle-analyzer')

Error.stackTraceLimit = Infinity

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'

const transform = withPlugins(
  [
    withBundleAnalyzer({
      enabled: process.env.ANALYZE === 'true',
    }),
    withVideos,
    withFonts,
    withTamagui({
      config: './tamagui.config.ts',
      components: ['tamagui'],
      importsWhitelist: ['constants.js', 'colors.js'],
      logTimings: true,
      disableExtraction: false,
      // disableExtraction: process.env.NODE_ENV === 'development',
      excludeReactNativeWebExports: [
        'Switch',
        'ProgressBar',
        'Picker',
        'Animated',
        'AnimatedFlatList',
      ],
    }),
    // // template for modifying webpack further:
    // (nextConfig = {}) => {
    //   return Object.assign({}, nextConfig, {
    //     webpack(config, options) {
    //       config.optimization.minimize = false
    //       if (typeof nextConfig.webpack === 'function') {
    //         return nextConfig.webpack(config, options)
    //       }
    //       return config
    //     },
    //   })
    // },
    (config) => {
      // for github pages
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
          destination: '/docs/intro',
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

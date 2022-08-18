/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')

Error.stackTraceLimit = Infinity

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'

const boolVals = {
  true: true,
  false: false,
}

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

const plugins = [
  withBundleAnalyzer({
    enabled: process.env.NODE_ENV === 'production',
    openAnalyzer: process.env.ANALYZE === 'true',
  }),
  withTamagui({
    useReactNativeWebLite: true,
    config: './tamagui.config.ts',
    components: ['tamagui'],
    importsWhitelist: ['constants.js', 'colors.js'],
    logTimings: true,
    disableExtraction,
    excludeReactNativeWebExports: [
      'Switch',
      'ProgressBar',
      'Picker',
      'Modal',
      'VirtualizedList',
      'VirtualizedSectionList',
      'AnimatedFlatList',
      'FlatList',
      'CheckBox',
      'Touchable',
      'SectionList',
    ],
  }),
  // (config) => {
  //   return {
  //     ...config,
  //     webpack(webpackConfig, options) {
  //       const { StatsWriterPlugin } = require('webpack-stats-plugin')
  //       webpackConfig.plugins.push(
  //         new StatsWriterPlugin({
  //           filename: 'stats.json',
  //         })
  //       )
  //       if (typeof config.webpack === 'function') {
  //         return config.webpack(webpackConfig, options)
  //       }
  //       return webpackConfig
  //     },
  //   }
  // },
  (config) => {
    // for github pages
    if (process.env.ON_GITHUB_PAGES) {
      config.basePath = '/tamagui'
      config.assetPrefix = '/tamagui/'
    }
    return config
  },
]

module.exports = function (name, { defaultConfig }) {
  /** @type {import('next').NextConfig} */
  let config = {
    productionBrowserSourceMaps: process.env.ANALYZE === 'true',
    experimental: {
      scrollRestoration: true,
      legacyBrowsers: false,
      browsersListForSwc: true,
      // runtime: 'nodejs',
      // serverComponents: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
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

  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    }
  }

  return config
}

// // template for modifying webpack further:
// (nextConfig = {}) => {
//   return Object.assign({}, nextConfig, {
//     webpack(config, options) {
//       const webpack = require('webpack')
//       config.plugins.push(
//         new webpack.NormalModuleReplacementPlugin(
//           /.*web-vitals.*/,
//           require.resolve('@tamagui/proxy-worm')
//         )
//       )

//       // Object.assign(config.resolve.alias, {
//       //   'react-native-reanimated': require.resolve('react-native-reanimated/lib/index'),
//       // })
//       // console.log('config', config.resolve.alias)
//       if (typeof nextConfig.webpack === 'function') {
//         return nextConfig.webpack(config, options)
//       }
//       return config
//     },
//   })
// },

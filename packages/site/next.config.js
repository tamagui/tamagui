/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const withPlugins = require('next-compose-plugins')
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

const transform = withPlugins(
  [
    withBundleAnalyzer({
      enabled: process.env.NODE_ENV === 'production',
      openAnalyzer: process.env.ANALYZE === 'true',
    }),
    withTamagui({
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

module.exports = function (name, opts) {
  /** @type {import('next').NextConfig} */
  const out = transform(name, opts)

  /** @type {import('next').NextConfig} */
  const final = {
    ...out,
    productionBrowserSourceMaps: process.env.ANALYZE === 'true',
    experimental: {
      ...out.experimental,
      scrollRestoration: true,
      legacyBrowsers: false,
      browsersListForSwc: true,
    },
    eslint: {
      ...out.eslint,
      ignoreDuringBuilds: true,
    },
    typescript: {
      ...out.typescript,
      ignoreBuildErrors: true,
    },
  }

  return final
}

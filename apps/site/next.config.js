Error.stackTraceLimit = Infinity

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'
// process.env.TAMAGUI_ENABLE_DYNAMIC_LOAD = '1'

// const withPreact = require('next-plugin-preact')

/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const withBundleAnalyzer = require('@next/bundle-analyzer')

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
    // enableCSSOptimizations: true,
    config: './tamagui.config.ts',
    components: ['tamagui'],
    importsWhitelist: ['constants.js', 'colors.js'],
    logTimings: true,
    disableExtraction,
  }),
  // withPreact,
  (config) => {
    return {
      ...config,
      webpack(webpackConfig, options) {
        webpackConfig.resolve.alias ??= {}

        // https://github.com/theKashey/react-remove-scroll/pull/78
        // react-remove-scroll + getting rid of tslib in general
        Object.assign(webpackConfig.resolve.alias, {
          tslib: '@tamagui/proxy-worm',
        })
        webpackConfig.resolve.mainFields.unshift('module:es2019')

        if (process.env.PROFILE) {
          webpackConfig.resolve.alias['react-dom'] = require.resolve('react-dom/profiling')
          webpackConfig.optimization.minimize = false
        }

        if (process.env.ANALYZE === 'true') {
          const { StatsWriterPlugin } = require('webpack-stats-plugin')
          webpackConfig.plugins.push(
            new StatsWriterPlugin({
              filename: 'stats.json',
              stats: {
                all: true,
              },
            })
          )
        }
        if (typeof config.webpack === 'function') {
          return config.webpack(webpackConfig, options)
        }
        return webpackConfig
      },
    }
  },
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
    swcMinify: true,
    reactStrictMode: true,
    experimental: {
      reactMode: 'concurrent',
      esmExternals: true,
      forceSwcTransforms: true,
      scrollRestoration: true,
      legacyBrowsers: false,
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

const readingTime = require('reading-time')
const withPlugins = require('next-compose-plugins')
const withVideos = require('next-videos')
const withOptimizedImages = require('next-optimized-images')
const path = require('path')
const fs = require('fs')
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin')

Error.stackTraceLimit = Infinity

const dir = path.join(require.resolve('snackui'), '..', '..')
const fakeReactNative = path.join(dir, 'node_modules', 'react-native.js')
// monorepo dev support.. for now
const parentFakeDir = path.join(dir, '..', '..', 'node_modules')
const files = [fakeReactNative, parentFakeDir ? path.join(parentFakeDir, 'react-native.js') : null]
files.forEach((file) => {
  // if (!fs.existsSync(file)) {
  console.log('patching', file)
  fs.writeFileSync(fakeReactNative, 'module.exports = require("react-native-web")')
  // }
})

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const withBundleAnalyzer = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (ANALYZE) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      )
    }
    return config
  },
}

const withDuplicatePackageCheck = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(new DuplicatePackageCheckerPlugin())
    return config
  },
}

const withSnackUI = {
  webpack: (webpackConfig, { config, isServer }) => {
    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'react-native-web/src/modules/normalizeColor': require.resolve(
        'react-native-web/dist/modules/normalizeColor'
      ),
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
      react: require.resolve('react'),
      'react-dom': require.resolve('react-dom'),
    }

    // why is it undefined on next11??? but it says using webpack5
    const isWebpack5 = !!config.future.webpack5 || typeof config.webpack5 === 'undefined'

    const shouldIncludeModule = (path) => {
      if (/(node_modules|lib)\/(react|react-dom)\//.test(path)) {
        console.log('exclude this shit', path)
        return false
      }
      if (/snackui-node/.test(path)) {
        return false
      }
      const include = /(node_modules|packages)\/(@?snackui|@react|react-native-)/.test(path)
      // if (include) console.log('inlcuding', path)
      return include
    }

    if (isServer) {
      webpackConfig.externals = [
        ...webpackConfig.externals.map((external) => {
          if (typeof external !== 'function') {
            return external
          }
          // only runs on server
          if (isWebpack5) {
            return (ctx, cb) => {
              const fullPath = path.join(ctx.context, ctx.request)
              if (/(node_modules|lib)\/(react-dom)\//.test(fullPath)) {
                return cb(null, `commonjs react-dom`)
              }
              if (/(node_modules|lib)\/(react)\//.test(fullPath)) {
                return cb(null, `commonjs react`)
              }
              return shouldIncludeModule(fullPath) ? cb() : external(ctx, cb)
            }
          }
          return (ctx, req, cb) => {
            const fullPath = path.join(ctx, req)
            return shouldIncludeModule(fullPath) ? cb() : external(ctx, req, cb)
          }
        }),
      ]
    }

    const isNext11 = typeof webpackConfig.module.rules[0].resolve?.fullySpecified === 'boolean'
    const SnackUILoader = {
      loader: require.resolve('snackui-loader'),
      options: {
        evaluateImportsWhitelist: ['constants.js', 'colors.js'],
        themesFile: require.resolve('./constants/themes.ts'),
        logTimings: true,
      },
    }

    const oneOfRule = webpackConfig.module.rules.find((x) => !!x.oneOf)
    if (oneOfRule) {
      oneOfRule.oneOf.unshift({
        test: /\.css$/i,
        use: [
          isServer ? null : require.resolve('style-loader'),
          require.resolve('css-loader'),
        ].filter(Boolean),
      })
    }

    if (isNext11) {
      const [first, second, ...rest] = webpackConfig.module.rules
      webpackConfig.module.rules = [
        first,
        second,
        {
          test: /\.(tsx|ts|js|mjs|jsx)$/,
          use: SnackUILoader,
        },
        ...rest,
      ]
    } else {
      webpackConfig.module.rules[0].use = [
        ...[].concat(webpackConfig.module.rules[0].use),
        SnackUILoader,
      ]
    }

    webpackConfig.optimization.splitChunks = false
    return webpackConfig
  },
}

const transform = withPlugins(
  [
    // withUnimodules,
    withBundleAnalyzer,
    withDuplicatePackageCheck,
    withOptimizedImages,
    withVideos,
    withSnackUI,
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

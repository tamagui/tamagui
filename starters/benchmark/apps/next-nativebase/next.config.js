const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')
const { withNativebase } = require('@native-base/next-adapter')
const path = require('path')

const rnw = path.join(require.resolve('react-native-web'), '..', '..', '..')

const transform = withPlugins([
  withTM([
    'solito',
    'react-native-web',
    'expo-linking',
    'expo-constants',
    'expo-modules-core',
    '@my/config',
    '@my/app',
  ]),
  withNativebase({
    nextConfig: {
      webpack: (config, options) => {
        config.resolve.alias = {
          ...(config.resolve.alias || {}),
          'react-native$': rnw,
        }
        config.resolve.extensions = ['.web.js', '.web.ts', '.web.tsx', ...config.resolve.extensions]
        return config
      },
    },
  }),
])

module.exports = function (name, { defaultConfig }) {
  defaultConfig.webpack5 = true
  // defaultConfig.experimental.reactRoot = 'concurrent'
  defaultConfig.typescript.ignoreBuildErrors = true
  return transform(name, {
    ...defaultConfig,
    webpack5: true,
    experimental: {
      plugins: true,
      scrollRestoration: true,
      legacyBrowsers: false,
      browsersListForSwc: true,
    },
  })
}

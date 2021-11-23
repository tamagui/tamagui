const { withTamagui } = require('@tamagui/next-plugin')
const withPlugins = require('next-compose-plugins')

const withTM = require('next-transpile-modules')([
  // drispy
  'dripsy',
  '@dripsy/core',

  // nativebase
  'native-base',
  'react-native-svg',
  'react-native-safe-area-context',
  '@react-aria/visually-hidden',
  '@react-native-aria/button',
  '@react-native-aria/checkbox',
  '@react-native-aria/combobox',
  '@react-native-aria/focus',
  '@react-native-aria/interactions',
  '@react-native-aria/listbox',
  '@react-native-aria/overlays',
  '@react-native-aria/radio',
  '@react-native-aria/slider',
  '@react-native-aria/tabs',
  '@react-native-aria/utils',
  '@react-stately/combobox',
  '@react-stately/radio',
])

//
// See: https://kentcdodds.com/blog/profile-a-react-app-for-performance#build-and-measure-the-production-app
// See: https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config

module.exports = withPlugins(
  [
    withTamagui({
      config: './tamagui.config.ts',
      components: ['@tamagui/bench-components'],
      logTimings: true,
      disableExtraction: false,
    }),
    withTM,
  ],
  {
    experimental: {
      reactRoot: 'concurrent',
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack: (config, options) => {
      //
      // Use profiler-enabled React builds
      //
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-dom$': 'react-dom/profiling',
        'scheduler/tracing': 'scheduler/tracing-profiling',
      }

      //
      // Disable mangling for easier profiling
      // WARNING: This increases bundle size, DO NOT DO THIS in production!
      //
      const terser = config.optimization.minimizer.find(
        (plugin) =>
          typeof plugin.options !== 'undefined' &&
          typeof plugin.options.terserOptions !== 'undefined'
      )
      if (terser) {
        terser.options.terserOptions = {
          ...terser.options.terserOptions,
          keep_classnames: true,
          keep_fnames: true,
        }
      }

      return config
    },
  }
)

// module.exports = function (name, options) {
//   console.log('w?', options)
//   const { defaultConfig } = options
//   defaultConfig.experimental.reactRoot = 'concurrent'
//   defaultConfig.typescript.ignoreBuildErrors = true
//   return transform(name, {
//     defaultConfig,

// }

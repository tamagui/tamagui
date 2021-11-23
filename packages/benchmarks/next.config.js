const { withTamagui } = require('@tamagui/next-plugin')
const withPlugins = require('next-compose-plugins')

const withTM = require('next-transpile-modules')([
  'dripsy',
  '@dripsy/core',
  // you can add other packages here that need transpiling
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

/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const withImages = require('next-images')
const { join } = require('path')

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = '1'

const boolVals = {
  true: true,
  false: false,
}

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

console.log(`

Welcome to Tamagui!

We've set up a few things for you. We set the "excludeReactNativeWebExports"
setting in next.config.js, which omits these from the bundle:

- Switch, ProgressBar, Picker, CheckBox, Touchable

To save more, you can add more that you may not need, like:

- AnimatedFlatList, FlatList, SectionList, VirtualizedList, VirtualizedSectionList

Even better, enable "useReactNativeWebLite" to you can remove the
excludeReactNativeWebExports setting altogether, and get tree-shaking and
concurrent mode support.

🐣

Remove this log in next.config.js.

`)

const plugins = [
  withImages,
  withTamagui({
    config: './tamagui.config.ts',
    components: ['tamagui', '@my/ui'],
    importsWhitelist: ['constants.js', 'colors.js'],
    logTimings: true,
    disableExtraction,
    // experiment - reduced bundle size react-native-web
    useReactNativeWebLite: false,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app'))) {
        return true
      }
    },
    excludeReactNativeWebExports: ['Switch', 'ProgressBar', 'Picker', 'CheckBox', 'Touchable'],
  }),
]

module.exports = function () {
  /** @type {import('next').NextConfig} */
  let config = {
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      disableStaticImages: true,
    },
    experimental: {
      optimizeCss: true,
      scrollRestoration: true,
      legacyBrowsers: false,
      transpilePackages: [
        'solito',
        'react-native-web',
        'expo-linking',
        'expo-constants',
        'expo-modules-core',
      ],
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

/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const withImages = require('next-images')
const withTM = require('next-transpile-modules')
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

We've set up a few things for you. Note the "excludeReactNativeWebExports" setting
in next.config.js which omits these from the bundle:

- Switch, ProgressBar, Picker, CheckBox, Touchable

Add these to save more, if you don't need them:

- AnimatedFlatList, FlatList, SectionList, VirtualizedList, VirtualizedSectionList

Even better, enable "useReactNativeWebLite" to avoid excludeReactNativeWebExports and
get tree-shaking and concurrent mode support.

🐤

You can remove this log in next.config.js.

`)

const plugins = [
  withImages,
  withTM([
    'solito',
    'react-native-web',
    'expo-linking',
    'expo-constants',
    'expo-modules-core',
    '@my/config',
    '@my/ui'
  ]),
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
  let config = {
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      disableStaticImages: true,
    },
    experimental: {
      scrollRestoration: true,
      legacyBrowsers: false,
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

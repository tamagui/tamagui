/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins')
const { withTamagui } = require('@tamagui/next-plugin')
const withTM = require('next-transpile-modules')
const { join } = require('path')

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'

const disableExtraction = process.env.NODE_ENV === 'development'
if (disableExtraction) {
  console.log('Disabling static extraction in development mode for better HMR')
}

console.log(`

Hello and welcome to Tamagui! You can remove this console.log from your next.config.js.

We've set up a few things for you. Note that "excludeReactNativeWebExports" removes
the following from react-native-web for bundle size savings:

- Switch
- ProgressBar
- Picker
- Modal
- VirtualizedList
- VirtualizedSectionList
- AnimatedFlatList
- FlatList
- CheckBox
- Touchable
- SectionList

If you use any of these components you'll get an error "Cannot convert object to
primitive value".

If you want a simpler setup, you can try the experimental "useReactNativeWebLite"
flag seen below instead and get big bundle size savings + concurrent mode support.
Then you can remove excludeReactNativeWebExports.

Cheers 🍻

`)

const transform = withPlugins([
  withTM([
    'solito',
    'react-native-web',
    'expo-linking',
    'expo-constants',
    'expo-modules-core',
    '@my/config',
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

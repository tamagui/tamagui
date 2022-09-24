/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins')
const { withTamagui } = require('@tamagui/next-plugin')
const withTM = require('next-transpile-modules')

process.env.IGNORE_TS_CONFIG_PATHS = 'true'
process.env.TAMAGUI_TARGET = 'web'

const disableExtraction = process.env.NODE_ENV === 'development'
if (disableExtraction) {
  console.log('Disabling static extraction in development mode for better HMR')
}

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
    shouldExtract: (path) => {
      if (path.includes('packages/app')) {
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

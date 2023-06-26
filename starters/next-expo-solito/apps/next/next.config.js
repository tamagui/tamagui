/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const { join } = require('path')

const boolVals = {
  true: true,
  false: false,
}

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

console.log(`

Welcome to Tamagui!

You can update this monorepo to the latest Tamagui release just by running:

yarn upgrade:tamagui

We've set up a few things for you.

See the "excludeReactNativeWebExports" setting in next.config.js, which omits these
from the bundle: Switch, ProgressBar Picker, CheckBox, Touchable. To save more,
you can add ones you don't need like: AnimatedFlatList, FlatList, SectionList,
VirtualizedList, VirtualizedSectionList.

Even better, enable "useReactNativeWebLite" and you can remove the
excludeReactNativeWebExports setting altogether and get tree-shaking and
concurrent mode support as well.

🐣

Remove this log in next.config.js.

`)

const plugins = [
  withTamagui({
    config: './tamagui.config.ts',
    components: ['tamagui', '@my/ui'],
    importsWhitelist: ['constants.js', 'colors.js'],
    outputCSS: process.env.NODE_ENV === 'production' ? './public/tamagui.css' : null,
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
    modularizeImports: {
      '@tamagui/lucide-icons': {
        transform: `@tamagui/lucide-icons/dist/esm/icons/{{kebabCase member}}`,
        skipDefaultConversion: true,
      },
    },
    transpilePackages: [
      'solito',
      'react-native-web',
      'expo-linking',
      'expo-constants',
      'expo-modules-core',
    ],
    experimental: {
      /*
       A few notes before enabling app directory:

       - App dir is not yet stable - Usage of this for production apps is discouraged.
       - Tamagui doesn't support usage in React Server Components yet (usage with 'use client' is supported).
       - Solito doesn't support app dir at the moment - You'll have to remove Solito.
       - The `/app` in this starter has the same routes as the `/pages` directory. You should probably remove `/pages` after enabling this.
      */
      appDir: false,
      // optimizeCss: true,
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

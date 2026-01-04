/** @type {import('next').NextConfig} */
const { withTamagui } = require('@tamagui/next-plugin')
const { join } = require('node:path')

const boolVals = {
  true: true,
  false: false,
}

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

const plugins = [
  withTamagui({
    appDir: true,
    disableExtraction,
    shouldExtract: (path) => {
      if (path.includes(join('packages', 'app'))) {
        return true
      }
    },
  }),
]

module.exports = () => {
  /** @type {import('next').NextConfig} */
  let config = {
    typescript: {
      ignoreBuildErrors: true,
    },
    transpilePackages: [
      'solito',
      'react-native-web',
      'expo-linking',
      'expo-constants',
      'expo-modules-core',
    ],
    experimental: {
      scrollRestoration: true,
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

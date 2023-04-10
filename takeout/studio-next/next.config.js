const withTamagui = require('@tamagui/next-plugin').withTamagui

module.exports = function (name, { defaultConfig }) {
  let config = {
    ...defaultConfig,
    experimental: {
      appDir: true,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
  }

  const tamaguiPlugin = withTamagui({
    config: './tamagui.config.ts',
    components: ['tamagui'],
    disableExtraction: true,
  })

  return {
    ...config,
    ...tamaguiPlugin(config),
  }
}
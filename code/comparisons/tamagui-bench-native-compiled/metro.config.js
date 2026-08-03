// compiled fixture: resolve @tamagui/* from workspace source and enable native lowering.
const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../../..')

const config = getDefaultConfig(projectRoot)

config.resolver.unstable_enablePackageExports =
  process.env.TAMAGUI_PACKAGE_EXPORTS !== 'false'

config.resolver.blockList = [/code\/tamagui\.dev\//, /code\/.*\/__tests__\//]

config.watchFolders = [monorepoRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
})

// runtime fixture: resolve @tamagui/* from workspace source without the compiler plugin.
const { getDefaultConfig } = require('expo/metro-config')
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

module.exports = config

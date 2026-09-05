// vanilla Expo monorepo metro config (mirrors kitchen-sink-go) — resolves @tamagui/* from the
// workspace source, NO withTamagui (we test the pure runtime className→style path on native).
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../../../..')

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

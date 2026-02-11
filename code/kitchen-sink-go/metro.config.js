const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.resolver.unstable_enablePackageExports =
  process.env.TAMAGUI_PACKAGE_EXPORTS !== 'false'

// block unnecessary directories from metro file crawling
config.resolver.blockList = [
  /code\/tamagui\.dev\//,
  /code\/.*\/__tests__\//,
  /code\/.*\/\.maestro\//,
]

config.watchFolders = [monorepoRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]

// no withTamagui, no unstable_conditionNames - pure vanilla
module.exports = config

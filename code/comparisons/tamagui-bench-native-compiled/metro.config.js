// vanilla Expo monorepo metro config (mirrors conformance/native) — resolves @tamagui/* from
// the workspace source. Mode is selected at deep-link time, not at build time, so a single
// bundle exercises both "compiled" (default) and "runtime" (EXTRACT=0) paths via deep-link.
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

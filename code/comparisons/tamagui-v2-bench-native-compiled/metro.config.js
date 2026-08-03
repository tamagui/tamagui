const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')
const path = require('path')

const projectRoot = __dirname
const monorepoRoot = path.resolve(projectRoot, '../../..')
const config = getDefaultConfig(projectRoot)

config.watchFolders = [monorepoRoot]
config.resolver.disableHierarchicalLookup = true
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')]

module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
})

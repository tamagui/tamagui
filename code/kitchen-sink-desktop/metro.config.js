const { getDefaultConfig } = require('@expo/metro-config')
const { makeMetroConfig } = require('@rnx-kit/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')
const fs = require('node:fs')
const path = require('node:path')

const projectRoot = __dirname
const config = makeMetroConfig(getDefaultConfig(projectRoot))

config.resolver.unstable_enablePackageExports = true
config.resolver.platforms = [
  ...new Set([...(config.resolver.platforms ?? []), 'macos', 'windows']),
]
config.resolver.unstable_conditionsByPlatform = {
  ...config.resolver.unstable_conditionsByPlatform,
  macos: ['react-native'],
  windows: ['react-native'],
}
config.resolver.sourceExts.push('mjs')

// lllink points this app's installed @tamagui packages at the source monorepo.
// Watch only those package targets rather than the entire monorepo (including its
// node_modules), and keep React/RN resolution pinned to this isolated app.
if (process.env.TAMAGUI_USE_LOCAL === '1') {
  const nodeModules = path.resolve(projectRoot, 'node_modules')
  const tamaguiScope = path.join(nodeModules, '@tamagui')
  const linkedPackages = [
    path.join(nodeModules, 'tamagui'),
    ...fs.readdirSync(tamaguiScope).map((name) => path.join(tamaguiScope, name)),
  ].flatMap((packagePath) =>
    fs.lstatSync(packagePath).isSymbolicLink() ? [fs.realpathSync(packagePath)] : []
  )

  config.watchFolders = [...new Set([...(config.watchFolders ?? []), ...linkedPackages])]
  config.resolver.disableHierarchicalLookup = true
  config.resolver.unstable_enableSymlinks = true
  config.resolver.nodeModulesPaths = [nodeModules]
}

module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
})

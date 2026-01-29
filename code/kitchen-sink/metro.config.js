const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')
const { withTamagui } = require('@tamagui/metro-plugin')
// Find the project and workspace directories
const projectRoot = __dirname
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.resolver.unstable_enablePackageExports = true

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot]
// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
]
// 3. Metro seems to be ignoring nested node_modules for packages in monorepo
//    root node_modules (e.g. importing `entities` from
//    `node_modules/parse5/...` should resolve to
//    `node_modules/parse5/node_modules/entities/...` but Metro resolves it to
//    `node_modules/entities/...` instead). This is a workaround to fix it.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  try {
    return context.resolveRequest(context, moduleName, platform)
  } catch (e) {
    // This isn't 100% safe, it only fixes build-time errors, but it cannot
    // fix runtime errors occurred due to incorrect resolution.
    const hierarchicalNodeModulesPaths = path
      .dirname(context.originModulePath)
      .split(path.sep)
      .map((_, i, parts) =>
        path.join('/', ...parts.slice(1, parts.length - i), 'node_modules')
      )

    console.info(
      `Metro failed to resolve "${moduleName}" from "${context.originModulePath}": ${e.message}. Retrying with manually specifying hierarchical node_modules paths: ${hierarchicalNodeModulesPaths.join(', ')}`
    )

    return context.resolveRequest(
      {
        ...context,
        nodeModulesPaths: [...hierarchicalNodeModulesPaths, ...context.nodeModulesPaths],
      },
      moduleName,
      platform
    )
  }
}

module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './src/tamagui.config.ts',
})

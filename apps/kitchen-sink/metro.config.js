/**
 * @type {import('expo/metro-config')}
 */
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(__dirname, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

config.resolver.extraNodeModules = {
  modules: workspaceRoot,
}

// https://github.com/facebook/react-native/issues/36794#issuecomment-1500880284
// temp workaround for a ridiculous RN 0.71.6 bug
config.server = {
  ...config.server,
  rewriteRequestUrl: (url) => {
    if (!url.endsWith('.bundle')) {
      return url
    }
    // https://github.com/facebook/react-native/issues/36794
    // JavaScriptCore strips query strings, so try to re-add them with a best guess.
    return url + '?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true'
  }, // ...
}

config.resolver.disableHierarchicalLookup = true

console.log('config', config)

module.exports = config

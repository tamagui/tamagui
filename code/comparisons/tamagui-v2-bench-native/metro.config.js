const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const comparisonsRoot = path.resolve(projectRoot, '..')
const config = getDefaultConfig(projectRoot)

config.watchFolders = [comparisonsRoot]
config.resolver.disableHierarchicalLookup = true
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, 'node_modules')]

module.exports = config

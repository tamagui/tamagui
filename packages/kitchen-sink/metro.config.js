const { getDefaultConfig } = require('@expo/metro-config')
const { makeMetroConfig } = require('@rnx-kit/metro-config')
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks')

const conf = getDefaultConfig(__dirname)
console.log('conf', conf)

module.exports = makeMetroConfig({
  projectRoot: __dirname,
  resolver: {
    resolveRequest: MetroSymlinksResolver(),
  },
})

// // Learn more https://docs.expo.io/guides/customizing-metro
// /**
//  * @type {import('expo/metro-config')}
//  */
//
// const path = require('path')

// const projectRoot = __dirname
// const workspaceRoot = path.resolve(__dirname, '..')

// const config = getDefaultConfig(projectRoot)

// config.watchFolders = [workspaceRoot]
// config.resolver.nodeModulesPaths = [
//   path.resolve(projectRoot, 'node_modules'),
//   path.resolve(workspaceRoot, 'node_modules'),
// ]

// config.resolver.extraNodeModules = {
//   modules: workspaceRoot,
// }

// console.log('config', config)

// module.exports = config

// // const defaultSourceExts =
// //   require('metro-config/src/defaults/defaults').sourceExts

// // module.exports = {
// //   transformer: {
// //     getTransformOptions: () => ({
// //       transform: {
// //         experimentalImportSupport: true,
// //         inlineRequires: true,
// //       },
// //     }),
// //   },
// //   resolver: {
// //     sourceExts: [...defaultSourceExts, 'cjs'],
// //   },
// // }

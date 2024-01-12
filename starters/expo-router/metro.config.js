// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
})

// // This is not needed for Tamagui, it is configuration for Metro to understand monorepos
// const projectRoot = __dirname
// config.watchFolders = [projectRoot]
// config.resolver.nodeModulesPaths = [
//   path.resolve(projectRoot, 'node_modules'),
// ]

// 2. Enable Tamagui
const { withTamagui } = require('@tamagui/metro-plugin')
module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts'
})

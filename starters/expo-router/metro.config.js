// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')

/** @type {import('expo/metro-config').MetroConfig} */
let config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
})

// 2. Enable Tamagui
const { withTamagui } = require('@tamagui/metro-plugin')
config = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui-web.css',
})

// REMOVE THIS (just for tamagui internal devs):
if (process.env.IS_TAMAGUI_DEV) {
  // just have to run first:
  // yarn link ~/tamagui --all
  const fs = require('fs')
  const path = require('path')
  const projectRoot = __dirname
  const monorepoRoot = path.resolve(projectRoot, '../..')
  config.watchFolders = [monorepoRoot]
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ]
  // have to manually de-deupe
  try {
    fs.rmSync(path.join(projectRoot, 'node_modules', 'react'), {
      recursive: true,
      force: true,
    })
  } catch {}
  try {
    fs.rmSync(path.join(projectRoot, 'node_modules', 'react-dom'), {
      recursive: true,
      force: true,
    })
  } catch {}
}

module.exports = config

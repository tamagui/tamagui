// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')
const fs = require('fs')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
})

/**
 * This is just for the tamagui monorepo, can delete:
 */

// generic monorepo config:
const projectRoot = __dirname
const projectNM = path.resolve(projectRoot, 'node_modules')
const workspaceRoot = path.join(__dirname, '../..')
const workspaceNM = path.resolve(workspaceRoot, 'node_modules')
config.watchFolders = [workspaceRoot, projectRoot]
config.resolver.nodeModulesPaths = [projectNM, workspaceNM]

// delete some duplicates that metro gets tripped up by
const dirs = ['react', 'react-dom']
for (const name of dirs) {
  const remote = path.join(workspaceNM, name)
  const local = path.join(projectNM, name)
  if (fs.existsSync(local)) {
    console.info('Manual de-dupe, symlink to root: ' + local)
    try {
      fs.rmdirSync(local, {
        recursive: true,
        force: true,
      })
      fs.symlinkSync(remote, local)
    } catch {}
  }
}

/**
 * End monorepo / tamagui specific config
 */

// 2. Enable Tamagui
const { withTamagui } = require('@tamagui/metro-plugin')
module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui.css',
  disableMinifyCSS: true,
})

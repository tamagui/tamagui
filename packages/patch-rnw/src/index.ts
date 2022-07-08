import path from 'path'

import * as fs from 'fs-extra'

// were patching react-native-web to support className

export function patchReactNativeWeb(dir: string = require.resolve('react-native-web')) {
  const rootDir = dir.replace(/[\/\\]dist.*/, '')

  const pkgJSON = fs.readJSONSync(path.join(rootDir, 'package.json'))
  if (pkgJSON.version.split('.')[1] !== '18') {
    console.error(
      `⛔️ Error! Tamagui as of beta 69 only works with react-native-web version 0.18.x`,
      pkgJSON.version
    )
    process.exit(1)
  }

  const patches = [
    {
      target: path.join(rootDir, 'dist', 'modules', 'createDOMProps', 'index.js'),
      patched: path.join(__dirname, '..', '..', 'patches', '18', 'createDOMProps.js'),
    },
    {
      target: path.join(rootDir, 'dist', 'cjs', 'modules', 'createDOMProps', 'index.js'),
      patched: path.join(__dirname, '..', '..', 'patches', '18', 'createDOMProps.cjs.js'),
    },
  ]

  for (const { target, patched } of patches) {
    const patchedSrc = fs.readFileSync(patched, 'utf-8')
    if (fs.readFileSync(target, 'utf-8') !== patchedSrc) {
      // fs.moveSync(target, `${target}.bak`) // could exist already and fail
      fs.writeFileSync(target, patchedSrc)
      console.log(`      | patched `, path.relative(rootDir, target))
    }
  }
}

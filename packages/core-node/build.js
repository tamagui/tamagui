#!/usr/bin/env node

const watch = process.argv.includes('--watch')
const fs = require('fs-extra')
const esbuild = require('esbuild')
const alias = require('./esbuildAliasPlugin')
const _ = require('lodash')
const tmpDir = require('os').tmpdir()
const path = require('path')

async function build() {
  console.log('building core-node...')
  try {
    const outPath = path.join(tmpDir, 'core-node')
    await fs.remove(outPath)
    await fs.mkdir(outPath)
    const inPath = path.join(__dirname, '..', 'core', 'src', 'static.ts')
    await esbuild.build({
      bundle: true,
      entryPoints: [inPath],
      outdir: outPath,
      format: 'cjs',
      target: 'node16',
      platform: 'node',
      logLevel: 'warning',
      plugins: [
        alias({
          'react-native': require.resolve('@tamagui/fake-react-native'),
          'react-native-safe-area-context': require.resolve('@tamagui/fake-react-native'),
          'react-native-gesture-handler': require.resolve('@tamagui/proxy-worm'),
        }),
      ],
    })
    await Promise.allSettled([fs.remove('./dist'), fs.remove('./types')])
    await fs.copy(outPath, './dist')
    if (process.env.SKIP_TYPES !== '1') {
      await fs.copy('../core/types', './types')
    }
    // reset
    tries = 0
  } catch (err) {
    if (err.message.includes(`Plugin "alias" returned`)) {
      console.log(`Initial watch err, retry`)
      // could be our initial watch
      setTimeout(() => {
        buildretry()
      }, 1000)
      return
    }
    console.error('Error building core-node:', err.message)
  }
  console.log('...built core-node')
}

let tries = 0
let tm = null
async function buildretry() {
  tries++
  clearTimeout(tm)
  if (tries > 30) {
    console.error('Error! failed after 30 tries')
    return
  }
  try {
    await build()
  } catch (err) {
    console.log('err building', err.message, err.stack)
    tm = setTimeout(() => {
      buildretry()
    }, 1000)
  }
}

if (watch) {
  const chokidar = require('chokidar')
  const builddbc = _.debounce(buildretry, 500)

  chokidar
    // prevent infinite loop but cause race condition if you just build directly
    .watch(['../core/dist', '../static/dist'], {
      persistent: true,
      alwaysStat: true,
      ignoreInitial: true,
    })
    .on('change', builddbc)
    .on('add', builddbc)
} else {
  buildretry()
}

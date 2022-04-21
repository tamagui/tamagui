#!/usr/bin/env node

const watch = process.argv.includes('--watch')
const fs = require('fs-extra')
const exec = require('execa')
const esbuild = require('esbuild')
const alias = require('esbuild-plugin-alias')
const _ = require('lodash')

async function build() {
  console.log('building core-node...')
  try {
    await fs.remove('dist')
    await exec('yarn', ['ttsc', '--skipLibCheck', '--skipDefaultLibCheck'])
    await esbuild.build({
      bundle: true,
      entryPoints: ['./dist/core/src/static.js'],
      outdir: 'dist',
      format: 'cjs',
      target: 'node16',
      plugins: [
        alias({
          'react-native': '@tamagui/proxy-worm',
        }),
      ],
    })
    await fs.remove('dist/core')
    await fs.copy('../core/types', './types')
  } catch (err) {
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
    console.error('failed after 30 tries')
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
    .watch('../core/dist', {
      persistent: true,
      alwaysStat: true,
      ignoreInitial: true,
    })
    .on('change', builddbc)
    .on('add', builddbc)
} else {
  buildretry()
}

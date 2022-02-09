#!/usr/bin/env node

const watch = process.argv.includes('--watch')
const fs = require('fs-extra')
const exec = require('execa')
const _ = require('lodash')
const path = require('path')

async function build() {
  console.log('building core-node...')
  try {
    await fs.remove('dist')
    await exec('npx', ['ttsc', '--skipLibCheck', '--skipDefaultLibCheck'])
    await fs.copyFile(
      path.join(__dirname, '../core/src/tamagui-base.css'),
      path.join(__dirname, './dist/core/src/tamagui-base.css')
    )
    await exec('npx', [
      'esbuild',
      '--bundle',
      '--outdir=dist',
      '--format=cjs',
      '--target=node16',
      './dist/core/src/static.js',
    ])
    await fs.remove('dist/core')
  } catch (err) {
    console.error('Error building core-node:', err.message)
  }
  console.log('...built core-node')
}

if (watch) {
  const chokidar = require('chokidar')
  const builddbc = _.debounce(build, 500)

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
  build()
}

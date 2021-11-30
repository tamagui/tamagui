#!/usr/bin/env node

const watch = process.argv.includes('--watch')
const fs = require('fs-extra')
const exec = require('execa')
const _ = require('lodash')
const fg = require('fast-glob')

async function build() {
  console.log('building core-node...')
  await fs.remove('dist')
  await exec('npx', ['ttsc', '--skipLibCheck', '--skipDefaultLibCheck'])
  await exec('npx', [
    'esbuild',
    '--bundle',
    '--outdir=dist',
    '--format=cjs',
    '--target=node16',
    './dist/core/src/static.js',
  ])
  await fs.remove('dist/core')
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

#!/usr/bin/env node

const { spawnSync } = require('node:child_process')
const { getTypeScriptNativePath } = require('./typescript-native')

const result = spawnSync(getTypeScriptNativePath(), process.argv.slice(2), {
  stdio: 'inherit',
})

if (result.error) {
  throw result.error
}

process.exitCode = result.status ?? 1

#!/usr/bin/env node

const { spawnSync } = require('node:child_process')
const { getTypeScriptPath } = require('./typescript-path')

const result = spawnSync(
  process.execPath,
  [getTypeScriptPath(), ...process.argv.slice(2)],
  {
    stdio: 'inherit',
  }
)

if (result.error) {
  throw result.error
}

process.exitCode = result.status ?? 1

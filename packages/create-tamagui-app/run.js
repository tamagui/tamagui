#!/usr/bin/env node

const command = require.resolve('create-tamagui-app')
const args = process.argv.slice(2)

require('child_process').execSync(`node -r esbuild-register ${command} ${args.join(' ')}`, {
  stdio: 'inherit',
})

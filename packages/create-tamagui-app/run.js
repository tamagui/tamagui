#!/usr/bin/env node

const command = require.resolve('create-tamagui-app')
const args = process.argv.slice(process.argv.findIndex((x) => x.includes('create-tamagui-app')))

require('child_process').execSync(`node ${command} ${args.join(' ')}`, {
  stdio: 'inherit',
})

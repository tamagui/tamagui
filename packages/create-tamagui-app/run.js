#!/usr/bin/env node

const path = require('path')

require('child_process').execSync(`node ${path.join(__dirname, 'dist', 'cjs', 'index.js')}`, {
  stdio: 'inherit',
})

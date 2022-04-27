#!/usr/bin/env node

const path = require('path')

require('child_process').execSync('node index.js', {
  cwd: path.join(__dirname, 'dist'),
  stdio: 'inherit',
})

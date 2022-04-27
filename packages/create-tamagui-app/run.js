#!/usr/bin/env node

require('child_process').execSync('node dist/index.js', {
  stdio: 'inherit',
})

#!/usr/bin/env node

require('child_process').execSync('yarn ts-node index.ts', {
  stdio: 'inherit',
})

#!/usr/bin/env node

require('child_process').execSync('npx ts-node index.ts', {
  stdio: 'inherit',
})

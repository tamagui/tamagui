#!/usr/bin/env node

import { execSync, spawnSync } from 'node:child_process'

// we run this manually in test-ios-native
if (process.env.CI) {
  console.info('Skipping native tests in CI')
  process.exit(0)
}

const which = spawnSync('which', ['maestro'], { encoding: 'utf-8' })
if (which.status !== 0) {
  console.info(`
⚠️  Maestro not found. Install: curl -Ls https://get.maestro.mobile.dev | bash
   Add to PATH: export PATH="$HOME/.maestro/bin:$PATH"
`)
  process.exit(1)
}

try {
  execSync('maestro test ./flows --exclude-tags=util', {
    stdio: 'inherit',
    cwd: import.meta.dirname,
  })
} catch (e) {
  process.exit(1)
}

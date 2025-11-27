#!/usr/bin/env node

/**
 * Native test runner that skips in CI environments.
 * In CI, native tests are run by separate workflows.
 */

if (process.env.CI) {
  console.log('Skipping native tests in CI (handled by separate workflow)')
  process.exit(0)
}

import { execSync } from 'node:child_process'

try {
  execSync('yarn test:native:ios', { stdio: 'inherit' })
} catch (error) {
  process.exit(1)
}

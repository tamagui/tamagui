#!/usr/bin/env node

/**
 * Generate native fingerprint for iOS or Android.
 * Used in CI to create cache keys based on actual native dependencies.
 *
 * Usage:
 *   node scripts/get-fingerprint.mjs ios
 *   node scripts/get-fingerprint.mjs android
 */

import { execSync } from 'node:child_process'

const platform = process.argv[2]

if (!platform || !['ios', 'android'].includes(platform)) {
  console.error('Usage: node scripts/get-fingerprint.mjs <ios|android>')
  process.exit(1)
}

try {
  const result = execSync(`npx @expo/fingerprint fingerprint:generate --platform ${platform}`, {
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  })

  const fingerprint = JSON.parse(result)
  console.log(fingerprint.hash)
} catch (error) {
  console.error('Failed to generate fingerprint:', error.message)
  process.exit(1)
}

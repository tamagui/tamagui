#!/usr/bin/env node

/**
 * Test fingerprint-based caching locally.
 *
 * This script helps verify that @expo/fingerprint correctly detects
 * native dependency changes that would require a rebuild.
 *
 * Usage:
 *   node scripts/test-fingerprint-caching.mjs
 *
 * To test cache invalidation:
 *   1. Run this script to get current fingerprints
 *   2. Add a native dependency: yarn add react-native-mmkv
 *   3. Run this script again - fingerprints should change
 *   4. Remove the dependency: yarn remove react-native-mmkv
 *   5. Run this script again - fingerprints should match original
 */

import { execSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const CACHE_FILE = join(process.cwd(), '.fingerprint-cache.json')

function getFingerprint(platform) {
  try {
    const result = execSync(
      `npx @expo/fingerprint fingerprint:generate --platform ${platform}`,
      { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
    )
    return JSON.parse(result).hash
  } catch (error) {
    console.error(`Failed to get ${platform} fingerprint:`, error.message)
    return null
  }
}

function loadCache() {
  if (existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(readFileSync(CACHE_FILE, 'utf-8'))
    } catch {
      return null
    }
  }
  return null
}

function saveCache(data) {
  writeFileSync(CACHE_FILE, JSON.stringify(data, null, 2))
}

console.log('🔍 Generating fingerprints...\n')

const iosFingerprint = getFingerprint('ios')
const androidFingerprint = getFingerprint('android')

console.log('Current fingerprints:')
console.log(`  iOS:     ${iosFingerprint}`)
console.log(`  Android: ${androidFingerprint}`)
console.log('')

const cache = loadCache()

if (cache) {
  console.log('Previous fingerprints (from cache):')
  console.log(`  iOS:     ${cache.ios}`)
  console.log(`  Android: ${cache.android}`)
  console.log('')

  const iosChanged = cache.ios !== iosFingerprint
  const androidChanged = cache.android !== androidFingerprint

  if (iosChanged || androidChanged) {
    console.log('⚠️  Fingerprints changed!')
    if (iosChanged) console.log('   - iOS fingerprint changed (would trigger iOS rebuild)')
    if (androidChanged) console.log('   - Android fingerprint changed (would trigger Android rebuild)')
  } else {
    console.log('✅ Fingerprints match - no rebuild needed')
  }
} else {
  console.log('ℹ️  No previous fingerprints cached.')
}

// Save current fingerprints
saveCache({ ios: iosFingerprint, android: androidFingerprint, timestamp: new Date().toISOString() })
console.log(`\n📝 Saved fingerprints to ${CACHE_FILE}`)

console.log(`
To test cache invalidation:
  1. Add a native dependency:    yarn add react-native-mmkv
  2. Run this script again:      node scripts/test-fingerprint-caching.mjs
  3. Fingerprints should change!
  4. Remove the dependency:      yarn remove react-native-mmkv
  5. Run this script again - fingerprints should match original
`)

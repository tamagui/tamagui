#!/usr/bin/env node
import { mkdirSync } from 'node:fs'
import { existsSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const BENTO_PATH = resolve(__dirname, '../../../../bento')
const HELPERS_DIST_PATH = resolve(__dirname, '../helpers/dist')
const hasBento = existsSync(BENTO_PATH)

if (!hasBento) {
  console.error('❌ ERROR: Bento repository not found at ../bento')
  console.error('   Please clone the bento repository as a sibling to tamagui:')
  console.error('   cd .. && git clone <bento-repo-url> bento')
  process.exit(1)
}

console.info('✅ Found ../bento')

// Ensure dist exists
mkdirSync(HELPERS_DIST_PATH, { recursive: true })

// Generate bento-proxy.ts using alias that works in both dev and build
writeFileSync(
  resolve(HELPERS_DIST_PATH, 'bento-proxy.ts'),
  `export * from '@tamagui/bento/raw'
export { useCurrentRouteParams } from '@tamagui/bento/provider'
export * as Data from '../../components/bento-showcase/data'
export * as Sections from '../../components/bento-showcase/sections'
`
)

writeFileSync(
  resolve(HELPERS_DIST_PATH, 'bento-proxy-data.ts'),
  `export * from '../../components/bento-showcase/data'\n`
)

console.info('✅ Generated bento proxy')

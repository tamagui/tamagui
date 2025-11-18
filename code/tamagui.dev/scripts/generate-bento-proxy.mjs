#!/usr/bin/env node
import { mkdirSync } from 'node:fs'
import { existsSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const BENTO_PATH = resolve(__dirname, '../../../../bento')
const HELPERS_DIST_PATH = resolve(__dirname, '../helpers/dist')
const hasBento = existsSync(BENTO_PATH)

console.info(hasBento ? '✅ Found ../bento' : '⚠️  ../bento not found - using stubs')

// Ensure dist exists
mkdirSync(HELPERS_DIST_PATH, { recursive: true })

// Generate bento-proxy.ts
if (hasBento) {
  writeFileSync(
    resolve(HELPERS_DIST_PATH, 'bento-proxy.ts'),
    `export * from '../../../bento/src/index'
export { useCurrentRouteParams } from '../../../bento/src/components/provider/CurrentRouteProvider'
export * as Data from '../../components/bento-showcase/data'
export * as Sections from '../../components/bento-showcase/sections'
`
  )
} else {
  writeFileSync(
    resolve(HELPERS_DIST_PATH, 'bento-proxy.ts'),
    `// Stubs when bento not available
export const CurrentRouteProvider = ({ children }: any) => children
export const Components = {}
export const Data = { paths: [] }
export const Sections = {}
export const useCurrentRouteParams = () => ({})
`
  )
}

writeFileSync(
  resolve(HELPERS_DIST_PATH, 'bento-proxy-data.ts'),
  `export * from '../../components/bento-showcase/data'\n`
)

console.info('✅ Generated bento proxy')

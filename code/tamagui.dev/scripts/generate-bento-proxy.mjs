import { mkdirSync } from 'node:fs'
import { existsSync, writeFileSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Generate bento proxy files based on whether the bento repo is available.
 * Can be called from vite config or run directly as a script.
 *
 * @param {Object} options
 * @param {string} options.basePath - Base path for resolution (defaults to script directory)
 * @param {boolean} options.silent - Suppress console output
 * @returns {{ hasBento: boolean }} - Whether bento repo was found
 */
export function generateBentoProxy(options = {}) {
  const { basePath = __dirname, silent = false } = options

  const BENTO_PATH = resolve(basePath, '../../../../bento')
  const HELPERS_DIST_PATH = resolve(basePath, '../helpers/dist')
  const hasBento = existsSync(BENTO_PATH)

  // Ensure dist exists
  mkdirSync(HELPERS_DIST_PATH, { recursive: true })

  const proxyPath = resolve(HELPERS_DIST_PATH, 'bento-proxy.ts')
  const existingContent = existsSync(proxyPath) ? readFileSync(proxyPath, 'utf-8') : ''
  const isStub = existingContent.includes('Stub file for when bento is not available')
  const hasCurrentRouteProvider = existingContent.includes('CurrentRouteProvider')

  // Skip if already generated with correct state and has all exports
  if (existingContent && isStub === !hasBento && hasCurrentRouteProvider) {
    return { hasBento }
  }

  if (!hasBento) {
    // Generate stub proxy files for when bento is not available
    // Bento is optional (pro users only) - /bento pages will show placeholders
    writeFileSync(
      proxyPath,
      `// Stub file for when bento is not available
// Bento is optional and only needed for pro features - /bento pages will not work without it
export * as Data from '../../components/bento-showcase/data'
export * as Sections from '../../components/bento-showcase/sections'

// Stub useCurrentRouteParams hook
export function useCurrentRouteParams() {
  return {}
}

// Stub CurrentRouteProvider component (just renders children)
export function CurrentRouteProvider({ children }: { children: React.ReactNode; section?: string; part?: string }) {
  return children
}
`
    )

    writeFileSync(
      resolve(HELPERS_DIST_PATH, 'bento-proxy-data.ts'),
      `export * from '../../components/bento-showcase/data'\n`
    )

    if (!silent) {
      console.info('Bento not found - /bento pages will not work (optional, pro users only)')
    }
  } else {
    // Generate bento-proxy.ts using alias that works in both dev and build
    writeFileSync(
      proxyPath,
      `export * from '@tamagui/bento/raw'
export { useCurrentRouteParams, CurrentRouteProvider } from '@tamagui/bento/provider'
export * as Data from '../../components/bento-showcase/data'
export * as Sections from '../../components/bento-showcase/sections'
`
    )

    writeFileSync(
      resolve(HELPERS_DIST_PATH, 'bento-proxy-data.ts'),
      `export * from '../../components/bento-showcase/data'\n`
    )

    if (!silent) {
      console.info('Generated bento proxy with full bento support')
    }
  }

  return { hasBento }
}

// Run if called directly (postinstall script)
const isMain = import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/') || '')
  || process.argv[1]?.endsWith('generate-bento-proxy.mjs')
if (isMain) {
  generateBentoProxy()
}

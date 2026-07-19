import { execSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { existsSync, writeFileSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Optional ref pinning. bento's v3 migration lives on the `v3` branch until it
 * merges to bento main alongside the tamagui v3 cutover at release. The v3-beta
 * tamagui.dev deployment sets `TAMAGUI_BENTO_REF=v3` so it builds bento v3, while
 * the main (v2.4.x) site keeps building bento main untouched. Best-effort: on a
 * non-git path or a checkout error it logs and leaves the checkout as-is.
 */
function pinBentoRef(bentoPath, silent) {
  const ref = process.env.TAMAGUI_BENTO_REF
  if (!bentoPath || !ref || !existsSync(resolve(bentoPath, '.git'))) return
  try {
    execSync(`git -C "${bentoPath}" fetch --quiet origin ${ref}`, { stdio: 'pipe' })
    execSync(`git -C "${bentoPath}" checkout --quiet ${ref}`, { stdio: 'pipe' })
    if (!silent) console.info(`Pinned bento to ref "${ref}" at ${bentoPath}`)
  } catch (e) {
    if (!silent)
      console.warn(`Could not pin bento to TAMAGUI_BENTO_REF="${ref}": ${e.message}`)
  }
}

/**
 * Resolve the optional bento repo. Bento is a sibling checkout (pro features
 * only). The normal `~/tamagui` checkout finds it via the sibling-relative
 * path, but git worktrees (e.g. `~/.worktrees/tamagui-main`) break that
 * relative path, so we also check `$TAMAGUI_BENTO_PATH` and `~/bento`.
 *
 * @param {string} basePath - Base path for sibling resolution (script dir)
 * @returns {string | null} - Absolute path to the bento repo, or null
 */
export function resolveBentoPath(basePath = __dirname) {
  const candidates = [
    process.env.TAMAGUI_BENTO_PATH,
    resolve(basePath, '../../../../bento'),
    resolve(homedir(), 'bento'),
  ]
  for (const candidate of candidates) {
    if (candidate && existsSync(candidate)) {
      return candidate
    }
  }
  return null
}

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

  const BENTO_PATH = resolveBentoPath(basePath)
  const HELPERS_DIST_PATH = resolve(basePath, '../helpers/dist')
  const hasBento = !!BENTO_PATH

  // Ensure dist exists
  mkdirSync(HELPERS_DIST_PATH, { recursive: true })

  const proxyPath = resolve(HELPERS_DIST_PATH, 'bento-proxy.ts')
  const existingContent = existsSync(proxyPath) ? readFileSync(proxyPath, 'utf-8') : ''
  const isStub = existingContent.includes('Stub file for when bento is not available')
  const hasCurrentRouteProvider = existingContent.includes('CurrentRouteProvider')

  // Skip if already generated with correct state and has all exports
  if (existingContent && isStub === !hasBento && hasCurrentRouteProvider) {
    return { hasBento, bentoPath: BENTO_PATH }
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
      console.info(
        'Bento not found - /bento pages will not work (optional, pro users only)'
      )
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

  return { hasBento, bentoPath: BENTO_PATH }
}

// Run if called directly (postinstall script)
const isMain =
  import.meta.url.endsWith(process.argv[1]?.replace(/\\/g, '/') || '') ||
  process.argv[1]?.endsWith('generate-bento-proxy.mjs')
if (isMain) {
  generateBentoProxy()
}

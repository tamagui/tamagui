// The end-to-end size gate for the contract-compliant starter.
//
// Each integration is qualified INDEPENDENTLY, twice: base support with no
// declared island, and island support with one. A failure in one integration
// never blocks another and the numbers are never blended, because a blended
// number would describe an app nobody built.
//
// Every figure here comes from a build that actually ran. The graph receipts
// the plugins emit carry the forbidden-module list, the Tamagui module list and
// the JavaScript gzip; the bridge receipts carry the CSS gzip and the artifact
// identity.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const zeroDir = path.join(root, '.tamagui/zero')

const run = (command, args, env = {}) => {
  try {
    return {
      ok: true,
      output: execFileSync(command, args, {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'production', ...env },
        // Metro logs and then sits forever when transformer construction fails
        timeout: 15 * 60 * 1000,
        killSignal: 'SIGKILL',
      }),
    }
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ''}${error.stderr ?? ''}` }
  }
}

const read = (file) => JSON.parse(readFileSync(path.join(zeroDir, file), 'utf8'))

/**
 * Byte figures come from the emitted files, not from the plugins' own
 * bookkeeping: each integration reports a different subset there, and a table
 * whose columns were measured three different ways is not a comparison.
 */
const gzipOf = (file) =>
  existsSync(file) ? gzipSync(readFileSync(file), { level: 9 }).length : null

const walk = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name)
        return entry.isDirectory() ? walk(full) : [full]
      })
    : []

const gzipOfAll = (files) => files.reduce((total, file) => total + (gzipOf(file) ?? 0), 0)

const vite = (islands) =>
  run('npx', ['vite', 'build', '--outDir', islands ? 'dist-vite' : 'dist-vite-base'], {
    ...(islands ? {} : { TAMAGUI_ZERO_ISLANDS: '0' }),
  })

const next = (islands) =>
  run('npx', ['next', 'build', '--webpack'], {
    NEXT_TELEMETRY_DISABLED: '1',
    ...(islands ? {} : { TAMAGUI_ZERO_ISLANDS: '0' }),
  })

const metro = (islands) => {
  // metro writes the bundle with a plain writeFile and does not create the
  // directory first
  mkdirSync(path.join(root, islands ? 'dist-metro' : 'dist-metro-base'), {
    recursive: true,
  })
  if (islands) {
    mkdirSync(path.join(root, 'public-metro/tamagui-islands'), { recursive: true })
    const island = run(
      'npx',
      [
        'metro',
        'build',
        '.tamagui/zero/DetailsIsland.entry.js',
        '--out',
        'public-metro/tamagui-islands/DetailsIsland.js',
        '--platform',
        'web',
        '--dev',
        'false',
        '--config',
        'metro.config.cjs',
      ],
      { TAMAGUI_ZERO_ISLAND: 'DetailsIsland' }
    )
    if (!island.ok) return island
  }
  return run(
    'npx',
    [
      'metro',
      'build',
      islands ? 'src/main.tsx' : 'src/main.base.tsx',
      '--out',
      islands ? 'dist-metro/main.js' : 'dist-metro-base/main.js',
      '--platform',
      'web',
      '--dev',
      'false',
      '--config',
      'metro.config.cjs',
    ],
    islands ? {} : { TAMAGUI_ZERO_ISLANDS: '0' }
  )
}

const INTEGRATIONS = {
  vite: {
    build: vite,
    graph: (islands) => (islands ? 'vite-dist-vite' : 'vite-dist-vite-base'),
    js: (islands) =>
      walk(
        path.join(root, islands ? 'dist-vite/assets' : 'dist-vite-base/assets')
      ).filter((file) => file.endsWith('.js')),
    css: (islands) =>
      path.join(root, islands ? 'dist-vite' : 'dist-vite-base', 'tamagui-zero.css'),
    island: () => path.join(root, 'dist-vite/tamagui-islands/DetailsIsland.js'),
  },
  'next-webpack': {
    build: next,
    graph: () => 'next-zero',
    // every chunk the built page loads: the framework, main, webpack runtime
    // and polyfill chunks plus _app and the page itself. `_error` is the only
    // route this project does not render.
    js: (islands) =>
      walk(path.join(root, islands ? '.next/static/chunks' : '.next-base/static/chunks'))
        .filter((file) => file.endsWith('.js'))
        .filter((file) => !path.basename(file).startsWith('_error')),
    css: () => path.join(root, 'public/tamagui-zero.css'),
    island: () => path.join(root, 'public/tamagui-islands/DetailsIsland.js'),
  },
  'metro-web': {
    build: metro,
    graph: () => 'metro-zero',
    js: (islands) => [
      path.join(root, islands ? 'dist-metro/main.js' : 'dist-metro-base/main.js'),
    ],
    css: () => path.join(root, 'public-metro/tamagui-zero.css'),
    island: () => path.join(root, 'public-metro/tamagui-islands/DetailsIsland.js'),
  },
}

const receipts = {}

for (const [name, integration] of Object.entries(INTEGRATIONS)) {
  receipts[name] = {}
  for (const islands of [false, true]) {
    const tier = islands ? 'islands' : 'base'
    const built = integration.build(islands)
    if (!built.ok) {
      receipts[name][tier] = { built: false, failure: built.output.slice(-4000) }
      continue
    }
    const prefix = integration.graph(islands)
    const graph = read(`${prefix}.graph.json`)
    const bridges = read(`${prefix}.bridges.json`)
    const violations = existsSync(path.join(zeroDir, `${prefix}.violations.json`))
      ? read(`${prefix}.violations.json`).count
      : 0
    receipts[name][tier] = {
      built: true,
      compilerViolations: violations,
      forbiddenModules: graph.forbidden.length,
      forbidden: graph.forbidden,
      tamaguiModules: graph.tamaguiModules,
      moduleCount: graph.moduleCount,
      jsGzip: gzipOfAll(integration.js(islands)),
      jsFiles: integration.js(islands).map((file) => path.relative(root, file)),
      cssGzip: gzipOf(integration.css(islands)),
      // the island is a separate download that only a user interaction pulls,
      // so it is never folded into the page's JavaScript figure
      islandJsGzip: islands ? gzipOf(integration.island()) : null,
      identity: bridges.identity,
      bridges: Object.keys(bridges.bridges ?? {}),
    }
  }
}

writeFileSync(path.join(root, 'receipts.json'), `${JSON.stringify(receipts, null, 2)}\n`)
console.info(JSON.stringify(receipts, null, 2))

const unqualified = Object.entries(receipts).flatMap(([name, tiers]) =>
  Object.entries(tiers)
    .filter(
      ([, tier]) =>
        !tier.built || tier.forbiddenModules > 0 || tier.compilerViolations > 0
    )
    .map(([tierName]) => `${name}/${tierName}`)
)
if (unqualified.length) {
  throw new Error(`unqualified: ${unqualified.join(', ')}`)
}

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
const baselinePath = path.join(root, 'size-baseline.json')
const updateBaseline = process.argv.includes('--update-baseline')
const requiredNodeVersion = readFileSync(
  path.join(root, '../../../.node-version'),
  'utf8'
).trim()
const actualNodeVersion = process.version.replace(/^v/, '')

if (process.argv.length > (updateBaseline ? 3 : 2)) {
  console.error('Usage: measure.mjs [--update-baseline]')
  process.exit(1)
}

if (actualNodeVersion !== requiredNodeVersion) {
  throw new Error(
    `Node version mismatch: .node-version requires ${requiredNodeVersion}, current process is ${actualNodeVersion}. Bundle gzip bytes depend on Node's bundled zlib, so use the pinned Node version before checking or updating size-baseline.json.`
  )
}

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

// these are emitted-code signatures, not source checks. each signature is a
// stable production string owned by a family forbidden outside the island.
const ARTIFACT_FAMILY_SIGNATURES = {
  atomicCSSGeneration: ['--t-x:0px;--t-y:0px', '--t-scale-x:1;--t-scale-y:1'],
  cssInsertion: ['TAMAGUI_STYLE_INSERT'],
  runtimeThemeCSS: ['tvar_'],
  parseValue: ['is not a registered modifier'],
}

const inspectBuiltContent = (files) => {
  const content = files
    .filter(existsSync)
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n')
  return Object.fromEntries(
    Object.entries(ARTIFACT_FAMILY_SIGNATURES).map(([family, signatures]) => [
      family,
      signatures.some((signature) => content.includes(signature)),
    ])
  )
}

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
    const jsFiles = integration.js(islands)
    const islandFile = islands ? integration.island() : null
    receipts[name][tier] = {
      built: true,
      compilerViolations: violations,
      forbiddenModules: graph.forbidden.length,
      forbidden: graph.forbidden,
      tamaguiModules: graph.tamaguiModules,
      moduleCount: graph.moduleCount,
      jsGzip: gzipOfAll(jsFiles),
      jsFiles: jsFiles.map((file) => path.relative(root, file)),
      cssGzip: gzipOf(integration.css(islands)),
      // the island is a separate download that only a user interaction pulls,
      // so it is never folded into the page's JavaScript figure
      islandJsGzip: islandFile ? gzipOf(islandFile) : null,
      artifactFamilies: {
        page: inspectBuiltContent(jsFiles),
        island: islandFile ? inspectBuiltContent([islandFile]) : null,
      },
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

const artifactFailures = []
for (const [name, tiers] of Object.entries(receipts)) {
  for (const [tierName, tier] of Object.entries(tiers)) {
    if (!tier.built) continue
    for (const [family, present] of Object.entries(tier.artifactFamilies.page)) {
      if (present) artifactFailures.push(`${name}/${tierName} page retains ${family}`)
    }
    if (tierName === 'islands') {
      const island = tier.artifactFamilies.island
      if (!Number.isFinite(tier.islandJsGzip) || tier.islandJsGzip <= 0) {
        artifactFailures.push(
          `${name}/${tierName} is missing its separately emitted island JavaScript`
        )
      }
      if (!tier.bridges.includes('DetailsIsland')) {
        artifactFailures.push(`${name}/${tierName} is missing the DetailsIsland bridge`)
      }
      for (const [family, present] of Object.entries(island ?? {})) {
        if (present) {
          artifactFailures.push(`${name}/${tierName} island retains ${family}`)
        }
      }
    }
  }
}

if (artifactFailures.length) {
  throw new Error(
    `Built-content specialization failed:\n${artifactFailures
      .map((failure) => `- ${failure}`)
      .join('\n')}`
  )
}

if (unqualified.length) {
  throw new Error(`unqualified: ${unqualified.join(', ')}`)
}

const sizeMetrics = ['jsGzip', 'cssGzip', 'islandJsGzip']

if (updateBaseline) {
  const previous = existsSync(baselinePath)
    ? JSON.parse(readFileSync(baselinePath, 'utf8'))
    : {
        thresholds: { jsGzip: 0, cssGzip: 0, islandJsGzip: 0 },
      }
  const baseline = {}
  for (const [name, tiers] of Object.entries(receipts)) {
    baseline[name] = {}
    for (const [tierName, tier] of Object.entries(tiers)) {
      baseline[name][tierName] = Object.fromEntries(
        sizeMetrics.map((metric) => [metric, tier[metric]])
      )
    }
  }
  writeFileSync(
    baselinePath,
    `${JSON.stringify(
      {
        measuredAtCommit: execFileSync('git', ['rev-parse', 'HEAD'], {
          cwd: root,
          encoding: 'utf8',
        }).trim(),
        nodeVersion: requiredNodeVersion,
        compression: "Node gzipSync level 9; output depends on Node's bundled zlib",
        thresholds: previous.thresholds,
        baseline,
      },
      null,
      2
    )}\n`
  )
  console.info(`Updated committed size baseline: ${path.relative(root, baselinePath)}`)
} else {
  if (!existsSync(baselinePath)) {
    throw new Error(
      'Missing committed size baseline. Run `node scripts/measure.mjs --update-baseline` and commit size-baseline.json.'
    )
  }
  const expected = JSON.parse(readFileSync(baselinePath, 'utf8'))
  if (expected.nodeVersion !== requiredNodeVersion) {
    throw new Error(
      `Baseline Node version mismatch: size-baseline.json records ${expected.nodeVersion ?? 'no version'}, but .node-version requires ${requiredNodeVersion}. Regenerate it with \`node scripts/measure.mjs --update-baseline\` under the pinned Node version.`
    )
  }
  const failures = []
  for (const [name, tiers] of Object.entries(receipts)) {
    for (const [tierName, tier] of Object.entries(tiers)) {
      for (const metric of sizeMetrics) {
        const actual = tier[metric]
        const baseline = expected.baseline?.[name]?.[tierName]?.[metric]
        const threshold = expected.thresholds?.[metric]
        if (actual === null && baseline === null) continue
        if (
          !Number.isFinite(actual) ||
          !Number.isFinite(baseline) ||
          !Number.isFinite(threshold)
        ) {
          failures.push(
            `${name}/${tierName} ${metric}: expected ${baseline ?? 'missing'} bytes, actual ${actual ?? 'missing'} bytes, threshold ${Number.isFinite(threshold) ? `+${threshold} bytes` : 'missing'}`
          )
          continue
        }
        if (actual > baseline + threshold) {
          failures.push(
            `${name}/${tierName} ${metric}: expected ${baseline} bytes, actual ${actual} bytes, threshold +${threshold} bytes (max ${baseline + threshold} bytes)`
          )
        }
      }
    }
  }
  if (failures.length) {
    throw new Error(
      `Size baseline exceeded:\n${failures.map((failure) => `- ${failure}`).join('\n')}\nIf the growth is intentional, run \`node scripts/measure.mjs --update-baseline\` and commit size-baseline.json.`
    )
  }
  console.info(
    `Size baseline passed (${path.relative(root, baselinePath)}; thresholds: ${sizeMetrics.map((metric) => `${metric} +${expected.thresholds[metric]} bytes`).join(', ')})`
  )
}

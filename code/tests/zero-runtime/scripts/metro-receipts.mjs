// Records the Phase 1 zero-runtime receipts for the Metro web integration.
//
// Metro has no sub-compilation concept, so an island is a second bundle
// REQUEST: it is built first, leaves its CSS fragment on disk, and the zero
// build finalizes the one artifact from those fragments plus its own rules.
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hashZeroIdentity } from '@tamagui/static'
import { assertMultiFileRules } from './multiFileRules.mjs'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const zeroDir = path.join(root, '.tamagui/zero')

function bundle(entry, out, env = {}) {
  mkdirSync(path.dirname(path.join(root, out)), { recursive: true })
  try {
    const stdout = execFileSync(
      'npx',
      [
        'metro',
        'build',
        entry,
        '--out',
        out,
        '--platform',
        'web',
        '--dev',
        'false',
        '--config',
        'metro.config.cjs',
      ],
      {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, NODE_ENV: 'production', ...env },
        // Metro does not exit on its own when transformer construction fails:
        // it logs, dies inside Bundler.end, and then sits forever. A bounded
        // build turns that into a reported failure instead of a hang.
        timeout: 10 * 60 * 1000,
        killSignal: 'SIGKILL',
      }
    )
    return { ok: true, output: stdout }
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ''}${error.stderr ?? ''}` }
  }
}

const buildIsland = () =>
  bundle(
    '.tamagui/zero/SheetIsland.entry.js',
    'public-metro/tamagui-islands/SheetIsland.js',
    {
      TAMAGUI_ZERO_ISLAND: 'SheetIsland',
    }
  )
const buildZero = (entry = 'src/metro-main.tsx') => bundle(entry, 'dist-metro/main.js')

const read = (file) => JSON.parse(readFileSync(path.join(zeroDir, file), 'utf8'))
const receipts = {}

// 1. the island bundle, then the zero bundle
const island = buildIsland()
if (!island.ok) throw new Error(`island bundle failed:\n${island.output}`)
const zero = buildZero()
if (!zero.ok) throw new Error(`zero bundle failed:\n${zero.output}`)
const zeroGraph = read('metro-zero.graph.json')
const zeroIdentity = read('metro-zero.bridges.json')
receipts.zero = {
  built: true,
  forbidden: zeroGraph.forbidden,
  tamaguiModules: zeroGraph.tamaguiModules,
  moduleCount: zeroGraph.moduleCount,
  gzip: zeroGraph.gzip,
  identity: zeroIdentity.identity,
  bridges: zeroIdentity.bridges,
}
if (zeroGraph.forbidden.length) throw new Error('zero bundle shipped forbidden modules')

// 2. the module-graph control: the runtime reached through a dynamic import, so
// the compiler-local accounting has no import declaration to attribute
const negative = buildZero('src/negative-main.tsx')
const negativeGraph = read('metro-zero.graph.json')
receipts.negativeControl = {
  buildFailed: !negative.ok,
  forbidden: negativeGraph.forbidden.length,
  failureNamesForbiddenModule: negativeGraph.forbidden.every((entry) =>
    negative.output.includes(entry.id)
  ),
}
if (negative.ok) {
  throw new Error('the negative control built successfully; the graph check cannot fail')
}
if (!negativeGraph.forbidden.length) {
  throw new Error('the negative control reported no forbidden module')
}
if (!receipts.negativeControl.failureNamesForbiddenModule) {
  throw new Error('the negative control failure did not name every forbidden module')
}

// 2b. the compiler-local control: a static design-state read
const live = buildZero('src/live-reference.tsx')
receipts.liveReferenceControl = {
  buildFailed: !live.ok,
  reportedByCompiler: live.output.includes('Rule 7 zero/design-state-read'),
  namedTheBinding: live.output.includes(
    'Zero-runtime rule 7: getTokens reads Tamagui design state in JavaScript.'
  ),
}
if (live.ok) throw new Error('a live Tamagui reference built successfully')
if (!receipts.liveReferenceControl.reportedByCompiler) {
  throw new Error('a live Tamagui reference was not reported by the compiler gate')
}
if (!receipts.liveReferenceControl.namedTheBinding) {
  throw new Error('the live-reference control did not name the design-state API it read')
}

// 2c. every violating site in every module of the entry graph, collected before
// failing, in one deterministic order
const multi = buildZero('src/rules/multi.tsx')
const multiViolations = read('metro-zero.violations.json')
receipts.multiFileAggregation = {
  buildFailed: !multi.ok,
  mode: multiViolations.mode,
  violations: multiViolations.violations.map((violation) => ({
    file: violation.file,
    line: violation.line,
    column: violation.column,
    rule: violation.rule,
    code: violation.code,
  })),
}
if (multi.ok) throw new Error('the multi-file rule fixture built successfully')
assertMultiFileRules('metro', multiViolations.violations)

// report mode: the same control module, every analysis run, exits successfully
// its own out path so the enforcing zero bundle stays on disk for later steps
const multiReport = bundle('src/rules/multi.tsx', 'dist-metro-report/main.js', {
  TAMAGUI_ZERO_FIXTURE: 'report',
})
// both modes write the same hardcoded receipt name, so the report build
// overwrites the enforce one on disk. `multiViolations` was read before it ran,
// which is what makes the comparison below a comparison at all.
const multiReportViolations = read('metro-zero.violations.json')
// the read above only means anything if the report build wrote it. on the
// shared filename a report build that never reached analysis leaves the
// enforce file in place, and every assertion below then passes against the
// enforce build's own output.
if (multiReportViolations.mode !== 'report') {
  throw new Error(
    `metro report receipt is not the report build's: mode is ${multiReportViolations.mode}`
  )
}
receipts.reportMode = {
  exitedSuccessfully: multiReport.ok,
  enforceMode: multiViolations.mode,
  reportMode: multiReportViolations.mode,
  sameViolations:
    JSON.stringify(multiViolations.violations.map(({ file, ...rest }) => rest)) ===
    JSON.stringify(multiReportViolations.violations.map(({ file, ...rest }) => rest)),
}
if (!multiReport.ok) {
  throw new Error(`report mode did not exit successfully:\n${multiReport.output}`)
}
assertMultiFileRules('metro report', multiReportViolations.violations)
if (!receipts.reportMode.sameViolations) {
  throw new Error('report mode emitted a different violation list than enforce mode')
}

// 3. an illegal static import of a declared island
const illegal = buildZero('src/illegal-static.tsx')
receipts.illegalStaticImport = {
  buildFailed: !illegal.ok,
  message: illegal.output.includes('zero/static-island-import'),
  reportedRule8: illegal.output.includes('Rule 8 zero/static-island-import'),
  remediationIsTheLoader: illegal.output.includes(
    'Import the generated island loader instead'
  ),
}
if (illegal.ok) throw new Error('a static island import built successfully')
if (!receipts.illegalStaticImport.message) {
  throw new Error('the illegal static import did not report the zero-runtime rule')
}
if (!receipts.illegalStaticImport.reportedRule8) {
  throw new Error('the illegal island import control did not report rule 8')
}
if (!receipts.illegalStaticImport.remediationIsTheLoader) {
  throw new Error('the illegal island import control did not print rule 8 remediation')
}

// 4. cache identity
const islandFile = path.join(root, 'src/islands/SheetIsland.tsx')
const original = readFileSync(islandFile, 'utf8')
let perturbedIdentity
try {
  writeFileSync(islandFile, original.replace('width={137}', 'width={141}'))
  if (!buildIsland().ok) throw new Error('perturbed island bundle failed')
  const perturbed = buildZero()
  if (!perturbed.ok) throw new Error(`perturbed zero bundle failed:\n${perturbed.output}`)
  perturbedIdentity = read('metro-zero.bridges.json')
} finally {
  writeFileSync(islandFile, original)
}
if (!buildIsland().ok) throw new Error('restore island bundle failed')
const restored = buildZero()
if (!restored.ok) throw new Error(`restore zero bundle failed:\n${restored.output}`)

const base = zeroIdentity.identityInputs
const perturbations = {
  runtimeLiteral: { ...base, runtimeLiteral: 'full' },
  target: { ...base, target: 'native' },
  configGeneration: { ...base, configGeneration: `${base.configGeneration}x` },
  cssHash: { ...base, cssHash: `${base.cssHash}x` },
  compilerVersion: { ...base, compilerVersion: `${base.compilerVersion}x` },
  islandEntries: { ...base, islandEntries: [] },
  bridgeManifestHash: { ...base, bridgeManifestHash: `${base.bridgeManifestHash}x` },
  islandOutputHashes: { ...base, islandOutputHashes: {} },
}
const baseHash = hashZeroIdentity(base)
receipts.cacheIdentity = {
  baseHash,
  matchesBuild: baseHash === zeroIdentity.identity,
  islandStyleChangeInvalidates: perturbedIdentity.identity !== zeroIdentity.identity,
  perTupleMember: Object.fromEntries(
    Object.entries(perturbations).map(([member, inputs]) => [
      member,
      hashZeroIdentity(inputs) !== baseHash,
    ])
  ),
}
for (const [member, invalidates] of Object.entries(
  receipts.cacheIdentity.perTupleMember
)) {
  if (!invalidates)
    throw new Error(`identity member ${member} did not invalidate the cache`)
}
if (!receipts.cacheIdentity.islandStyleChangeInvalidates) {
  throw new Error('an island atomic CSS change did not change the artifact identity')
}
if (!receipts.cacheIdentity.matchesBuild) {
  throw new Error('the recorded identity does not match its own inputs')
}

// 5. the warm-cache path: a cold build scans and publishes, a warm build reuses
// those plans AND rehydrates the artifact from the sidecar published with them.
// Both halves matter. Identity stability alone would pass on a build that
// silently rescanned; plan reuse alone is the exact divergence Phase 1 found,
// where a warm build emitted an artifact missing every rule it never collected
// while still deriving TAMAGUI_DID_OUTPUT_CSS from it.
rmSync(path.join(root, 'node_modules/.cache/tamagui/metro-compiler'), {
  recursive: true,
  force: true,
})
const cold = buildZero()
if (!cold.ok) throw new Error(`cold rebuild failed:\n${cold.output}`)
const coldGraph = read('metro-zero.graph.json')
const coldIdentity = read('metro-zero.bridges.json')
const coldCSS = readFileSync(path.join(root, '.tamagui/zero/tamagui-zero.css'), 'utf8')

const warm = buildZero()
if (!warm.ok) throw new Error(`warm rebuild failed:\n${warm.output}`)
const warmGraph = read('metro-zero.graph.json')
const warmIdentity = read('metro-zero.bridges.json')

receipts.warmCacheRebuild = {
  coldBuildScanned: coldGraph.plansRestoredFromCache === false,
  warmBuildReusedPlans: warmGraph.plansRestoredFromCache === true,
  identityStable: warmIdentity.identity === coldIdentity.identity,
  bridgesStable:
    JSON.stringify(warmIdentity.bridges) === JSON.stringify(coldIdentity.bridges),
  artifactBytesStable:
    readFileSync(path.join(root, '.tamagui/zero/tamagui-zero.css'), 'utf8') === coldCSS,
  artifactCarriesIslandRule: coldCSS.includes('width:137px'),
  artifactCarriesZeroRule: coldCSS.includes('.is_View'),
}
if (!receipts.warmCacheRebuild.coldBuildScanned) {
  throw new Error('the cold build reported reused plans, so the receipt cannot fail')
}
if (!receipts.warmCacheRebuild.warmBuildReusedPlans) {
  throw new Error('the warm rebuild rescanned, so the warm path proves nothing')
}
if (!receipts.warmCacheRebuild.artifactCarriesIslandRule) {
  throw new Error('the cold artifact has no island rule, so stability proves nothing')
}
if (
  !receipts.warmCacheRebuild.identityStable ||
  !receipts.warmCacheRebuild.bridgesStable ||
  !receipts.warmCacheRebuild.artifactBytesStable
) {
  throw new Error('a warm rebuild changed the artifact')
}

writeFileSync(
  path.join(zeroDir, 'metro-receipts.json'),
  `${JSON.stringify(receipts, null, 2)}\n`
)
console.info(JSON.stringify(receipts, null, 2))

// Records the Phase 1 zero-runtime receipts for the Next/webpack integration.
//
// The control pages live outside `pages/` so they are not part of the normal
// build; each control copies exactly one of them in, builds, and removes it.
import { execFileSync } from 'node:child_process'
import { copyFileSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hashZeroIdentity } from '@tamagui/static'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const zeroDir = path.join(root, '.tamagui/zero')

function build(env = {}) {
  try {
    const stdout = execFileSync('npx', ['next', 'build', '--webpack'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1',
        ...env,
      },
    })
    return { ok: true, output: stdout }
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ''}${error.stderr ?? ''}` }
  }
}

// The zero tier's pages carry the `zero.tsx` extension, so a control page must
// too or `pageExtensions` leaves it out of the build entirely.

function buildWithControlPage(fixture, pageName) {
  const target = path.join(root, 'pages', pageName)
  copyFileSync(path.join(root, 'fixtures', fixture), target)
  try {
    return build()
  } finally {
    rmSync(target, { force: true })
  }
}

const read = (file) => JSON.parse(readFileSync(path.join(zeroDir, file), 'utf8'))
const receipts = {}

// 1. the zero build
const zero = build()
if (!zero.ok) throw new Error(`zero build failed:\n${zero.output}`)
const zeroGraph = read('next-zero.graph.json')
const zeroIdentity = read('next-zero.bridges.json')
receipts.zero = {
  built: true,
  forbidden: zeroGraph.forbidden,
  tamaguiModules: zeroGraph.tamaguiModules,
  moduleCount: zeroGraph.moduleCount,
  cssGzip: zeroGraph.gzip,
  identity: zeroIdentity.identity,
  bridges: zeroIdentity.bridges,
}
if (zeroGraph.forbidden.length) throw new Error('zero build shipped forbidden modules')

// the deterministic server placeholder, read straight out of the prerendered HTML
const html = readFileSync(path.join(root, '.next/server/pages/index.html'), 'utf8')
const bridgeId = Object.values(zeroIdentity.bridges)[0][0].id
receipts.serverHtml = {
  placeholder: html.includes(
    `<div data-tamagui-island="SheetIsland" data-tamagui-bridge="${bridgeId}"></div>`
  ),
  noIslandRuntimeMarkup: !html.includes('is_SheetContainer'),
  // one node carrying the theme class and the inline-value class, the same
  // composition the runtime Theme emits
  loweredZeroMarkup: html.includes(
    `class="t_dark is_Theme ${Object.values(zeroIdentity.bridges)[0][0].layers[0].inlineClassName}"`
  ),
}
for (const [key, value] of Object.entries(receipts.serverHtml)) {
  if (!value) throw new Error(`server HTML assertion ${key} failed`)
}

// 2. the negative control: the same graph check must fail
const negative = buildWithControlPage(
  'next-negative-control.tsx',
  'negative-control.zero.tsx'
)
const negativeGraph = read('next-zero.graph.json')
receipts.negativeControl = {
  buildFailed: !negative.ok,
  forbidden: negativeGraph.forbidden,
  failureContainsChain: negative.output.includes('opaqueDesignState'),
}
if (negative.ok) {
  throw new Error('the negative control built successfully; the graph check cannot fail')
}
if (!negativeGraph.forbidden.length) {
  throw new Error('the negative control reported no forbidden module')
}

// 2b. a live design-state read the compiler CAN see
const live = buildWithControlPage('next-live-reference.tsx', 'live-reference.zero.tsx')
receipts.liveReferenceControl = {
  buildFailed: !live.ok,
  reportedByCompiler: live.output.includes('zero/live-tamagui-reference'),
  namedTheBinding: live.output.includes('"getTokens"'),
}
if (live.ok) throw new Error('a live Tamagui reference built successfully')
if (!receipts.liveReferenceControl.reportedByCompiler) {
  throw new Error('a live Tamagui reference was not reported by the compiler gate')
}

// 3. an illegal static import of a declared island
const illegal = buildWithControlPage('next-illegal-static.tsx', 'illegal-static.zero.tsx')
receipts.illegalStaticImport = {
  buildFailed: !illegal.ok,
  message: illegal.output.includes('zero/static-island-import'),
}
if (illegal.ok) throw new Error('a static island import built successfully')
if (!receipts.illegalStaticImport.message) {
  throw new Error('the illegal static import did not report the zero-runtime rule')
}

// 4. cache identity: end-to-end for island atomic CSS, then per tuple member
const islandFile = path.join(root, 'src/islands/SheetIsland.tsx')
const original = readFileSync(islandFile, 'utf8')
let perturbedIdentity
try {
  writeFileSync(islandFile, original.replace('width={137}', 'width={141}'))
  const perturbed = build()
  if (!perturbed.ok) throw new Error(`perturbed zero build failed:\n${perturbed.output}`)
  perturbedIdentity = read('next-zero.bridges.json')
} finally {
  writeFileSync(islandFile, original)
}
const restored = build()
if (!restored.ok) throw new Error(`restore build failed:\n${restored.output}`)

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

// 5. the warm-cache path: a cold build runs every loader, a warm build reuses
// webpack's cached modules AND still emits the identical artifact. Both halves
// matter. Identity stability alone would pass on a build that ran every loader
// anyway; module reuse alone is the exact divergence Phase 1 found, where a warm
// build emitted an artifact missing every rule its loaders never collected while
// still deriving TAMAGUI_DID_OUTPUT_CSS from it.
rmSync(path.join(root, '.next'), { recursive: true, force: true })
const cold = build()
if (!cold.ok) throw new Error(`cold rebuild failed:\n${cold.output}`)
const coldGraph = read('next-zero.graph.json')
const coldIdentity = read('next-zero.bridges.json')
const coldCSS = readFileSync(path.join(root, '.tamagui/zero/tamagui-zero.css'), 'utf8')

const warm = build()
if (!warm.ok) throw new Error(`warm rebuild failed:\n${warm.output}`)
const warmGraph = read('next-zero.graph.json')
const warmIdentity = read('next-zero.bridges.json')

receipts.warmCacheRebuild = {
  coldBuildRanEveryLoader: coldGraph.plansRestoredFromCache === false,
  warmBuildReusedModules: warmGraph.plansRestoredFromCache === true,
  identityStable: warmIdentity.identity === coldIdentity.identity,
  bridgesStable:
    JSON.stringify(warmIdentity.bridges) === JSON.stringify(coldIdentity.bridges),
  artifactBytesStable:
    readFileSync(path.join(root, '.tamagui/zero/tamagui-zero.css'), 'utf8') === coldCSS,
  artifactCarriesIslandRule: coldCSS.includes('width:137px'),
  artifactCarriesZeroRule: coldCSS.includes('.is_View'),
}
if (!receipts.warmCacheRebuild.coldBuildRanEveryLoader) {
  throw new Error('the cold build reported reused modules, so the receipt cannot fail')
}
if (!receipts.warmCacheRebuild.warmBuildReusedModules) {
  throw new Error('the warm rebuild ran every loader, so the warm path proves nothing')
}
if (!receipts.warmCacheRebuild.artifactCarriesIslandRule) {
  throw new Error('the cold artifact has no island rule, so stability proves nothing')
}
if (
  !receipts.warmCacheRebuild.identityStable ||
  !receipts.warmCacheRebuild.bridgesStable ||
  !receipts.warmCacheRebuild.artifactBytesStable
) {
  throw new Error('a warm-cache rebuild changed the artifact')
}

// 6. the compiled-global-CSS tier: the derived flag's measured effect, and the
// three ways the artifact and the stripping fact can diverge. Each control must
// fail, and each must fail for its own reason.
const clientChunkBytes = (distDir) => {
  const chunks = path.join(root, distDir, 'static/chunks')
  const files = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.js')) files.push(full)
    }
  }
  walk(chunks)
  files.sort()
  let raw = 0
  let gzip = 0
  let isView = 0
  let root_ = 0
  for (const file of files) {
    const buffer = readFileSync(file)
    raw += buffer.length
    gzip += gzipSync(buffer, { level: 9 }).length
    const text = buffer.toString('utf8')
    isView += text.split('is_View').length - 1
    root_ += text.split(':root').length - 1
  }
  return { raw, gzip, isView, rootRules: root_ }
}

const globalBuild = build({ TAMAGUI_ZERO_FIXTURE: 'global' })
if (!globalBuild.ok) {
  throw new Error(`compiled-global-css build failed:\n${globalBuild.output}`)
}
const derived = clientChunkBytes('.next-global')

// the same source, same entry and same imported artifact on the ordinary tier:
// mutates-themes declares runtime theme mutation, so the claim is refused
const ordinaryBuild = build({
  TAMAGUI_ZERO_FIXTURE: 'global',
  TAMAGUI_DOES_SSR_CSS: 'mutates-themes',
})
if (!ordinaryBuild.ok) {
  throw new Error(`ordinary-tier build failed:\n${ordinaryBuild.output}`)
}
const ordinary = clientChunkBytes('.next-global')

const artifactControls = {}
for (const [name, fixture] of [
  ['unimported', 'global-unimported'],
  ['missing', 'global-missing'],
  ['stale', 'global-stale'],
]) {
  const result = build({ TAMAGUI_ZERO_FIXTURE: fixture })
  artifactControls[name] = {
    buildFailed: !result.ok,
    reportedItsOwnReason: result.output.includes(
      name === 'unimported'
        ? 'the entry graph never loads it'
        : name === 'missing'
          ? 'does not exist'
          : 'is stale'
    ),
  }
  if (result.ok) throw new Error(`the ${name} artifact control built successfully`)
  if (!artifactControls[name].reportedItsOwnReason) {
    throw new Error(`the ${name} artifact control did not report its own diagnostic`)
  }
}
// leave the tier's own build output in the state the browser assertions read
const globalRestore = build({ TAMAGUI_ZERO_FIXTURE: 'global' })
if (!globalRestore.ok) {
  throw new Error(`compiled-global-css restore failed:\n${globalRestore.output}`)
}

receipts.compiledGlobalCSS = {
  ordinaryTier: ordinary,
  flagDerived: derived,
  gzipRemoved: ordinary.gzip - derived.gzip,
  designSystemRulesRemovedFromJS: ordinary.isView - derived.isView,
  rootBlocksRemovedFromJS: ordinary.rootRules - derived.rootRules,
  artifactControls,
}
if (receipts.compiledGlobalCSS.gzipRemoved <= 0) {
  throw new Error('deriving TAMAGUI_DID_OUTPUT_CSS removed no JavaScript')
}

writeFileSync(
  path.join(zeroDir, 'next-receipts.json'),
  `${JSON.stringify(receipts, null, 2)}\n`
)
console.info(JSON.stringify(receipts, null, 2))

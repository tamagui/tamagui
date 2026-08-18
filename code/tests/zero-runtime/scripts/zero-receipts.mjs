// Records the Phase 1 zero-runtime receipts for the Vite integration.
//
// Every claim here is a build that was actually run: the zero build must
// succeed with an empty forbidden-module list, the negative control must make
// that same check fail, the illegal static island import must be rejected by
// the compiler, and the artifact identity must change when any of its members
// changes.
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { hashZeroIdentity, isTamaguiModuleId } from '@tamagui/static'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const zeroDir = path.join(root, '.tamagui/zero')

function build(fixture, outDir, extraArgs = [], extraEnv = {}) {
  try {
    const stdout = execFileSync(
      'npx',
      ['vite', 'build', '--outDir', outDir, ...extraArgs],
      {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: {
          ...process.env,
          NODE_ENV: 'production',
          TAMAGUI_ZERO_FIXTURE: fixture,
          ...extraEnv,
        },
      }
    )
    return { ok: true, output: stdout }
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ''}${error.stderr ?? ''}` }
  }
}

const read = (file) => JSON.parse(readFileSync(path.join(zeroDir, file), 'utf8'))

const receipts = {}

// 1. the zero build
const zero = build('zero', 'dist')
if (!zero.ok) throw new Error(`zero build failed:\n${zero.output}`)
const zeroGraph = read('vite-dist.graph.json')
const zeroIdentity = read('vite-dist.bridges.json')
receipts.zero = {
  built: true,
  forbidden: zeroGraph.forbidden,
  tamaguiModules: zeroGraph.tamaguiModules,
  moduleCount: zeroGraph.moduleCount,
  jsGzip: zeroGraph.gzip,
  cssGzip: zeroIdentity.cssGzip,
  identity: zeroIdentity.identity,
  bridges: zeroIdentity.bridges,
}
if (zeroGraph.forbidden.length) throw new Error('zero build shipped forbidden modules')

// 2. the negative control: the same check must fail
const negative = build('negative', 'dist-negative')
const negativeGraph = read('vite-dist-negative.graph.json')
receipts.negativeControl = {
  buildFailed: !negative.ok,
  forbidden: negativeGraph.forbidden,
  // the dynamic import lands the runtime in a lazy chunk, so what the failure
  // must name is the forbidden module itself
  failureNamesForbiddenModule: negativeGraph.forbidden.every((entry) =>
    negative.output.includes(entry.id)
  ),
}
if (negative.ok)
  throw new Error('the negative control built successfully; the graph check cannot fail')
if (!negativeGraph.forbidden.length)
  throw new Error('the negative control reported no forbidden module')

// 2b. a live design-state read the compiler CAN see: it must be reported, and
// above all it must NOT be silently erased into a runtime ReferenceError
const live = build('live', 'dist-live')
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
const illegal = build('illegal', 'dist-illegal')
receipts.illegalStaticImport = {
  buildFailed: !illegal.ok,
  message: illegal.output.includes('zero/static-island-import'),
}
if (illegal.ok) throw new Error('a static island import built successfully')

// 4. cache identity: end-to-end for island atomic CSS, then per tuple member
const islandFile = path.join(root, 'src/islands/SheetIsland.tsx')
const original = readFileSync(islandFile, 'utf8')
let perturbedIdentity
try {
  writeFileSync(islandFile, original.replace('width={137}', 'width={141}'))
  const perturbed = build('zero', 'dist')
  if (!perturbed.ok) throw new Error(`perturbed zero build failed:\n${perturbed.output}`)
  perturbedIdentity = read('vite-dist.bridges.json')
} finally {
  writeFileSync(islandFile, original)
}
const restored = build('zero', 'dist')
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

// 5. the styled-definition scoping probe (nonblocking, confirmatory).
// `Card` is an app-local styled() in a module with another live export and is
// used only in lowered JSX. Unminified builds carry rolldown's `//#region <id>`
// markers, which are the emitted module list straight from the bundler.
function emittedModules(outDir) {
  const assets = path.join(root, outDir, 'assets')
  const file = readdirSync(assets).find((name) => name.endsWith('.js'))
  const code = readFileSync(path.join(assets, file), 'utf8')
  return {
    code,
    modules: [...code.matchAll(/^\s*\/\/#region (.+)$/gm)].map((match) =>
      path.resolve(root, match[1].trim())
    ),
  }
}

const probeZero = build('zero', 'dist-probe-zero', ['--minify', 'false'])
if (!probeZero.ok) throw new Error(`probe zero build failed:\n${probeZero.output}`)
const zeroEmitted = emittedModules('dist-probe-zero')
const probeFull = build('full', 'dist-probe-full', ['--minify', 'false'])
if (!probeFull.ok) throw new Error(`probe full build failed:\n${probeFull.output}`)
const fullEmitted = emittedModules('dist-probe-full')

receipts.styledScopingProbe = {
  beforeErasure: {
    emittedModules: fullEmitted.modules.length,
    tamaguiModules: fullEmitted.modules.filter(isTamaguiModuleId).length,
    // the styled() options object survives only if the call itself survives
    retainsStyledCall: fullEmitted.code.includes('ZeroCard'),
  },
  afterErasure: {
    emittedModules: zeroEmitted.modules.length,
    tamaguiModules: zeroEmitted.modules.filter(isTamaguiModuleId).length,
    retainsStyledCall: zeroEmitted.code.includes('ZeroCard'),
  },
  neighborLiveExportSurvives: zeroEmitted.code.includes('zero-runtime fixture'),
}

// 6. the zero tier's own load ownership: the plugin injects the artifact's
// stylesheet link into each HTML entry, so a zero entry graph with no HTML
// entry strips the rules and loads nothing
const noHtml = build('zero-no-html', 'dist-zero-no-html')
receipts.zeroArtifactLoad = {
  buildFailed: !noHtml.ok,
  reportedItsOwnReason: noHtml.output.includes('has no HTML entry'),
}
if (noHtml.ok) throw new Error('a zero build with no HTML entry succeeded')
if (!receipts.zeroArtifactLoad.reportedItsOwnReason) {
  throw new Error('the no-HTML-entry control did not report its own diagnostic')
}

// 7. TAMAGUI_DOES_SSR_CSS='mutates-themes' declares runtime theme mutation, so
// zero mode must refuse it outright rather than strip themes that get mutated
const zeroMutates = build('zero', 'dist-zero-mutates', [], {
  TAMAGUI_DOES_SSR_CSS: 'mutates-themes',
})
receipts.zeroRejectsThemeMutation = {
  buildFailed: !zeroMutates.ok,
  reportedRule4: zeroMutates.output.includes(
    'Rule 4: TAMAGUI_DOES_SSR_CSS="mutates-themes"'
  ),
}
if (zeroMutates.ok) throw new Error('zero mode accepted a runtime theme mutation claim')
if (!receipts.zeroRejectsThemeMutation.reportedRule4) {
  throw new Error('zero mode rejected mutates-themes without naming rule 4')
}

// 8. the compiled-global-CSS tier: the derived flag's measured effect on the
// same fixture, and the three ways the artifact and the stripping fact diverge
const clientBytes = (outDir) => {
  const assets = path.join(root, outDir, 'assets')
  const file = readdirSync(assets)
    .filter((name) => name.endsWith('.js'))
    .sort()
  let raw = 0
  let gzip = 0
  let isView = 0
  let rootRules = 0
  for (const name of file) {
    const buffer = readFileSync(path.join(assets, name))
    raw += buffer.length
    gzip += gzipSync(buffer, { level: 9 }).length
    const text = buffer.toString('utf8')
    isView += text.split('is_View').length - 1
    rootRules += text.split(':root').length - 1
  }
  return { raw, gzip, isView, rootRules }
}

const globalBuild = build('global', 'dist-global')
if (!globalBuild.ok)
  throw new Error(`compiled-global-css build failed:\n${globalBuild.output}`)
const derivedBytes = clientBytes('dist-global')

// same source, same entry, same imported artifact: mutates-themes declares
// runtime theme mutation, so the compiled-global claim is refused
const ordinaryBuild = build('global', 'dist-global-mutates', [], {
  TAMAGUI_DOES_SSR_CSS: 'mutates-themes',
})
if (!ordinaryBuild.ok)
  throw new Error(`ordinary-tier build failed:\n${ordinaryBuild.output}`)
const ordinaryBytes = clientBytes('dist-global-mutates')

const artifactControls = {}
for (const [name, fixture, phrase] of [
  ['unimported', 'global-unimported', 'the entry graph never loads it'],
  ['missing', 'global-missing', 'does not exist'],
  ['stale', 'global-stale', 'is stale'],
]) {
  const result = build(fixture, `dist-${fixture}`)
  artifactControls[name] = {
    buildFailed: !result.ok,
    reportedItsOwnReason: result.output.includes(phrase),
  }
  if (result.ok) throw new Error(`the ${name} artifact control built successfully`)
  if (!artifactControls[name].reportedItsOwnReason) {
    throw new Error(`the ${name} artifact control did not report its own diagnostic`)
  }
}
// the missing and stale controls leave the artifact clobbered, so put the
// tier's own output back in the state the browser assertions read
const globalRestore = build('global', 'dist-global')
if (!globalRestore.ok) {
  throw new Error(`compiled-global-css restore failed:\n${globalRestore.output}`)
}
const mutatesRestore = build('global', 'dist-global-mutates', [], {
  TAMAGUI_DOES_SSR_CSS: 'mutates-themes',
})
if (!mutatesRestore.ok) {
  throw new Error(`ordinary-tier restore failed:\n${mutatesRestore.output}`)
}

receipts.compiledGlobalCSS = {
  ordinaryTier: ordinaryBytes,
  flagDerived: derivedBytes,
  gzipRemoved: ordinaryBytes.gzip - derivedBytes.gzip,
  designSystemRulesRemovedFromJS: ordinaryBytes.isView - derivedBytes.isView,
  rootBlocksRemovedFromJS: ordinaryBytes.rootRules - derivedBytes.rootRules,
  artifactControls,
}
if (receipts.compiledGlobalCSS.gzipRemoved <= 0) {
  throw new Error('deriving TAMAGUI_DID_OUTPUT_CSS removed no JavaScript')
}

writeFileSync(
  path.join(zeroDir, 'vite-receipts.json'),
  `${JSON.stringify(receipts, null, 2)}\n`
)
console.info(JSON.stringify(receipts, null, 2))

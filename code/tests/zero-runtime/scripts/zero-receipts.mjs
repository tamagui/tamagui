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
const negativeViolations = read('vite-dist-negative.violations.json')
receipts.negativeControl = {
  buildFailed: !negative.ok,
  // the point of this control: the compiler-local accounting has nothing to
  // attribute, so the two gates really are independent variables
  compilerViolations: negativeViolations.count,
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
if (negativeViolations.count !== 0) {
  throw new Error(
    'the compiler-local gate reported the opaque access, so it is not the graph gate that caught it'
  )
}

// 2b. a live design-state read the compiler CAN see: it must be reported, and
// above all it must NOT be silently erased into a runtime ReferenceError
const live = build('live', 'dist-live')
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

// 3. an illegal static import of a declared island
const illegal = build('illegal', 'dist-illegal')
receipts.illegalStaticImport = {
  buildFailed: !illegal.ok,
  message: illegal.output.includes('zero/static-island-import'),
  reportedRule8: illegal.output.includes('Rule 8 zero/static-island-import'),
  // its remediation is the generated loader, which is nothing like rule 6's
  remediationIsTheLoader: illegal.output.includes(
    'Import the generated island loader instead'
  ),
}
if (illegal.ok) throw new Error('a static island import built successfully')
if (!receipts.illegalStaticImport.reportedRule8) {
  throw new Error('the illegal island import control did not report rule 8')
}
if (!receipts.illegalStaticImport.remediationIsTheLoader) {
  throw new Error('the illegal island import control did not print rule 8 remediation')
}

// 3b. an island mounted under a conditional static theme. The compiler cannot
// pick one theme for it, so it emits one descriptor per enumerated branch and
// the mount selects its id with the same condition the classes use. The `zero`
// build above is the other half: a literal theme there yields exactly one.
const islandBranch = build('island-branch', 'dist-island-branch', ['--minify', 'false'])
if (!islandBranch.ok) {
  throw new Error(`the island-branch build failed:\n${islandBranch.output}`)
}
const branchBridges = read('vite-dist-island-branch.bridges.json').bridges.SheetIsland
const branchCode = emittedModules('dist-island-branch').code
receipts.conditionalIslandBridge = {
  descriptors: branchBridges.map((bridge) => ({ id: bridge.id, name: bridge.name })),
  underLiteralTheme: zeroIdentity.bridges.SheetIsland.length,
  selectsBothIds: branchBridges.every((bridge) => branchCode.includes(bridge.id)),
}
if (branchBridges.length !== 2) {
  throw new Error(
    `a conditional island theme emitted ${branchBridges.length} bridge descriptors, expected one per branch`
  )
}
if (branchBridges.map((bridge) => bridge.name).join() !== 'dark,light') {
  throw new Error(
    `the conditional island bridges do not name both enumerated themes: ${JSON.stringify(
      branchBridges
    )}`
  )
}
if (receipts.conditionalIslandBridge.underLiteralTheme !== 1) {
  throw new Error(
    'a literal island theme emitted more than one bridge, so the branch count proves nothing'
  )
}
if (!receipts.conditionalIslandBridge.selectsBothIds) {
  throw new Error('the compiled mount does not carry both branch ids')
}

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

// The provider and config modules, by the module ids that define them. An
// absence check needs a positive: the compiled-global tier mounts a real
// TamaguiProvider over a real evaluated config, so the same matcher over its
// emitted modules is what proves it can see them at all.
const isProviderOrConfigModule = (id) =>
  /(TamaguiProvider|ThemeProvider|createTamagui|config\/dist)/.test(id)

const probeGlobal = build('global', 'dist-probe-global', ['--minify', 'false'])
if (!probeGlobal.ok) throw new Error(`probe global build failed:\n${probeGlobal.output}`)

receipts.providerAndConfigModules = {
  inProviderBuild: emittedModules('dist-probe-global').modules.filter(
    isProviderOrConfigModule
  ),
  inZeroGraph: zeroEmitted.modules.filter(isProviderOrConfigModule),
}
if (!receipts.providerAndConfigModules.inProviderBuild.length) {
  throw new Error(
    'the provider/config matcher found nothing in a build that mounts a provider, so its absence from the zero graph proves nothing'
  )
}
if (receipts.providerAndConfigModules.inZeroGraph.length) {
  throw new Error(
    `the zero graph contains provider or config modules: ${JSON.stringify(
      receipts.providerAndConfigModules.inZeroGraph
    )}`
  )
}

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

// 9. Phase 3: the compiler contract. Every rule gets one behavioral fixture and
// the authored fix beside it, so each control has an independent variable: the
// violating module must fail with that rule's exact message, and the fixed
// module must build green with an empty forbidden-module list.
const ruleBuild = (entry, fixture = 'rules') =>
  build(fixture, `dist-${entry}`, [], { TAMAGUI_ZERO_RULE: entry })

const RULE_CONTROLS = [
  {
    rule: 1,
    message:
      'Zero-runtime rule 1: View cannot receive a prop spread because the compiler cannot prove it is style-free. Pass non-style props explicitly or move this module to a full-runtime island.',
  },
  {
    rule: 2,
    message:
      'Zero-runtime rule 2: component expression isWide ? View : Text does not resolve to one literal lowerable host component. Use a literal Tamagui or html.* component, or move this module to a full-runtime island.',
  },
  {
    rule: 3,
    message:
      'Zero-runtime rule 3: value for fontFamily on Text cannot be lowered: Style prop fontFamily could not be evaluated. Use a supported build-time value or move this module to a full-runtime island.',
  },
  {
    rule: 4,
    message:
      '[tamagui zero-runtime] Rule 4: View uses theme, which creates a runtime component theme boundary. Replace it with a static <Theme name="..."> wrapper (use name="inverse" for themeInverse) or move this module to a full-runtime island.',
  },
  {
    rule: 5,
    message:
      'Zero-runtime rule 5: animateOnly on View requires a component animation runtime. Use a static CSS transition or move this module to a full-runtime island.',
  },
  {
    rule: 6,
    message:
      'Zero-runtime rule 6: ZStack does not lower to one host element with className and is island-only. Move this module to a declared full-runtime island.',
  },
  {
    rule: 7,
    message:
      'Zero-runtime rule 7: useTheme reads Tamagui design state in JavaScript. Express the condition in CSS or move this module to a full-runtime island.',
  },
]

const perRule = {}
for (const control of RULE_CONTROLS) {
  const entry = `rule${control.rule}`
  const violating = ruleBuild(entry)
  const fixed = ruleBuild(`${entry}.fixed`)
  const fixedGraph = read(`vite-dist-${entry}.fixed.graph.json`)
  perRule[entry] = {
    violatingBuildFailed: !violating.ok,
    printedExactMessage: violating.output.includes(control.message),
    namedItsRule: violating.output.includes(`Rule ${control.rule} `),
    fixedBuilds: fixed.ok,
    fixedForbidden: fixedGraph.forbidden.length,
    fixedTamaguiModules: fixedGraph.tamaguiModules.length,
  }
  const result = perRule[entry]
  if (!result.violatingBuildFailed) throw new Error(`${entry} built successfully`)
  if (!result.printedExactMessage) {
    throw new Error(
      `${entry} did not print the rule ${control.rule} message:\n${violating.output}`
    )
  }
  if (!result.namedItsRule) throw new Error(`${entry} did not name rule ${control.rule}`)
  if (!result.fixedBuilds) {
    throw new Error(`${entry}.fixed did not build:\n${fixed.output}`)
  }
  if (result.fixedForbidden || result.fixedTamaguiModules) {
    throw new Error(`${entry}.fixed shipped Tamagui modules, so it is not a zero graph`)
  }
}

// Phase 4: static Theme and the providerless root. Each control is one authored
// fact away from its fix, so the pair proves the classification, not just the
// failure.
const THEME_CONTROLS = [
  {
    entry: 'theme-name',
    rule: 4,
    message:
      'Zero-runtime rule 4: the <Theme name> value name={themeName}, which is not a literal theme name or a conditional over literal theme names, requires runtime theme or config state.',
  },
  {
    entry: 'theme-value',
    rule: 3,
    message:
      'Zero-runtime rule 3: value for background on Theme cannot be lowered: a theme value must be a string or number literal at build time.',
  },
  {
    entry: 'provider',
    rule: 4,
    message:
      '[tamagui zero-runtime] Rule 4: TamaguiProvider is not used by a zero-runtime root. The bundler loads generated CSS and the compiler lowers static Theme nodes. Remove this provider or make this entry full-runtime.',
  },
  {
    entry: 'theme-modifier',
    rule: 3,
    message:
      'Zero-runtime rule 3: value for background on Theme cannot be lowered: <Theme background="#112233 hover:#445566">: "hover:" isn\'t supported here.',
  },
]

const perThemeControl = {}
for (const control of THEME_CONTROLS) {
  const violating = ruleBuild(control.entry)
  const fixed = ruleBuild(`${control.entry}.fixed`)
  const fixedGraph = read(`vite-dist-${control.entry}.fixed.graph.json`)
  perThemeControl[control.entry] = {
    violatingBuildFailed: !violating.ok,
    printedExactMessage: violating.output.includes(control.message),
    namedItsRule: violating.output.includes(`Rule ${control.rule} `),
    fixedBuilds: fixed.ok,
    fixedForbidden: fixedGraph.forbidden.length,
    fixedTamaguiModules: fixedGraph.tamaguiModules.length,
  }
  const result = perThemeControl[control.entry]
  if (!result.violatingBuildFailed) {
    throw new Error(`${control.entry} built successfully`)
  }
  if (!result.printedExactMessage) {
    throw new Error(
      `${control.entry} did not print its rule ${control.rule} message:\n${violating.output}`
    )
  }
  if (!result.namedItsRule) {
    throw new Error(`${control.entry} did not name rule ${control.rule}`)
  }
  if (!result.fixedBuilds) {
    throw new Error(`${control.entry}.fixed did not build:\n${fixed.output}`)
  }
  if (result.fixedForbidden || result.fixedTamaguiModules) {
    throw new Error(
      `${control.entry}.fixed shipped Tamagui modules, so it is not a zero graph`
    )
  }
}

// every violating site in every module, collected before failing, in one order
const multi = ruleBuild('multi')
const multiReport = build('rules-report', 'dist-multi-report', [], {
  TAMAGUI_ZERO_RULE: 'multi',
})
const multiEnforceJSON = read('vite-dist-multi.violations.json')
const multiReportJSON = read('vite-dist-multi-report.violations.json')

// the config-level rule 5 control: the same fixture with a non-CSS driver
const motionDriver = build('rules-motion', 'dist-rules-motion', [], {
  TAMAGUI_ZERO_RULE: 'rule1.fixed',
})

// a bare side-effect Tamagui import: unknown effects, so it fails rather than
// being erased
const sideEffect = ruleBuild('side-effect')

// an exported app-local styled() used only in lowered JSX, and the escape
// control: a `.ts` module the zero transform never runs on that reads the same
// exported binding as a value
const styledExport = ruleBuild('styled-export')
const styledExportGraph = read('vite-dist-styled-export.graph.json')
const styledExportEscape = ruleBuild('styled-export-escape')

// the four animated-number hooks, imported from the public barrel and rewritten
// to the leaf
const animatedNumber = ruleBuild('animated-number')
const animatedNumberGraph = read('vite-dist-animated-number.graph.json')

receipts.compilerContract = {
  perRule,
  perThemeControl,
  multiFile: {
    buildFailed: !multi.ok,
    violations: multiEnforceJSON.violations.map((violation) => ({
      file: violation.file,
      line: violation.line,
      column: violation.column,
      rule: violation.rule,
      code: violation.code,
    })),
  },
  reportMode: {
    exitedSuccessfully: multiReport.ok,
    sameViolations:
      JSON.stringify(multiEnforceJSON.violations) ===
      JSON.stringify(multiReportJSON.violations),
    enforceMode: multiEnforceJSON.mode,
    reportMode: multiReportJSON.mode,
  },
  configDriverControl: {
    buildFailed: !motionDriver.ok,
    reportedItsOwnReason: motionDriver.output.includes(
      '[tamagui zero-runtime] Rule 5: createTamagui animations must resolve to the CSS driver.'
    ),
  },
  sideEffectImport: {
    buildFailed: !sideEffect.ok,
    reportedItsOwnReason: sideEffect.output.includes('zero/side-effect-import'),
    // rule 8, not rule 6: nothing about this is fixed by moving the module to
    // an island, so it must not carry rule 6's remediation
    reportedRule8: sideEffect.output.includes('Rule 8 zero/side-effect-import'),
    remediationIsRemoveTheImport: sideEffect.output.includes(
      'Remove it, or import the values this module uses so the compiler can lower and erase them.'
    ),
  },
  exportedStyledErasure: {
    buildFailed: !styledExport.ok,
    forbidden: styledExportGraph.forbidden.length,
    tamaguiModules: styledExportGraph.tamaguiModules.length,
    escapeControlFailed: !styledExportEscape.ok,
    escapeControlNamedTheImporter: styledExportEscape.output.includes(
      'importer(s) in this entry graph were never zero-transformed'
    ),
  },
  animatedNumberLeaf: {
    built: animatedNumber.ok,
    tamaguiModules: animatedNumberGraph.tamaguiModules,
    forbidden: animatedNumberGraph.forbidden.length,
  },
}

if (multi.ok) throw new Error('the multi-file rule fixture built successfully')
if (multiEnforceJSON.violations.length !== 4) {
  throw new Error(
    `the multi-file fixture reported ${multiEnforceJSON.violations.length} violations, expected 4`
  )
}
if (!receipts.compilerContract.reportMode.exitedSuccessfully) {
  throw new Error(`report mode did not exit successfully:\n${multiReport.output}`)
}
if (!receipts.compilerContract.reportMode.sameViolations) {
  throw new Error('report mode emitted a different violation list than enforce mode')
}
if (motionDriver.ok) throw new Error('zero mode accepted a non-CSS animation driver')
if (!receipts.compilerContract.configDriverControl.reportedItsOwnReason) {
  throw new Error('the config driver control did not report the rule 5 config message')
}
if (sideEffect.ok) throw new Error('a bare side-effect Tamagui import built successfully')
if (!receipts.compilerContract.sideEffectImport.reportedItsOwnReason) {
  throw new Error('the side-effect import control did not report its own diagnostic')
}
if (!receipts.compilerContract.sideEffectImport.reportedRule8) {
  throw new Error('the side-effect import control did not report rule 8')
}
if (!receipts.compilerContract.sideEffectImport.remediationIsRemoveTheImport) {
  throw new Error('the side-effect import control did not print rule 8 remediation')
}
if (!styledExport.ok) {
  throw new Error(`the exported styled fixture did not build:\n${styledExport.output}`)
}
if (styledExportGraph.tamaguiModules.length) {
  throw new Error('the exported styled definition was not erased from the zero graph')
}
if (styledExportEscape.ok) {
  throw new Error('an untransformed importer of an erased export built successfully')
}
if (!receipts.compilerContract.exportedStyledErasure.escapeControlNamedTheImporter) {
  throw new Error('the erased-export gate did not name the untransformed importer')
}
if (!animatedNumber.ok) {
  throw new Error(`the animated-number fixture did not build:\n${animatedNumber.output}`)
}
if (
  animatedNumberGraph.tamaguiModules.length !== 1 ||
  !animatedNumberGraph.tamaguiModules[0].includes('animated-number')
) {
  throw new Error(
    `the animated-number fixture did not resolve to the leaf alone: ${JSON.stringify(
      animatedNumberGraph.tamaguiModules
    )}`
  )
}
if (animatedNumberGraph.forbidden.length) {
  throw new Error('the animated-number fixture shipped a forbidden module')
}

writeFileSync(
  path.join(zeroDir, 'vite-receipts.json'),
  `${JSON.stringify(receipts, null, 2)}\n`
)
console.info(JSON.stringify(receipts, null, 2))

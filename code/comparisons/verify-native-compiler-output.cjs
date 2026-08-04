#!/usr/bin/env node
const { createHash } = require('crypto')
const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs')
const { createRequire } = require('module')
const { dirname, join, resolve } = require('path')

async function main() {
  const comparisonRoot = __dirname
  const sourcePath = resolve(comparisonRoot, 'shared/native-compiled-bench.tsx')
  const dynamicSourcePath = resolve(
    comparisonRoot,
    '../compiler/static-tests/fixtures/native-compiled-dynamic-corpus.tsx'
  )
  const v2Root = resolve(comparisonRoot, 'tamagui-v2-bench-native-compiled')
  const v3Root = resolve(comparisonRoot, 'tamagui-bench-native-compiled')
  const outputArgument = process.argv
    .slice(2)
    .find((value) => value.startsWith('--output='))
  const outputPath = outputArgument
    ? resolve(outputArgument.slice('--output='.length))
    : '/tmp/tamagui-native-compiler-evidence.json'
  const sha256 = (value) => createHash('sha256').update(value).digest('hex')
  const source = readFileSync(sourcePath, 'utf8')
  const sourceSha256 = sha256(source)
  const dynamicSource = readFileSync(dynamicSourcePath, 'utf8')
  const dynamicSourceSha256 = sha256(dynamicSource)

  const requireFromV2 = createRequire(join(v2Root, 'package.json'))
  const babel = requireFromV2('@babel/core')
  const parser = requireFromV2('@babel/parser')
  const compilerLines = []
  const originalInfo = console.info
  const previousCwd = process.cwd()
  let v2Code
  let v2DynamicCode
  try {
    process.chdir(v2Root)
    process.env.NODE_ENV = 'production'
    console.info = (...values) => compilerLines.push(values.join(' '))
    const transformed = babel.transformFileSync(sourcePath, {
      babelrc: false,
      configFile: false,
      cwd: v2Root,
      filename: sourcePath,
      parserOpts: { plugins: ['jsx', 'typescript'] },
      plugins: [
        [
          requireFromV2.resolve('@tamagui/babel-plugin'),
          {
            components: ['tamagui'],
            config: './tamagui.config.ts',
            logTimings: true,
          },
        ],
      ],
      sourceType: 'module',
    })
    if (!transformed?.code) throw new Error('V2 Babel compiler returned no code')
    v2Code = transformed.code
    const dynamicTransformed = babel.transformFileSync(dynamicSourcePath, {
      babelrc: false,
      configFile: false,
      cwd: v2Root,
      filename: dynamicSourcePath,
      parserOpts: { plugins: ['jsx', 'typescript'] },
      plugins: [
        [
          requireFromV2.resolve('@tamagui/babel-plugin'),
          {
            components: ['tamagui'],
            config: './tamagui.config.ts',
            logTimings: true,
          },
        ],
      ],
      sourceType: 'module',
    })
    if (!dynamicTransformed?.code) {
      throw new Error('V2 Babel compiler returned no dynamic-corpus code')
    }
    v2DynamicCode = dynamicTransformed.code
  } finally {
    console.info = originalInfo
    process.chdir(previousCwd)
  }

  const summaryLine = compilerLines.find(
    (line) => line.includes('native-compiled-bench') && line.includes(' found ')
  )
  const summaryMatch = summaryLine
    ?.replaceAll(/\x1b\[[0-9;]*m/g, '')
    .match(/(\d+) found\s+·\s+(\d+) opt\s+·\s+(\d+) flat/)
  if (!summaryMatch) throw new Error('V2 compiler did not emit extraction statistics')
  const v2Stats = {
    found: Number(summaryMatch[1]),
    optimized: Number(summaryMatch[2]),
    flattened: Number(summaryMatch[3]),
  }
  if (v2Stats.found < 1 || v2Stats.optimized < 1 || v2Stats.flattened < 1) {
    throw new Error(`V2 compiler did not optimize the corpus: ${JSON.stringify(v2Stats)}`)
  }
  const dynamicSummaryLine = compilerLines.find(
    (line) => line.includes('native-compiled-dynami') && line.includes(' found ')
  )
  const dynamicSummaryMatch = dynamicSummaryLine
    ?.replaceAll(/\x1b\[[0-9;]*m/g, '')
    .match(/(\d+) found\s+·\s+(\d+) opt\s+·\s+(\d+) flat/)
  if (!dynamicSummaryMatch) {
    throw new Error(
      `V2 compiler did not emit dynamic extraction statistics: ${JSON.stringify(compilerLines)}`
    )
  }
  const v2DynamicStats = {
    found: Number(dynamicSummaryMatch[1]),
    optimized: Number(dynamicSummaryMatch[2]),
    flattened: Number(dynamicSummaryMatch[3]),
  }
  if (v2DynamicStats.found < 1 || v2DynamicStats.optimized < 1) {
    throw new Error(
      `V2 compiler did not optimize the dynamic corpus: ${JSON.stringify(v2DynamicStats)}`
    )
  }

  const ast = parser.parse(v2Code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })
  const sourceAst = parser.parse(source, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })
  const v2DynamicAst = parser.parse(v2DynamicCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })
  const dynamicSourceAst = parser.parse(dynamicSource, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })
  let nativeViewElements = 0
  let styleSheetCreates = 0
  let directViewCandidates = 0
  let styledUsageCandidates = 0
  let sourceStableKeyUpdates = 0
  let dynamicDirectViewCandidates = 0
  let dynamicStyledUsageCandidates = 0
  const walk = (value, visitor, seen = new Set()) => {
    if (!value || typeof value !== 'object' || seen.has(value)) return
    seen.add(value)
    visitor(value)
    for (const child of Array.isArray(value) ? value : Object.values(value)) {
      walk(child, visitor, seen)
    }
  }
  walk(sourceAst, (value) => {
    if (value.type !== 'JSXOpeningElement' || value.name?.type !== 'JSXIdentifier') return
    if (value.name.name === 'View') directViewCandidates++
    if (value.name.name === 'FixtureCard') styledUsageCandidates++
    const key = value.attributes?.find(
      (attribute) =>
        attribute.type === 'JSXAttribute' &&
        attribute.name?.type === 'JSXIdentifier' &&
        attribute.name.name === 'key'
    )
    if (!key?.value || key.value.type !== 'JSXExpressionContainer') return
    let usesInstance = false
    walk(key.value.expression, (keyPart) => {
      if (keyPart.type === 'Identifier' && keyPart.name === 'instance')
        usesInstance = true
    })
    if (usesInstance) sourceStableKeyUpdates++
  })
  walk(dynamicSourceAst, (value) => {
    if (value.type !== 'JSXOpeningElement' || value.name?.type !== 'JSXIdentifier') return
    if (value.name.name === 'View') dynamicDirectViewCandidates++
    if (value.name.name === 'DynamicFixtureCard') dynamicStyledUsageCandidates++
  })
  walk(ast, (value) => {
    if (
      value.type === 'JSXOpeningElement' &&
      value.name?.type === 'JSXIdentifier' &&
      value.name.name === '__ReactNativeView'
    ) {
      nativeViewElements++
    }
    if (
      value.type === 'CallExpression' &&
      value.callee?.type === 'MemberExpression' &&
      value.callee.object?.type === 'Identifier' &&
      value.callee.object.name === '__ReactNativeStyleSheet' &&
      value.callee.property?.type === 'Identifier' &&
      value.callee.property.name === 'create'
    ) {
      styleSheetCreates++
    }
  })
  if (nativeViewElements < 1 || styleSheetCreates !== 1) {
    throw new Error(
      `V2 output lacks native lowering artifacts: ${JSON.stringify({ nativeViewElements, styleSheetCreates })}`
    )
  }

  const propertyName = (property) => {
    if (property?.key?.type === 'Identifier') return property.key.name
    if (property?.key?.type === 'StringLiteral') return property.key.value
    return null
  }
  const literalValue = (node) => {
    if (node?.type === 'StringLiteral' || node?.type === 'NumericLiteral')
      return node.value
    if (node?.type === 'BooleanLiteral') return node.value
    if (node?.type !== 'ObjectExpression') return undefined
    return Object.fromEntries(
      node.properties.flatMap((property) => {
        if (property.type !== 'ObjectProperty') return []
        const name = propertyName(property)
        const value = literalValue(property.value)
        return name === null || value === undefined ? [] : [[name, value]]
      })
    )
  }
  const cachedNativeStyles = (tree) => {
    const byHelper = new Map()
    walk(tree, (value) => {
      if (
        value.type !== 'AssignmentExpression' ||
        value.operator !== '=' ||
        value.left?.type !== 'MemberExpression' ||
        value.left.computed ||
        value.left.object?.type !== 'Identifier' ||
        value.left.property?.type !== 'Identifier' ||
        value.left.property.name !== '_' ||
        value.right?.type !== 'ObjectExpression'
      ) {
        return
      }
      const style = literalValue(value.right)
      if (style) byHelper.set(value.left.object.name, style)
    })
    return byHelper
  }
  const styleObjectsFromStyleSheet = []
  walk(ast, (value) => {
    if (
      value.type !== 'CallExpression' ||
      value.callee?.type !== 'MemberExpression' ||
      value.callee.object?.type !== 'Identifier' ||
      value.callee.object.name !== '__ReactNativeStyleSheet' ||
      value.callee.property?.type !== 'Identifier' ||
      value.callee.property.name !== 'create' ||
      value.arguments?.[0]?.type !== 'ObjectExpression'
    ) {
      return
    }
    for (const property of value.arguments[0].properties) {
      if (property.type !== 'ObjectProperty') continue
      const style = literalValue(property.value)
      if (style) styleObjectsFromStyleSheet.push(style)
    }
  })
  const dynamicStyleObjectsFromStyleSheet = []
  walk(v2DynamicAst, (value) => {
    if (
      value.type !== 'CallExpression' ||
      value.callee?.type !== 'MemberExpression' ||
      value.callee.object?.type !== 'Identifier' ||
      value.callee.object.name !== '__ReactNativeStyleSheet' ||
      value.callee.property?.type !== 'Identifier' ||
      value.callee.property.name !== 'create' ||
      value.arguments?.[0]?.type !== 'ObjectExpression'
    ) {
      return
    }
    for (const property of value.arguments[0].properties) {
      if (property.type !== 'ObjectProperty') continue
      const style = literalValue(property.value)
      if (style) dynamicStyleObjectsFromStyleSheet.push(style)
    }
  })

  const expectedDirectHostStyles = [
    {
      width: 20,
      height: 20,
      backgroundColor: 'rgb(99,102,241)',
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      borderBottomRightRadius: 3,
      borderBottomLeftRadius: 3,
      marginTop: 1,
      marginRight: 1,
      marginBottom: 1,
      marginLeft: 1,
    },
    {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8,
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 1,
      borderTopColor: 'rgb(229,231,235)',
      borderRightColor: 'rgb(229,231,235)',
      borderBottomColor: 'rgb(229,231,235)',
      borderLeftColor: 'rgb(229,231,235)',
    },
    {
      width: 32,
      height: 32,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      borderBottomRightRadius: 16,
      borderBottomLeftRadius: 16,
      backgroundColor: 'rgb(96,165,250)',
    },
    { flex: 1, gap: 4 },
    {
      width: 120,
      height: 10,
      backgroundColor: 'rgb(55,65,81)',
    },
    {
      width: 180,
      height: 8,
      backgroundColor: 'rgb(156,163,175)',
    },
  ]
  const expectedStyledHostStyle = {
    width: 120,
    height: 48,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderTopColor: 'rgb(209,213,219)',
    borderRightColor: 'rgb(209,213,219)',
    borderBottomColor: 'rgb(209,213,219)',
    borderLeftColor: 'rgb(209,213,219)',
    backgroundColor: 'rgb(249,250,251)',
  }
  const expectedDynamicDirectHostStyles = [
    {
      width: 20,
      height: 20,
      backgroundColor: 'rgb(99,102,241)',
    },
    {
      flexDirection: 'row',
      paddingTop: 8,
      paddingRight: 8,
      paddingBottom: 8,
      paddingLeft: 8,
      backgroundColor: 'rgb(229,231,235)',
    },
  ]
  const expectedDynamicStyledHostStyle = {
    width: 120,
    height: 48,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    backgroundColor: 'rgb(249,250,251)',
  }
  const matchesStyle = (actual, expected) =>
    Object.entries(expected).every(([key, value]) => actual[key] === value)
  const assertHostStyles = (name, actualStyles, expectedStyles) => {
    const missing = expectedStyles.filter(
      (expected) => !actualStyles.some((actual) => matchesStyle(actual, expected))
    )
    if (missing.length) {
      throw new Error(
        `${name} output misses expected host styles: ${JSON.stringify(missing)}`
      )
    }
  }
  assertHostStyles('V2', styleObjectsFromStyleSheet, expectedDirectHostStyles)
  assertHostStyles(
    'V2 dynamic',
    dynamicStyleObjectsFromStyleSheet,
    expectedDynamicDirectHostStyles
  )

  const { METRO_COMPILER_CACHE_VERSION } = require(
    resolve(comparisonRoot, '../compiler/metro-plugin/dist/cjs/compilerCache.cjs')
  )
  const cacheDirectory = join(
    v3Root,
    `node_modules/.cache/tamagui/metro-compiler/ios/v${METRO_COMPILER_CACHE_VERSION}`
  )
  const manifestPath = join(cacheDirectory, 'manifest.json')
  if (!existsSync(manifestPath)) {
    throw new Error(`V3 Metro compiler manifest is missing: ${manifestPath}`)
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const descriptor = manifest.entries?.[sourcePath]
  if (!descriptor)
    throw new Error(`V3 Metro compiler manifest has no plan for ${sourcePath}`)
  const blobPath = join(cacheDirectory, 'blobs', `${descriptor.blobHash}.json`)
  const entry = JSON.parse(readFileSync(blobPath, 'utf8'))
  if (entry.sourceHash !== sourceSha256 || descriptor.sourceHash !== sourceSha256) {
    throw new Error('V3 Metro plan source hash does not match the compiler corpus')
  }
  const v3Stats = entry.plan?.stats
  if (
    !v3Stats ||
    v3Stats.found < 1 ||
    v3Stats.lowered < 1 ||
    v3Stats.flattened < 1 ||
    !entry.plan.edits?.length
  ) {
    throw new Error(`V3 compiler did not lower the corpus: ${JSON.stringify(v3Stats)}`)
  }

  // Plans are generated against the raw module source; workers apply them to
  // the raw bytes before their own Babel pass, so the plan hash must match the
  // corpus source directly.
  if (entry.plan.sourceHash !== sourceSha256) {
    throw new Error('V3 raw source does not match the cached compiler plan')
  }
  let v3Code = source
  for (const edit of [...entry.plan.edits].sort(
    (left, right) => right.start - left.start
  )) {
    v3Code = `${v3Code.slice(0, edit.start)}${edit.content}${v3Code.slice(edit.end)}`
  }
  const v3LoweredOutputSha256 = sha256(v3Code)
  const v3Ast = parser.parse(v3Code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })
  const v3HostStyles = [...cachedNativeStyles(v3Ast).values()]
  assertHostStyles('V3', v3HostStyles, [
    ...expectedDirectHostStyles,
    expectedStyledHostStyle,
  ])

  const dynamicDescriptor = manifest.entries?.[dynamicSourcePath]
  if (!dynamicDescriptor) {
    throw new Error(`V3 Metro compiler manifest has no plan for ${dynamicSourcePath}`)
  }
  const dynamicEntry = JSON.parse(
    readFileSync(
      join(cacheDirectory, 'blobs', `${dynamicDescriptor.blobHash}.json`),
      'utf8'
    )
  )
  if (
    dynamicEntry.sourceHash !== dynamicSourceSha256 ||
    dynamicDescriptor.sourceHash !== dynamicSourceSha256
  ) {
    throw new Error('V3 Metro plan source hash does not match the dynamic corpus')
  }
  const v3DynamicStats = dynamicEntry.plan?.stats
  if (
    !v3DynamicStats ||
    v3DynamicStats.found !== 3 ||
    v3DynamicStats.lowered !== 3 ||
    v3DynamicStats.flattened !== 3 ||
    v3DynamicStats.styled !== 1 ||
    v3DynamicStats.bailed !== 0
  ) {
    throw new Error(
      `V3 compiler did not partially lower the dynamic corpus: ${JSON.stringify({ stats: v3DynamicStats, diagnostics: dynamicEntry.diagnostics })}`
    )
  }
  if (dynamicEntry.plan.sourceHash !== dynamicSourceSha256) {
    throw new Error('V3 dynamic raw source does not match the cached compiler plan')
  }
  let v3DynamicCode = dynamicSource
  for (const edit of [...dynamicEntry.plan.edits].sort(
    (left, right) => right.start - left.start
  )) {
    v3DynamicCode = `${v3DynamicCode.slice(0, edit.start)}${edit.content}${v3DynamicCode.slice(edit.end)}`
  }
  const v3DynamicAst = parser.parse(v3DynamicCode, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })

  const stableStyleEvidence = (tree) => {
    const cachedStyles = cachedNativeStyles(tree)
    const staticStyles = []
    let calls = 0
    let expressionArrays = 0
    let dynamicOpacityStyles = 0
    walk(tree, (value) => {
      const stableCall =
        value.type === 'CallExpression' &&
        ((value.callee?.type === 'Identifier' &&
          value.callee.name === '_withStableStyle') ||
          (value.callee?.type === 'MemberExpression' &&
            value.callee.property?.type === 'Identifier' &&
            value.callee.property.name === '_withStableStyle'))
      if (stableCall) {
        calls++
        const createStyle = value.arguments?.[1]
        if (createStyle?.type !== 'ArrowFunctionExpression') return
        const body = createStyle.body
        if (body?.type !== 'ArrayExpression') return
        const staticStyleExpression = body.elements?.[0]
        const cachedStyleHelper =
          staticStyleExpression?.type === 'LogicalExpression' &&
          staticStyleExpression.operator === '??' &&
          staticStyleExpression.left?.type === 'MemberExpression' &&
          !staticStyleExpression.left.computed &&
          staticStyleExpression.left.object?.type === 'Identifier' &&
          staticStyleExpression.left.property?.type === 'Identifier' &&
          staticStyleExpression.left.property.name === '_'
            ? staticStyleExpression.left.object.name
            : null
        const staticStyle = cachedStyleHelper
          ? cachedStyles.get(cachedStyleHelper)
          : undefined
        if (staticStyle) staticStyles.push(staticStyle)
        const dynamicStyle = body.elements?.[1]
        if (dynamicStyle?.type !== 'ObjectExpression') return
        const opacity = dynamicStyle.properties.find(
          (property) =>
            property.type === 'ObjectProperty' && propertyName(property) === 'opacity'
        )
        if (
          opacity?.type === 'ObjectProperty' &&
          opacity.value?.type === 'MemberExpression'
        ) {
          dynamicOpacityStyles++
        }
      }
      const jsxExpressionArray =
        value.type === 'JSXAttribute' &&
        value.name?.type === 'JSXIdentifier' &&
        value.name.name === '_expressions' &&
        value.value?.type === 'JSXExpressionContainer' &&
        value.value.expression?.type === 'ArrayExpression'
      const objectExpressionArray =
        value.type === 'ObjectProperty' &&
        propertyName(value) === '_expressions' &&
        value.value?.type === 'ArrayExpression'
      if (jsxExpressionArray || objectExpressionArray) expressionArrays++
    })
    return { calls, expressionArrays, dynamicOpacityStyles, staticStyles }
  }
  const v2DynamicBehavior = stableStyleEvidence(v2DynamicAst)
  const v3DynamicBehavior = stableStyleEvidence(v3DynamicAst)
  if (
    v2DynamicBehavior.calls !== 2 ||
    v2DynamicBehavior.expressionArrays !== 2 ||
    v3DynamicBehavior.calls !== 3 ||
    v3DynamicBehavior.expressionArrays !== 3 ||
    v3DynamicBehavior.dynamicOpacityStyles !== 3
  ) {
    throw new Error(
      `dynamic compiler behavior artifacts differ: ${JSON.stringify({ v2DynamicBehavior, v3DynamicBehavior })}`
    )
  }
  assertHostStyles('V3 dynamic', v3DynamicBehavior.staticStyles, [
    ...expectedDynamicDirectHostStyles,
    expectedDynamicStyledHostStyle,
  ])

  const countRevisionOpacityUpdates = (tree) => {
    let count = 0
    walk(tree, (value) => {
      const isOpacityProperty =
        value.type === 'ObjectProperty' && propertyName(value) === 'opacity'
      const isOpacityAttribute =
        value.type === 'JSXAttribute' &&
        value.name?.type === 'JSXIdentifier' &&
        value.name.name === 'opacity'
      let expression = isOpacityProperty
        ? value.value
        : isOpacityAttribute && value.value?.type === 'JSXExpressionContainer'
          ? value.value.expression
          : null
      if (expression?.type === 'TSAsExpression') expression = expression.expression
      if (expression?.type !== 'ConditionalExpression') return
      let usesRevision = false
      walk(expression.test, (testPart) => {
        if (testPart.type === 'Identifier' && testPart.name === 'revision') {
          usesRevision = true
        }
      })
      if (usesRevision) count++
    })
    return count
  }
  const v2RevisionOpacityUpdates = countRevisionOpacityUpdates(ast)
  const v3RevisionOpacityUpdates = countRevisionOpacityUpdates(v3Ast)
  if (
    sourceStableKeyUpdates !== 3 ||
    v2RevisionOpacityUpdates !== 3 ||
    v3RevisionOpacityUpdates !== 3
  ) {
    throw new Error(
      `compiler output lost stable-key updates: ${JSON.stringify({ sourceStableKeyUpdates, v2RevisionOpacityUpdates, v3RevisionOpacityUpdates })}`
    )
  }

  const v2Package = (name) =>
    JSON.parse(
      readFileSync(
        join(v2Root, 'node_modules', ...name.split('/'), 'package.json'),
        'utf8'
      )
    ).version
  const evidence = {
    schemaVersion: 2,
    generatedAt: new Date().toISOString(),
    fixture: {
      path: 'code/comparisons/shared/native-compiled-bench.tsx',
      bytes: Buffer.byteLength(source),
      sha256: sourceSha256,
      coverage: {
        kind: 'representative synthetic native static JSX',
        directViewCandidates,
        styledUsageCandidates,
        totalCandidates: directViewCandidates + styledUsageCandidates,
      },
    },
    dynamicFixture: {
      path: 'code/compiler/static-tests/fixtures/native-compiled-dynamic-corpus.tsx',
      bytes: Buffer.byteLength(dynamicSource),
      sha256: dynamicSourceSha256,
      coverage: {
        kind: 'byte-identical dynamic native opacity corpus',
        directViewCandidates: dynamicDirectViewCandidates,
        styledUsageCandidates: dynamicStyledUsageCandidates,
        totalCandidates: dynamicDirectViewCandidates + dynamicStyledUsageCandidates,
      },
      regressionControl: {
        command:
          'bun run test:run -- tests/dynamicPartial.native.test.tsx --reporter=verbose',
        disablePartialExtractionStats: {
          found: 3,
          lowered: 0,
          flattened: 0,
          styled: 0,
          bailed: 3,
        },
        diagnosticCode: 'local/dynamic-style-value',
        diagnosticComponents: ['View', 'View', 'DynamicFixtureCard'],
        diagnosticProp: 'opacity',
      },
      v2: {
        stats: v2DynamicStats,
        coverage: {
          recognized: v2DynamicStats.found,
          optimized: v2DynamicStats.optimized,
          flattened: v2DynamicStats.flattened,
          unrecognized:
            dynamicDirectViewCandidates +
            dynamicStyledUsageCandidates -
            v2DynamicStats.found,
        },
        outputBytes: Buffer.byteLength(v2DynamicCode),
        outputSha256: sha256(v2DynamicCode),
        diagnostics: [],
        behaviorAssertions: {
          expectedDirectHostStylesMatched: expectedDynamicDirectHostStyles.length,
          stableStyleWrappers: v2DynamicBehavior.calls,
          dynamicExpressionArrays: v2DynamicBehavior.expressionArrays,
          styledUsageRemainsRuntime:
            dynamicDirectViewCandidates +
            dynamicStyledUsageCandidates -
            v2DynamicStats.found,
        },
      },
      v3: {
        generation: manifest.generation,
        sourceHash: dynamicEntry.sourceHash,
        loweredOutputSha256: sha256(v3DynamicCode),
        planBlobHash: dynamicDescriptor.blobHash,
        stats: v3DynamicStats,
        diagnostics: dynamicEntry.diagnostics,
        behaviorAssertions: {
          planMatchesRawSourceHash:
            dynamicEntry.plan.sourceHash === dynamicSourceSha256,
          appliedPlanParses: true,
          expectedDirectHostStylesMatched: expectedDynamicDirectHostStyles.length,
          expectedStyledHostStylesMatched: 1,
          stableStyleWrappers: v3DynamicBehavior.calls,
          dynamicExpressionArrays: v3DynamicBehavior.expressionArrays,
          dynamicOpacityStyles: v3DynamicBehavior.dynamicOpacityStyles,
          metroFrontendCacheTest:
            'frontend.test.ts publishes and applies the raw-source native opacity plan through the Metro cache worker',
          compileRenderUpdateTest:
            'dynamicPartial.native.test.tsx asserts stable host identity, static styles, and opacity 1 to 0.8',
        },
      },
    },
    v2: {
      packages: {
        tamagui: v2Package('tamagui'),
        babelPlugin: v2Package('@tamagui/babel-plugin'),
      },
      stats: v2Stats,
      coverage: {
        recognized: v2Stats.found,
        recognizedButNotOptimized: v2Stats.found - v2Stats.optimized,
        unrecognized: directViewCandidates + styledUsageCandidates - v2Stats.found,
      },
      outputBytes: Buffer.byteLength(v2Code),
      outputSha256: sha256(v2Code),
      nativeViewElements,
      styleSheetCreates,
      behaviorAssertions: {
        emittedNativeViewElements: nativeViewElements > 0,
        emittedOneStyleSheet: styleSheetCreates === 1,
        expectedDirectHostStylesMatched: expectedDirectHostStyles.length,
        stableKeyStyleUpdatesPreserved: v2RevisionOpacityUpdates,
      },
    },
    v3: {
      generation: manifest.generation,
      sourceHash: entry.sourceHash,
      loweredOutputSha256: v3LoweredOutputSha256,
      planBlobHash: descriptor.blobHash,
      stats: v3Stats,
      coverage: {
        recognized: v3Stats.found,
        lowered: v3Stats.lowered,
        flattened: v3Stats.flattened,
        styled: v3Stats.styled,
        bailed: v3Stats.bailed,
      },
      diagnostics: entry.diagnostics,
      behaviorAssertions: {
        planMatchesSourceHash: entry.sourceHash === sourceSha256,
        planHasLoweredEdits: entry.plan.edits?.length > 0,
        planMatchesRawSourceHash: entry.plan.sourceHash === sourceSha256,
        appliedPlanParses: true,
        expectedDirectHostStylesMatched: expectedDirectHostStyles.length,
        expectedStyledHostStylesMatched: 1,
        stableKeyStyleUpdatesPreserved: v3RevisionOpacityUpdates,
      },
    },
  }
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`)
  console.log(JSON.stringify(evidence, null, 2))
  console.log(`Compiler evidence: ${outputPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

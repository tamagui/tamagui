import { execFile } from 'node:child_process'
import { access, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'
import ts from 'typescript'
import { build, createServer, isRunnableDevEnvironment } from 'vite'
import type { Plugin } from 'vite'
import { afterEach, beforeEach, expect, test, vi } from 'vitest'

import {
  createViteTamaguiLoader,
  TAMAGUI_EVALUATION_ENVIRONMENT,
} from '../src/loadTamagui'
import { tamaguiPlugin } from '../src/plugin'

const execFileAsync = promisify(execFile)
const fixtureRoot = path.resolve(__dirname, 'fixtures/module-runner')
const appPath = path.join(fixtureRoot, 'src/App.tsx')
const resolutionPath = path.join(fixtureRoot, 'packages/workspace/src/resolution.ts')
const configSpacePath = path.join(fixtureRoot, 'packages/workspace/src/config-space.ts')
const componentEntryPath = path.join(fixtureRoot, 'packages/components/src/index.ts')
const watchOutputRoot = path.join(fixtureRoot, '.watch-dist')
const fixtureComponents = ['@fixture/components', '@fixture/components/static']
const evaluationPipelineId = '\0fixture-evaluation-pipeline'
const fixtureAliases = {
  '#workspace-resolution': resolutionPath,
  '@fixture/conditional': path.join(fixtureRoot, 'packages/conditional'),
}

function fixtureResolverPlugin(): Plugin {
  const resolveId = (source: string) => {
    if (source === '#evaluation-pipeline') {
      return evaluationPipelineId
    }
    if (source === '#plugin-resolution') {
      return path.join(fixtureRoot, 'packages/workspace/src/plugin-resolution.ts')
    }
    if (source === '#config-space') {
      return configSpacePath
    }
  }
  const load = function (this: any, id: string) {
    if (id === evaluationPipelineId) {
      return `export default ${JSON.stringify(this.environment.plugins.map((plugin: Plugin) => plugin.name))}`
    }
  }
  return {
    name: 'fixture-user-resolver',
    enforce: 'pre',
    resolveId,
    load,
    applyToEnvironment() {
      return {
        name: 'fixture-user-resolver:environment',
        enforce: 'pre',
        resolveId,
        load,
      }
    },
  }
}

type LifecycleCounts = {
  options: number
  buildStart: number
  buildEnd: number
  closeBundle: number
}

function commandResolverPlugin(
  command: 'serve' | 'build',
  lifecycle?: LifecycleCounts
): Plugin {
  const resolveId = (source: string) => {
    if (source === '#fixture-config') {
      ;((globalThis as any).__tamaguiFixtureOwnedEvaluation ??= []).push(
        `resolve:${command}`
      )
      return path.join(fixtureRoot, 'tamagui.config.ts')
    }
    if (source === '#command-resolution') {
      return path.join(fixtureRoot, `packages/workspace/src/${command}-resolution.ts`)
    }
  }
  const options = () => {
    if (lifecycle) lifecycle.options++
  }
  const buildStart = () => {
    if (lifecycle) lifecycle.buildStart++
  }
  const buildEnd = () => {
    if (lifecycle) lifecycle.buildEnd++
  }
  const closeBundle = () => {
    if (lifecycle) lifecycle.closeBundle++
  }
  return {
    name: `fixture-${command}-resolver`,
    apply: command,
    enforce: 'pre',
    options,
    buildStart,
    buildEnd,
    closeBundle,
    resolveId,
    applyToEnvironment() {
      return {
        name: `fixture-${command}-resolver:environment`,
        enforce: 'pre',
        options,
        buildStart,
        buildEnd,
        closeBundle,
        resolveId,
      }
    },
  }
}

function fixturePlugins(lifecycle?: LifecycleCounts) {
  return [
    fixtureResolverPlugin(),
    commandResolverPlugin('serve'),
    commandResolverPlugin('build', lifecycle),
  ]
}

type TransformVisits = Record<'client' | 'ssr', number>

function getTransformVisits(): TransformVisits {
  return ((globalThis as any).__tamaguiFixtureTransformVisits ??= {
    client: 0,
    ssr: 0,
  })
}

function fixtureTransformProbePlugin(): Plugin {
  return {
    name: 'fixture-transform-probe',
    transform(this: any, _source, id) {
      if (path.resolve(id.split('?')[0]) !== appPath) return
      const environmentName = this.environment?.name
      if (environmentName === 'client' || environmentName === 'ssr') {
        getTransformVisits()[environmentName]++
      }
    },
  }
}

function expectMediaPaddingCss(css: string | undefined, breakpoint: number) {
  expect(css).toBeTruthy()
  expect(css).toMatch(
    new RegExp(`\\(\\s*(?:width\\s*>=|min-width\\s*:)\\s*${breakpoint}px\\s*\\)`)
  )
  for (const side of ['top', 'right', 'bottom', 'left']) {
    expect(css).toMatch(new RegExp(`padding-${side}\\s*:\\s*9px`))
  }
}

async function waitForFileChange(
  server: Awaited<ReturnType<typeof createServer>>,
  file: string,
  stage: string
) {
  await new Promise<void>((resolve, reject) => {
    const normalizedFile = path.resolve(file)
    const cleanup = () => {
      clearTimeout(timeout)
      server.watcher.off('change', onChange)
    }
    const onChange = (changedFile: string) => {
      if (path.resolve(changedFile) !== normalizedFile) return
      cleanup()
      setTimeout(resolve, 100)
    }
    const timeout = setTimeout(() => {
      cleanup()
      reject(
        new Error(`Timed out waiting for ${stage} watcher change: ${normalizedFile}`)
      )
    }, 5_000)
    server.watcher.on('change', onChange)
  })
}

async function readBuiltCss(outDir: string) {
  const cssFile = (await readdir(outDir)).find((file) => file.endsWith('.css'))
  if (!cssFile) throw new Error(`Expected CSS output in ${outDir}`)
  return readFile(path.join(outDir, cssFile), 'utf8')
}

function waitForWatchBuild(watcher: any) {
  return new Promise<void>((resolve, reject) => {
    const onEvent = (event: any) => {
      if (event.code === 'ERROR') {
        watcher.off?.('event', onEvent)
        reject(event.error)
      }
      if (event.code === 'END') {
        watcher.off?.('event', onEvent)
        resolve()
      }
    }
    watcher.on('event', onEvent)
  })
}

const servers: Awaited<ReturnType<typeof createServer>>[] = []
let previousCwd = ''

beforeEach(() => {
  previousCwd = process.cwd()
  process.chdir(fixtureRoot)
})

afterEach(async () => {
  try {
    await Promise.all(servers.splice(0).map((server) => server.close()))
  } finally {
    process.chdir(previousCwd)
    delete (globalThis as any).__tamaguiFixtureEvaluationOrder
    delete (globalThis as any).__tamaguiFixtureOwnedEvaluation
    delete (globalThis as any).__tamaguiFixtureOwnedPluginNames
    delete (globalThis as any).__tamaguiFixtureTransformVisits
    await rm(path.join(fixtureRoot, 'node_modules'), { force: true, recursive: true })
    await rm(watchOutputRoot, { force: true, recursive: true })
  }
})

test('evaluates config and components through the app resolver and invalidates HMR', async () => {
  const server = await createServer({
    configFile: false,
    root: fixtureRoot,
    logLevel: 'silent',
    server: {
      middlewareMode: true,
    },
    resolve: {
      alias: fixtureAliases,
    },
    plugins: [
      ...fixturePlugins(),
      fixtureTransformProbePlugin(),
      tamaguiPlugin({
        components: fixtureComponents,
        enableDynamicEvaluation: true,
        disableWatchTamaguiConfig: false,
      }),
    ],
  })
  servers.push(server)

  const clientEnvironment = server.environments.client
  const evaluationEnvironment = server.environments[TAMAGUI_EVALUATION_ENVIRONMENT]
  expect(isRunnableDevEnvironment(evaluationEnvironment)).toBe(true)
  if (!isRunnableDevEnvironment(evaluationEnvironment)) {
    throw new Error('Expected a runnable Tamagui evaluation environment')
  }

  const loader = createViteTamaguiLoader()
  loader.setEnvironment(evaluationEnvironment)
  const componentResolution =
    await evaluationEnvironment.pluginContainer.resolveId('@fixture/components')
  const clientResolution =
    await clientEnvironment.pluginContainer.resolveId('@fixture/conditional')
  const compilerResolution =
    await evaluationEnvironment.pluginContainer.resolveId('@fixture/conditional')

  expect(componentResolution?.id).toBe(componentEntryPath)
  expect(clientResolution?.id).toBe(compilerResolution?.id)
  expect(clientResolution?.id).toMatch(/browser\.ts$/)

  ;(globalThis as any).__tamaguiFixtureEvaluationOrder = []
  const directConfigResolution = await evaluationEnvironment.pluginContainer.resolveId(
    path.join(fixtureRoot, 'tamagui.config.ts')
  )
  expect(directConfigResolution?.id).toBe(path.join(fixtureRoot, 'tamagui.config.ts'))
  const directConfigModule = await evaluationEnvironment.runner.import(
    directConfigResolution!.id
  )
  expect(directConfigModule.compilerResolution).toBe(
    'browser:workspace-v1:user-plugin:serve-only'
  )
  expect((directConfigModule.default as any).media.sm).toEqual({ minWidth: 16 })
  expect(directConfigModule.evaluationPluginNames).toContain('vite:import-analysis')

  const firstEvaluation = await loader.evaluateProjectModules({
    config: 'tamagui.config.ts',
    components: fixtureComponents,
  })
  expect(firstEvaluation.config.module.compilerResolution).toBe(
    'browser:workspace-v1:user-plugin:serve-only'
  )
  expect((firstEvaluation.components[1].module.default as any).compilerResolution).toBe(
    'browser:workspace-v1:user-plugin:serve-only'
  )
  expect((globalThis as any).__tamaguiFixtureEvaluationOrder).toEqual([
    'config',
    'component',
  ])

  const firstTransform = await clientEnvironment.transformRequest('/src/App.tsx')
  expect(firstTransform?.code).toBeTruthy()
  expect(firstTransform?.code).toContain('className')
  const cssRequest = firstTransform?.code.match(/import "([^"]+\.tamagui\.css)"/)?.[1]
  expect(cssRequest).toBeTruthy()
  const firstCss = await clientEnvironment.transformRequest(cssRequest!)
  expectMediaPaddingCss(firstCss?.code, 16)
  const absoluteCssRequest = `${fixtureRoot}/src/App.tsx.tamagui.css`
  const queryResolution = await clientEnvironment.pluginContainer.resolveId(
    `${absoluteCssRequest}?direct`
  )
  expect(queryResolution?.id).toBe(`${absoluteCssRequest}?direct`)
  const ssrEnvironment = server.environments.ssr
  expect(ssrEnvironment).toBeTruthy()
  if (!ssrEnvironment) {
    throw new Error('Expected an SSR environment')
  }
  const firstSsrTransform = await ssrEnvironment.transformRequest('/src/App.tsx')
  expect(firstSsrTransform?.code).toBeTruthy()
  await Promise.all([
    clientEnvironment.waitForRequestsIdle(),
    ssrEnvironment.waitForRequestsIdle(),
  ])
  const initialTransformVisits = { ...getTransformVisits() }
  expect(initialTransformVisits.client).toBeGreaterThan(0)
  expect(initialTransformVisits.ssr).toBeGreaterThan(0)

  const originalResolution = await readFile(resolutionPath, 'utf8')
  const originalConfigSpace = await readFile(configSpacePath, 'utf8')
  const sendSpy = vi.spyOn(server.ws, 'send')
  const getHmrEvents = () =>
    sendSpy.mock.calls
      .map(([payload]) => payload)
      .filter((payload) => payload.type === 'full-reload' || payload.type === 'update')
  const getCompilerReloads = () =>
    getHmrEvents().filter(
      (payload) => payload.type === 'full-reload' && payload.triggeredBy
    )
  const expectValidNonCompilerEvents = () => {
    const events = getHmrEvents().filter(
      (payload) => !(payload.type === 'full-reload' && payload.triggeredBy)
    )
    expect(events.length).toBeLessThanOrEqual(1)
    for (const payload of events) {
      if (payload.type === 'full-reload') {
        expect(payload).toEqual({ type: 'full-reload', path: '*' })
      } else {
        expect(payload.updates.length).toBeGreaterThan(0)
        for (const update of payload.updates) {
          expect(update).toEqual(
            expect.objectContaining({
              type: expect.stringMatching(/^(?:js|css)-update$/),
              path: expect.any(String),
              acceptedPath: expect.any(String),
              timestamp: expect.any(Number),
            })
          )
        }
      }
    }
  }
  try {
    const configUpdateFinished = waitForFileChange(
      server,
      configSpacePath,
      'config dependency update'
    )
    await writeFile(configSpacePath, originalConfigSpace.replace('1', '3'))
    await configUpdateFinished

    await vi.waitFor(() => {
      expect(getCompilerReloads()).toHaveLength(1)
    })

    const configUpdatedTransform =
      await clientEnvironment.transformRequest('/src/App.tsx')
    const configUpdatedSsrTransform =
      await ssrEnvironment.transformRequest('/src/App.tsx')
    const configUpdatedCss = await clientEnvironment.transformRequest(cssRequest!)
    expect(configUpdatedTransform?.code).toBeTruthy()
    expect(configUpdatedSsrTransform?.code).toBeTruthy()
    expect(configUpdatedCss?.code).not.toBe(firstCss?.code)
    expectMediaPaddingCss(configUpdatedCss?.code, 18)
    await Promise.all([
      clientEnvironment.waitForRequestsIdle(),
      ssrEnvironment.waitForRequestsIdle(),
    ])
    const configUpdatedTransformVisits = { ...getTransformVisits() }
    expect(configUpdatedTransformVisits.client).toBeGreaterThan(
      initialTransformVisits.client
    )
    expect(configUpdatedTransformVisits.ssr).toBeGreaterThan(initialTransformVisits.ssr)
    expect(getCompilerReloads()).toEqual([
      {
        type: 'full-reload',
        path: '*',
        triggeredBy: configSpacePath,
      },
    ])
    expectValidNonCompilerEvents()

    sendSpy.mockClear()
    const changed = originalResolution
      .replace('workspace-v1', 'workspace-v2')
      .replace('13', '17')
    const updateFinished = waitForFileChange(
      server,
      resolutionPath,
      'shared dependency update'
    )
    await writeFile(resolutionPath, changed)
    await updateFinished

    await vi.waitFor(() => {
      expect(getCompilerReloads()).toHaveLength(1)
    })

    const updatedEvaluation = await loader.evaluateProjectModules({
      config: 'tamagui.config.ts',
      components: fixtureComponents,
    })
    expect(updatedEvaluation.config.module.compilerResolution).toBe(
      'browser:workspace-v2:user-plugin:serve-only'
    )
    expect(
      (updatedEvaluation.components[1].module.default as any).compilerResolution
    ).toBe('browser:workspace-v2:user-plugin:serve-only')

    const updatedTransform = await clientEnvironment.transformRequest('/src/App.tsx')
    const updatedSsrTransform = await ssrEnvironment.transformRequest('/src/App.tsx')
    expect(updatedTransform?.code).toBeTruthy()
    expect(updatedSsrTransform?.code).toBeTruthy()
    const updatedCss = await clientEnvironment.transformRequest(cssRequest!)
    expect(updatedCss?.code).not.toBe(configUpdatedCss?.code)
    expectMediaPaddingCss(updatedCss?.code, 22)
    await Promise.all([
      clientEnvironment.waitForRequestsIdle(),
      ssrEnvironment.waitForRequestsIdle(),
    ])
    const updatedTransformVisits = getTransformVisits()
    expect(updatedTransformVisits.client).toBeGreaterThan(
      configUpdatedTransformVisits.client
    )
    expect(updatedTransformVisits.ssr).toBeGreaterThan(configUpdatedTransformVisits.ssr)
    expect(getCompilerReloads()).toEqual([
      {
        type: 'full-reload',
        path: '*',
        triggeredBy: resolutionPath,
      },
    ])
    expectValidNonCompilerEvents()
  } finally {
    const restoreFinished = waitForFileChange(
      server,
      resolutionPath,
      'shared dependency restore'
    )
    await writeFile(resolutionPath, originalResolution)
    await restoreFinished
    const restoreConfigFinished = waitForFileChange(
      server,
      configSpacePath,
      'config dependency restore'
    )
    await writeFile(configSpacePath, originalConfigSpace)
    await restoreConfigFinished
  }

  await expect(access(path.join(fixtureRoot, '.tamagui'))).rejects.toThrow()
}, 30_000)

test('evaluates the same fixture during a production build without legacy bundles', async () => {
  const lifecycle: LifecycleCounts = {
    options: 0,
    buildStart: 0,
    buildEnd: 0,
    closeBundle: 0,
  }
  ;(globalThis as any).__tamaguiFixtureOwnedEvaluation = []
  const result = await build({
    configFile: false,
    root: fixtureRoot,
    logLevel: 'silent',
    resolve: {
      alias: fixtureAliases,
    },
    plugins: [
      ...fixturePlugins(lifecycle),
      tamaguiPlugin({
        config: '#fixture-config',
        components: fixtureComponents,
        enableDynamicEvaluation: true,
      }),
    ],
    build: {
      write: false,
      lib: {
        entry: path.join(fixtureRoot, 'src/App.tsx'),
        formats: ['es'],
      },
    },
  })

  const outputs = Array.isArray(result) ? result : [result]
  const buildOutput = outputs
    .flatMap((output: any) => output.output || [])
    .map((output: any) =>
      output.type === 'asset'
        ? typeof output.source === 'string'
          ? output.source
          : Buffer.from(output.source).toString('utf8')
        : output.code
    )
    .join('\n')

  expect(buildOutput).toContain('browser:workspace-v1:user-plugin:build-only')
  expect(buildOutput).not.toContain('serve-only')
  expectMediaPaddingCss(buildOutput, 21)
  expect(buildOutput).not.toContain('$fixture')
  const evaluationProbe = (globalThis as any).__tamaguiFixtureOwnedEvaluation
  const evaluationPluginNames = (globalThis as any).__tamaguiFixtureOwnedPluginNames
  expect(evaluationProbe).toContain('resolve:build')
  expect(evaluationProbe).toContain('import:config')
  expect(evaluationProbe).not.toContain('resolve:serve')
  expect(evaluationProbe.indexOf('resolve:build')).toBeLessThan(
    evaluationProbe.indexOf('import:config')
  )
  expect(
    evaluationPluginNames.filter((name: string) => name.includes('import-analysis'))
  ).toHaveLength(1)
  for (const name of ['alias', 'vite:import-analysis']) {
    expect(
      evaluationPluginNames.filter((pluginName: string) => pluginName === name)
    ).toHaveLength(1)
  }
  expect(
    evaluationPluginNames.filter((name: string) =>
      ['vite:resolve-dev', 'builtin:vite-resolve'].includes(name)
    )
  ).toHaveLength(1)
  expect(evaluationPluginNames).not.toContain('vite:build-import-analysis')
  expect(
    evaluationPluginNames.some((name: string) => name.includes('load-fallback'))
  ).toBe(false)
  expect(
    evaluationPluginNames.filter(
      (name: string) => name === 'fixture-build-resolver:environment'
    )
  ).toHaveLength(1)
  expect(evaluationPluginNames).not.toContain('fixture-serve-resolver:environment')
  expect(lifecycle).toEqual({
    options: 1,
    buildStart: 1,
    buildEnd: 1,
    closeBundle: 1,
  })
  await expect(access(path.join(fixtureRoot, '.tamagui'))).rejects.toThrow()
})

test('isolates extraction caches and rebuilds CSS for a config-only dependency', async () => {
  const originalConfigSpace = await readFile(configSpacePath, 'utf8')
  const watcher = await build({
    configFile: false,
    root: fixtureRoot,
    logLevel: 'silent',
    resolve: {
      alias: fixtureAliases,
    },
    plugins: [
      ...fixturePlugins(),
      tamaguiPlugin({
        config: '#fixture-config',
        components: fixtureComponents,
        enableDynamicEvaluation: true,
      }),
    ],
    build: {
      outDir: watchOutputRoot,
      emptyOutDir: true,
      watch: {},
      lib: {
        entry: path.join(fixtureRoot, 'src/App.tsx'),
        formats: ['es'],
      },
    },
  })

  if (Array.isArray(watcher) || !('on' in watcher)) {
    throw new Error('Expected a Vite build watcher')
  }

  try {
    await waitForWatchBuild(watcher)
    const firstCss = await readBuiltCss(watchOutputRoot)
    expectMediaPaddingCss(firstCss, 21)

    const rebuildFinished = waitForWatchBuild(watcher)
    await writeFile(configSpacePath, originalConfigSpace.replace('1', '4'))
    await rebuildFinished

    const updatedCss = await readBuiltCss(watchOutputRoot)
    expectMediaPaddingCss(updatedCss, 24)
    expect(updatedCss).not.toBe(firstCss)
  } finally {
    await watcher.close()
    await writeFile(configSpacePath, originalConfigSpace)
  }
}, 20_000)

test('published declarations typecheck for a package consumer', async () => {
  const consumerPath = path.resolve(__dirname, 'types/consumer.ts')
  const program = ts.createProgram([consumerPath], {
    allowSyntheticDefaultImports: true,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    skipLibCheck: true,
    strict: true,
    target: ts.ScriptTarget.ES2022,
  })
  const diagnostics = ts.getPreEmitDiagnostics(program)
  expect(
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => process.cwd(),
      getNewLine: () => '\n',
    })
  ).toBe('')

  const pluginTypes = await readFile(
    path.resolve(__dirname, '../types/plugin.d.ts'),
    'utf8'
  )
  const loaderTypes = await readFile(
    path.resolve(__dirname, '../types/loadTamagui.d.ts'),
    'utf8'
  )
  expect(pluginTypes).not.toContain('@tamagui/static-worker')
  expect(loaderTypes).toContain('createViteTamaguiLoader')
  expect(loaderTypes).not.toContain('export declare function getTamaguiOptions')
})

test('published ESM loader reads the CommonJS static runtime', async () => {
  const loaderPath = path.resolve(__dirname, '../dist/esm/loadTamagui.mjs')
  await access(loaderPath)

  const { stdout } = await execFileAsync(process.execPath, [
    '--input-type=module',
    '--eval',
    `
      import { createViteTamaguiLoader } from ${JSON.stringify(pathToFileURL(loaderPath).href)}
      const loader = createViteTamaguiLoader({ disable: true })
      const options = await loader.loadTamaguiBuildConfig()
      process.stdout.write(JSON.stringify({ disable: options.disable, platform: options.platform }))
    `,
  ])

  expect(JSON.parse(stdout)).toEqual({ disable: true, platform: 'web' })
})

import { execFile } from 'node:child_process'
import {
  access,
  cp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
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
const evaluationFixturePackagePath = path.join(fixtureRoot, 'packages/evaluation-fixture')
const evaluationFixturePhysicalRuntimePath = path.join(
  fixtureRoot,
  '.evaluation-fixture-runtime'
)
const evaluationFixtureRuntimePath = path.join(
  fixtureRoot,
  'node_modules/@tamagui/evaluation-fixture'
)
const metroFallbackPath = path.join(evaluationFixtureRuntimePath, 'metro/value/index.js')
const userAliasPath = path.join(fixtureRoot, 'packages/workspace/src/user-alias.ts')
const watchOutputRoot = path.join(fixtureRoot, '.watch-dist')
const fixtureComponents = ['@fixture/components', '@fixture/components/static']
const directPackageFixtureComponents = [
  ...fixtureComponents,
  'tamagui',
  '@tamagui/button',
]
const evaluationPipelineId = '\0fixture-evaluation-pipeline'
const oneCompilerResolutionId = '\0fixture-one-compiler-resolution'
const fixtureAliases = {
  '#workspace-resolution': resolutionPath,
}

function isEvaluationCorePluginName(name: string) {
  return name === 'alias' || name.startsWith('vite:') || name.startsWith('builtin:vite-')
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
  const load = async function (this: any, id: string) {
    if (id === evaluationPipelineId) {
      const plugins = this.environment.plugins as Plugin[]
      const oneTsconfigPaths = plugins.find(
        (plugin) => plugin.name === 'one:tsconfig-paths'
      )
      const oneTsconfigPathsOrder =
        typeof oneTsconfigPaths?.resolveId === 'object'
          ? oneTsconfigPaths.resolveId.order
          : undefined
      const sliderResolution = await this.resolve(
        '@tamagui/slider',
        path.join(fixtureRoot, 'tamagui.config.ts')
      )
      const tamaguiResolution = await this.resolve(
        'tamagui',
        path.join(fixtureRoot, 'tamagui.config.ts')
      )
      return `export default ${JSON.stringify(plugins.map((plugin) => plugin.name))}; export const oneTsconfigPathsOrder = ${JSON.stringify(oneTsconfigPathsOrder)}; export const sliderResolution = ${JSON.stringify({ id: sliderResolution?.id, external: sliderResolution?.external === true })}; export const tamaguiResolution = ${JSON.stringify({ id: tamaguiResolution?.id, external: tamaguiResolution?.external === true })}`
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

function oneTsconfigPathsPlugin(): Plugin {
  return {
    name: 'one:tsconfig-paths',
    enforce: 'pre',
    config() {
      return {
        resolve: {
          tsconfigPaths: true,
        },
      }
    },
    resolveId: {
      order: 'pre',
      handler(source) {
        if (source === '@tamagui/evaluation-fixture/value') {
          return metroFallbackPath
        }
        if (source === '~/user-alias') {
          ;(globalThis as any).__tamaguiFixtureTsconfigPathsContext =
            this.environment?.name
          return userAliasPath
        }
      },
    },
  }
}

function environmentSpecificCompilerPlugins(
  apply: 'serve' | 'build' = 'build'
): Plugin[] {
  const recordLifecycle = (pluginName: string, hook: string) => {
    ;((globalThis as any).__tamaguiFixtureOneConfigLifecycles ??= []).push(
      `${pluginName}:${hook}`
    )
  }
  const recordTransform = (pluginName: string, environmentName: string | undefined) => {
    ;((globalThis as any).__tamaguiFixtureOneTransformEnvironments ??= []).push(
      `${pluginName}:${environmentName}`
    )
  }
  return [
    {
      name: 'one:compiler',
      apply,
      enforce: 'pre',
      config() {
        recordLifecycle('one:compiler', 'config')
      },
      configResolved() {
        recordLifecycle('one:compiler', 'configResolved')
      },
      resolveId(source, importer) {
        if (source !== '#plugin-resolution') return
        const evaluationProbe = (globalThis as any).__tamaguiFixtureOwnedEvaluation
        const environmentName = this.environment?.name
        if (importer?.endsWith('tamagui.config.ts')) {
          evaluationProbe?.push(`one:resolve:${environmentName}:config`)
        } else if (importer?.endsWith('/packages/components/src/resolution.ts')) {
          evaluationProbe?.push(`one:resolve:${environmentName}:component`)
        }
        return oneCompilerResolutionId
      },
      load(id) {
        if (id !== oneCompilerResolutionId) return
        ;(globalThis as any).__tamaguiFixtureOwnedEvaluation?.push(
          `one:load:${this.environment?.name}`
        )
        return `export const resolution = 'user-plugin'`
      },
      transform() {
        const environmentName = this.environment?.name
        recordTransform('one:compiler', environmentName)
        if (environmentName !== 'client' && environmentName !== 'ssr') {
          throw new Error(`Invalid env: ${environmentName}`)
        }
      },
    },
    {
      name: 'one:compiler-css-to-js',
      apply,
      config() {
        recordLifecycle('one:compiler-css-to-js', 'config')
      },
      configResolved() {
        recordLifecycle('one:compiler-css-to-js', 'configResolved')
      },
      transform() {
        const environmentName = this.environment?.name
        recordTransform('one:compiler-css-to-js', environmentName)
        if (environmentName !== 'client' && environmentName !== 'ssr') {
          throw new Error(`Invalid env: ${environmentName}`)
        }
      },
    },
  ]
}

type LifecycleCounts = {
  options: number
  buildStart: number
  buildEnd: number
  closeBundle: number
}

function commandResolverPlugin(
  command: 'serve' | 'build',
  lifecycle?: LifecycleCounts,
  useBuildProofConfig = false
): Plugin {
  const resolveId = (source: string) => {
    if (source === '#fixture-config') {
      ;((globalThis as any).__tamaguiFixtureOwnedEvaluation ??= []).push(
        `resolve:${command}`
      )
      return path.join(
        fixtureRoot,
        command === 'build' && useBuildProofConfig
          ? 'tamagui.build.config.ts'
          : 'tamagui.config.ts'
      )
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

function fixturePlugins(lifecycle?: LifecycleCounts, includeOneTsconfigPaths = false) {
  return [
    ...(includeOneTsconfigPaths ? [oneTsconfigPathsPlugin()] : []),
    fixtureResolverPlugin(),
    commandResolverPlugin('serve'),
    commandResolverPlugin('build', lifecycle, includeOneTsconfigPaths),
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

function getBuildOutput(result: Awaited<ReturnType<typeof build>>) {
  const outputs = Array.isArray(result) ? result : [result]
  return outputs
    .flatMap((output: any) => output.output || [])
    .map((output: any) =>
      output.type === 'asset'
        ? typeof output.source === 'string'
          ? output.source
          : Buffer.from(output.source).toString('utf8')
        : output.code
    )
    .join('\n')
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
let previousDisableSliderInterval: string | undefined

beforeEach(async () => {
  previousCwd = process.cwd()
  previousDisableSliderInterval = process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL
  delete process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL
  process.chdir(fixtureRoot)
  const fixturePackageScope = path.join(fixtureRoot, 'node_modules/@tamagui')
  const fixtureConditionalScope = path.join(fixtureRoot, 'node_modules/@fixture')
  await mkdir(fixturePackageScope, { recursive: true })
  await mkdir(fixtureConditionalScope, { recursive: true })
  await cp(evaluationFixturePackagePath, evaluationFixturePhysicalRuntimePath, {
    recursive: true,
  })
  await rename(
    path.join(evaluationFixturePhysicalRuntimePath, 'package.json.fixture'),
    path.join(evaluationFixturePhysicalRuntimePath, 'package.json')
  )
  await symlink(evaluationFixturePhysicalRuntimePath, evaluationFixtureRuntimePath, 'dir')
  await symlink(
    path.join(fixtureRoot, 'packages/conditional'),
    path.join(fixtureConditionalScope, 'conditional'),
    'dir'
  )
})

afterEach(async () => {
  try {
    await Promise.all(servers.splice(0).map((server) => server.close()))
  } finally {
    process.chdir(previousCwd)
    delete (globalThis as any).__tamaguiFixtureEvaluationOrder
    delete (globalThis as any).__tamaguiFixtureOwnedEvaluation
    delete (globalThis as any).__tamaguiFixtureOwnedPluginNames
    delete (globalThis as any).__tamaguiFixtureSliderIntervalDisabled
    delete (globalThis as any).__tamaguiFixtureSliderModuleLoaded
    delete (globalThis as any).__tamaguiFixtureSliderResolution
    delete (globalThis as any).__tamaguiFixtureTamaguiBarrelLoaded
    delete (globalThis as any).__tamaguiFixtureTamaguiResolution
    delete (globalThis as any).__tamaguiFixtureTransformVisits
    delete (globalThis as any).__tamaguiFixtureTsconfigPathsContext
    delete (globalThis as any).__tamaguiFixturePackageExportPath
    delete (globalThis as any).__tamaguiFixturePackageExportResolution
    delete (globalThis as any).__tamaguiFixtureMetroFallbackUsed
    delete (globalThis as any).__tamaguiFixtureOneTsconfigPathsOrder
    delete (globalThis as any).__tamaguiFixtureOneConfigLifecycles
    delete (globalThis as any).__tamaguiFixtureOneTransformEnvironments
    await rm(path.join(fixtureRoot, 'node_modules'), { force: true, recursive: true })
    await rm(evaluationFixturePhysicalRuntimePath, { force: true, recursive: true })
    await rm(watchOutputRoot, { force: true, recursive: true })
    if (previousDisableSliderInterval === undefined) {
      delete process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL
    } else {
      process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL = previousDisableSliderInterval
    }
  }
})

test('clears loader state when closing an owned environment fails', async () => {
  const loader = createViteTamaguiLoader({ disable: true })
  await loader.loadTamaguiBuildConfig()
  const closeError = new Error('fixture close failed')
  const close = vi.fn().mockRejectedValue(closeError)
  loader.setEnvironment({ close } as any, { owned: true })

  await expect(loader.cleanup()).rejects.toBe(closeError)
  expect(close).toHaveBeenCalledOnce()
  expect(loader.getEnvironment()).toBeNull()
  expect(loader.getLoadPromise()).toBeNull()
  expect(loader.getTamaguiOptions()).toBeNull()
})

test('evaluates config and components through the app resolver and invalidates HMR', async () => {
  ;(globalThis as any).__tamaguiFixtureOwnedEvaluation = []
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
      ...environmentSpecificCompilerPlugins('serve'),
      ...fixturePlugins(undefined, true),
      fixtureTransformProbePlugin(),
      tamaguiPlugin({
        components: directPackageFixtureComponents,
        enableDynamicEvaluation: true,
        disableWatchTamaguiConfig: false,
      }),
    ],
  })
  servers.push(server)

  const clientEnvironment = server.environments.client
  const evaluationEnvironment = server.environments[TAMAGUI_EVALUATION_ENVIRONMENT]
  expect(
    clientEnvironment.config.define?.['process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL']
  ).toBeUndefined()
  expect(isRunnableDevEnvironment(evaluationEnvironment)).toBe(true)
  if (!isRunnableDevEnvironment(evaluationEnvironment)) {
    throw new Error('Expected a runnable Tamagui evaluation environment')
  }
  const resolvedCorePlugins = server.config.environments[
    TAMAGUI_EVALUATION_ENVIRONMENT
  ].plugins.filter((plugin) => isEvaluationCorePluginName(plugin.name))
  const evaluationCorePlugins = evaluationEnvironment.plugins.filter((plugin) =>
    isEvaluationCorePluginName(plugin.name)
  )
  expect(evaluationCorePlugins.length).toBeGreaterThan(0)
  expect(evaluationCorePlugins).toHaveLength(resolvedCorePlugins.length)
  expect(
    evaluationCorePlugins.every((plugin) => resolvedCorePlugins.includes(plugin))
  ).toBe(true)

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
  const inlinePackageResolution = await evaluationEnvironment.pluginContainer.resolveId(
    '@tamagui/config/v5',
    directConfigResolution!.id
  )
  const sliderResolution = await evaluationEnvironment.pluginContainer.resolveId(
    '@tamagui/slider',
    directConfigResolution!.id
  )
  const tamaguiResolution = await evaluationEnvironment.pluginContainer.resolveId(
    'tamagui',
    directConfigResolution!.id
  )
  const buttonResolution = await evaluationEnvironment.pluginContainer.resolveId(
    '@tamagui/button',
    directConfigResolution!.id
  )
  expect(inlinePackageResolution?.id).toMatch(
    /(?:node_modules\/@tamagui\/config|code\/core\/config)\/dist\/esm\/v5\.mjs$/
  )
  expect(inlinePackageResolution?.external).not.toBe(true)
  expect(sliderResolution?.id).toMatch(/\/slider\/dist\/esm\/index\.mjs$/)
  expect(sliderResolution?.external).not.toBe(true)
  expect(tamaguiResolution?.id).toMatch(/\/tamagui\/dist\/esm\/index\.mjs$/)
  expect(tamaguiResolution?.external).not.toBe(true)
  expect(buttonResolution?.id).toMatch(/\/button\/dist\/esm\/index\.mjs$/)
  expect(buttonResolution?.external).not.toBe(true)
  const externalPackages = evaluationEnvironment.config.resolve.external
  expect(externalPackages).toContain('@tamagui/evaluation-fixture')
  expect(externalPackages).toContain('@tamagui/shorthands')
  expect(externalPackages).not.toContain('tamagui')
  expect(externalPackages).not.toContain('@tamagui/config')
  expect(externalPackages).not.toContain('@tamagui/button')
  expect(externalPackages).not.toContain('@tamagui/core')
  expect(externalPackages).not.toContain('@tamagui/slider')
  expect(externalPackages).not.toContain('@tamagui/web')
  expect(externalPackages).not.toContain('@fixture/conditional')
  const directConfigModule = await evaluationEnvironment.runner.import(
    directConfigResolution!.id
  )
  expect(directConfigModule.compilerResolution).toBe(
    'browser:workspace-v1:user-plugin:serve-only'
  )
  expect(
    evaluationEnvironment.plugins.filter((plugin) => plugin.name === 'one:tsconfig-paths')
  ).toHaveLength(1)
  expect(directConfigModule.oneTsconfigPathsOrder).toBe('pre')
  expect(directConfigModule.packageExportResolution).toBe('package-export-esm')
  expect(directConfigModule.packageExportPath).toMatch(
    /\.evaluation-fixture-runtime\/esm\/value\.mjs$/
  )
  expect(directConfigModule.sliderIntervalDisabled).toBe('1')
  expect(directConfigModule.sliderModuleLoaded).toBe(true)
  expect(directConfigModule.sliderResolution).toEqual({
    id: sliderResolution?.id,
    external: false,
  })
  expect(directConfigModule.tamaguiBarrelLoaded).toBe(true)
  expect(directConfigModule.tamaguiResolution).toEqual({
    id: tamaguiResolution?.id,
    external: false,
  })
  expect(process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL).toBeUndefined()
  expect((globalThis as any).__tamaguiFixturePackageExportPath).toMatch(
    /\.evaluation-fixture-runtime\/esm\/value\.mjs$/
  )
  expect((globalThis as any).__tamaguiFixtureMetroFallbackUsed).toBeUndefined()
  expect((directConfigModule.default as any).media.sm).toEqual({ minWidth: 16 })
  expect(directConfigModule.evaluationPluginNames).toContain('vite:import-analysis')

  const firstEvaluation = await loader.evaluateProjectModules({
    config: 'tamagui.config.ts',
    components: directPackageFixtureComponents,
  })
  expect(firstEvaluation.config.module.compilerResolution).toBe(
    'browser:workspace-v1:user-plugin:serve-only'
  )
  expect((firstEvaluation.components[1].module.default as any).compilerResolution).toBe(
    'browser:workspace-v1:user-plugin:serve-only'
  )
  expect(firstEvaluation.components[2].module.Slider).toBeTruthy()
  expect(firstEvaluation.components[3].module.Button).toBeTruthy()
  expect((globalThis as any).__tamaguiFixtureEvaluationOrder).toEqual([
    'config',
    'component',
  ])
  const evaluationProbe = (globalThis as any).__tamaguiFixtureOwnedEvaluation
  expect(
    evaluationProbe.filter((entry: string) => entry === 'one:resolve:tamagui:config')
  ).toHaveLength(1)
  expect(
    evaluationProbe.filter((entry: string) => entry === 'one:resolve:tamagui:component')
  ).toHaveLength(1)
  expect(
    evaluationProbe.filter((entry: string) => entry === 'one:load:tamagui')
  ).toHaveLength(1)
  const evaluationPluginNames = directConfigModule.evaluationPluginNames as string[]
  expect(evaluationPluginNames.filter((name) => name === 'one:compiler')).toHaveLength(1)
  expect(
    evaluationPluginNames.filter((name) => name === 'one:compiler-css-to-js')
  ).toHaveLength(1)
  expect(
    evaluationPluginNames.filter((name) => name.includes('import-analysis'))
  ).toHaveLength(1)
  expect(evaluationPluginNames.filter((name) => name === 'alias')).toHaveLength(1)
  expect(
    evaluationPluginNames.filter((name) =>
      ['vite:resolve-dev', 'builtin:vite-resolve'].includes(name)
    )
  ).toHaveLength(1)
  expect(
    evaluationPluginNames.filter((name) => name === 'fixture-serve-resolver:environment')
  ).toHaveLength(1)
  expect(evaluationPluginNames).not.toContain('fixture-build-resolver:environment')
  expect(evaluationPluginNames).not.toContain('tamagui')
  expect(evaluationPluginNames).not.toContain('tamagui-extract')
  expect(evaluationPluginNames).not.toContain('tamagui-rnw-lite')
  expect(evaluationPluginNames.some((name) => name.startsWith('native:'))).toBe(false)
  expect((globalThis as any).__tamaguiFixtureOneConfigLifecycles).toEqual([
    'one:compiler:config',
    'one:compiler-css-to-js:config',
    'one:compiler:configResolved',
    'one:compiler-css-to-js:configResolved',
  ])
  expect((globalThis as any).__tamaguiFixtureOneTransformEnvironments).toBeUndefined()

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
  expect(
    ssrEnvironment.config.define?.['process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL']
  ).toBeUndefined()
  const firstSsrTransform = await ssrEnvironment.transformRequest('/src/App.tsx')
  expect(firstSsrTransform?.code).toBeTruthy()
  await Promise.all([
    clientEnvironment.waitForRequestsIdle(),
    ssrEnvironment.waitForRequestsIdle(),
  ])
  const initialTransformVisits = { ...getTransformVisits() }
  expect(initialTransformVisits.client).toBeGreaterThan(0)
  expect(initialTransformVisits.ssr).toBeGreaterThan(0)
  const oneTransformEnvironments = (globalThis as any)
    .__tamaguiFixtureOneTransformEnvironments as string[]
  expect(oneTransformEnvironments).toContain('one:compiler:client')
  expect(oneTransformEnvironments).toContain('one:compiler-css-to-js:client')
  expect(oneTransformEnvironments).toContain('one:compiler:ssr')
  expect(oneTransformEnvironments).toContain('one:compiler-css-to-js:ssr')
  expect(oneTransformEnvironments.some((entry) => entry.endsWith(':tamagui'))).toBe(false)

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
    expect(events.length, JSON.stringify(events, null, 2)).toBeLessThanOrEqual(1)
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
      ...environmentSpecificCompilerPlugins(),
      ...fixturePlugins(lifecycle, true),
      tamaguiPlugin({
        config: '#fixture-config',
        components: directPackageFixtureComponents,
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

  const buildOutput = getBuildOutput(result)

  expect(buildOutput).toContain('browser:workspace-v1:user-plugin:build-only')
  expect(buildOutput).not.toContain('serve-only')
  expectMediaPaddingCss(buildOutput, 21)
  expect(buildOutput).not.toContain('$fixture')
  const evaluationProbe = (globalThis as any).__tamaguiFixtureOwnedEvaluation
  const evaluationPluginNames = (globalThis as any).__tamaguiFixtureOwnedPluginNames
  expect(evaluationProbe).toContain('resolve:build')
  expect(evaluationProbe).toContain('import:config')
  expect(evaluationProbe).toContain('one:resolve:tamagui:config')
  expect(evaluationProbe).toContain('one:resolve:tamagui:component')
  expect(evaluationProbe).toContain('one:load:tamagui')
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
  expect(
    evaluationPluginNames.filter((name: string) => name === 'one:tsconfig-paths')
  ).toHaveLength(1)
  expect(evaluationPluginNames).toContain('one:compiler')
  expect(evaluationPluginNames).toContain('one:compiler-css-to-js')
  expect((globalThis as any).__tamaguiFixtureTsconfigPathsContext).toBe('tamagui')
  expect((globalThis as any).__tamaguiFixtureOneTsconfigPathsOrder).toBe('pre')
  expect((globalThis as any).__tamaguiFixturePackageExportPath).toMatch(
    /\.evaluation-fixture-runtime\/esm\/value\.mjs$/
  )
  expect((globalThis as any).__tamaguiFixturePackageExportResolution).toBe(
    'package-export-esm'
  )
  expect((globalThis as any).__tamaguiFixtureSliderIntervalDisabled).toBe('1')
  expect((globalThis as any).__tamaguiFixtureSliderModuleLoaded).toBe(true)
  expect((globalThis as any).__tamaguiFixtureSliderResolution).toEqual({
    id: expect.stringMatching(/\/slider\/dist\/esm\/index\.mjs$/),
    external: false,
  })
  expect((globalThis as any).__tamaguiFixtureTamaguiBarrelLoaded).toBe(true)
  expect(process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL).toBeUndefined()
  expect((globalThis as any).__tamaguiFixtureMetroFallbackUsed).toBeUndefined()
  expect(lifecycle).toEqual({
    options: 1,
    buildStart: 1,
    buildEnd: 1,
    closeBundle: 1,
  })
  await expect(access(path.join(fixtureRoot, '.tamagui'))).rejects.toThrow()
})

test('keeps the owned runner alive across concurrent builds sharing one plugin', async () => {
  const originalConfigSpace = await readFile(configSpacePath, 'utf8')
  const slowOutDir = path.join(fixtureRoot, '.concurrent-slow')
  const fastOutDir = path.join(fixtureRoot, '.concurrent-fast')
  const afterCleanupOutDir = path.join(fixtureRoot, '.concurrent-after')
  let holdSlowTransform = true
  let thirdBuildPassedCleanup = false
  let markSlowTransformStarted!: () => void
  let releaseSlowTransform!: () => void
  let markCleanupStarted!: () => void
  let releaseCleanup!: () => void
  let markThirdBuildStarted!: () => void
  let markThirdBuildPassedCleanup!: () => void
  const slowTransformStarted = new Promise<void>((resolve) => {
    markSlowTransformStarted = resolve
  })
  const slowTransformRelease = new Promise<void>((resolve) => {
    releaseSlowTransform = resolve
  })
  const cleanupStarted = new Promise<void>((resolve) => {
    markCleanupStarted = resolve
  })
  const cleanupRelease = new Promise<void>((resolve) => {
    releaseCleanup = resolve
  })
  const thirdBuildStarted = new Promise<void>((resolve) => {
    markThirdBuildStarted = resolve
  })
  const thirdBuildPassedCleanupPromise = new Promise<void>((resolve) => {
    markThirdBuildPassedCleanup = resolve
  })

  const slowTransformGate: Plugin = {
    name: 'fixture-concurrent-build-gate',
    enforce: 'pre',
    buildStart: {
      order: 'pre',
      sequential: true,
      handler() {
        if (this.environment.config.build.outDir === afterCleanupOutDir) {
          markThirdBuildStarted()
        }
      },
    },
    resolveId() {
      const environment = this.environment as any
      if (
        environment.name === TAMAGUI_EVALUATION_ENVIRONMENT &&
        !environment.__tamaguiFixtureClosePatched
      ) {
        environment.__tamaguiFixtureClosePatched = true
        const close = environment.close.bind(environment)
        environment.close = async () => {
          markCleanupStarted()
          await cleanupRelease
          await close()
        }
      }
    },
    transform: {
      order: 'pre',
      async handler(_source, id) {
        if (
          holdSlowTransform &&
          this.environment.config.build.outDir === slowOutDir &&
          path.resolve(id.split('?')[0]) === appPath
        ) {
          holdSlowTransform = false
          markSlowTransformStarted()
          await slowTransformRelease
        }
      },
    },
  }
  const releaseAfterTamaguiBuildEnd: Plugin = {
    name: 'fixture-release-concurrent-build',
    buildStart: {
      order: 'post',
      sequential: true,
      handler() {
        if (this.environment.config.build.outDir === afterCleanupOutDir) {
          thirdBuildPassedCleanup = true
          markThirdBuildPassedCleanup()
        }
      },
    },
    buildEnd: {
      order: 'post',
      sequential: true,
      handler() {
        if (this.environment.config.build.outDir === fastOutDir) {
          releaseSlowTransform()
        }
      },
    },
  }
  const sharedPlugins = [
    slowTransformGate,
    ...fixturePlugins(),
    tamaguiPlugin({
      config: '#fixture-config',
      components: fixtureComponents,
      enableDynamicEvaluation: true,
    }),
    releaseAfterTamaguiBuildEnd,
  ]
  const runBuild = (outDir: string) =>
    build({
      configFile: false,
      root: fixtureRoot,
      logLevel: 'silent',
      resolve: {
        alias: fixtureAliases,
      },
      plugins: sharedPlugins,
      build: {
        outDir,
        write: false,
        lib: {
          entry: appPath,
          formats: ['es'],
        },
      },
    })

  try {
    const slowBuild = runBuild(slowOutDir)
    await slowTransformStarted
    const fastBuild = runBuild(fastOutDir)
    const fastResult = await fastBuild
    await cleanupStarted

    await writeFile(configSpacePath, originalConfigSpace.replace('1', '4'))
    const afterCleanupBuild = runBuild(afterCleanupOutDir)
    await thirdBuildStarted
    expect(thirdBuildPassedCleanup).toBe(false)
    releaseCleanup()
    await thirdBuildPassedCleanupPromise

    const [slowResult, afterCleanupResult] = await Promise.all([
      slowBuild,
      afterCleanupBuild,
    ])

    for (const result of [slowResult, fastResult]) {
      const output = getBuildOutput(result)
      expect(output).toContain('className')
      expect(output).not.toContain('$fixture')
      expectMediaPaddingCss(output, 21)
    }

    const rebuiltOutput = getBuildOutput(afterCleanupResult)
    expectMediaPaddingCss(rebuiltOutput, 24)
  } finally {
    releaseSlowTransform()
    releaseCleanup()
    await writeFile(configSpacePath, originalConfigSpace)
  }
}, 30_000)

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

import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { promisify } from 'node:util'
import { runInNewContext } from 'node:vm'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, describe, expect, test } from 'vitest'

import { loadTamaguiSync } from '@tamagui/static'

import { compileWithUserBabel } from '../src/babel'
import { METRO_COMPILER_CACHE_VERSION } from '../src/compilerCache'
import { MetroCompilerFrontend } from '../src/frontend'
import { createMetroCompilerTransformer } from '../src/transformer'
import { composeMetroGetTransformOptions } from '../src/transformOptions'

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const transformerPath = resolve(packageRoot, 'test/fixtures/user-babel-transformer.cjs')
const cacheReaderPath = resolve(packageRoot, 'test/fixtures/cache-reader.cjs')
const builtTransformerPath = resolve(packageRoot, 'dist/cjs/transformer.cjs')
const tamaguiConfigPath = resolve(
  packageRoot,
  '../static-tests/tests/lib/tamagui.config.cjs'
)
const temporaryRoots: string[] = []
const execFileAsync = promisify(execFile)
const requireFromTest = createRequire(import.meta.url)
const generateModule = requireFromTest('@babel/generator')
const generate = generateModule.default ?? generateModule

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((path) => rm(path, { recursive: true, force: true }))
  )
})

async function write(path: string, source: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, source, 'utf8')
}

function outputCode(result: { ast: Record<string, any> }): string {
  return generate(result.ast, { comments: true }).code
}

function findObjectProperty(ast: unknown, name: string): Record<string, any> | null {
  const seen = new Set<object>()
  const visit = (value: unknown): Record<string, any> | null => {
    if (!value || typeof value !== 'object' || seen.has(value as object)) return null
    seen.add(value as object)
    if (Array.isArray(value)) {
      for (const child of value) {
        const found = visit(child)
        if (found) return found
      }
      return null
    }
    const node = value as Record<string, any>
    if (
      node.type === 'ObjectProperty' &&
      (node.key?.name === name || node.key?.value === name)
    ) {
      return node
    }
    for (const [key, child] of Object.entries(node)) {
      if (key === 'loc' || key === 'tokens') continue
      const found = visit(child)
      if (found) return found
    }
    return null
  }
  return visit(ast)
}

function executeNativeOutput(code: string): unknown {
  const babel = requireFromTest('@babel/core')
  const commonJsModule = requireFromTest('@babel/plugin-transform-modules-commonjs')
  const commonJs = commonJsModule.default ?? commonJsModule
  const transformed = babel.transformSync(code, {
    babelrc: false,
    configFile: false,
    plugins: [commonJs],
  })?.code
  if (!transformed) throw new Error('Native execution fixture did not compile')
  const module = { exports: {} as Record<string, any> }
  const Fragment = Symbol('Fragment')
  const jsx = (type: any, props: Record<string, unknown>) => {
    if (type === Fragment) return props.children
    return typeof type === 'function' ? type(props) : { type, props }
  }
  const fixtureRequire = (specifier: string) => {
    if (specifier === '@fixture/ui') {
      return { View: (props: Record<string, unknown>) => ({ host: 'runtime', props }) }
    }
    if (specifier === '~tokens') return { spacing: 12 }
    if (specifier === 'react/jsx-runtime') return { Fragment, jsx, jsxs: jsx }
    if (specifier === 'react-native') {
      return {
        View: (props: Record<string, unknown>) => ({ host: 'native', props }),
      }
    }
    throw new Error(`Unexpected native execution dependency: ${specifier}`)
  }
  runInNewContext(transformed, {
    exports: module.exports,
    module,
    require: fixtureRequire,
  })
  return module.exports.App({ dynamic: 9 })
}

describe('E4 Metro compiler frontend', () => {
  test('publishes post-Babel lowering plans for isolated workers and invalidates exact edges', async () => {
    const fixtureRoot = await mkdtemp(join(packageRoot, 'test/.e4-fixture-'))
    temporaryRoots.push(fixtureRoot)
    const projectRoot = join(fixtureRoot, 'app')
    const appPath = join(projectRoot, 'src/App.tsx')
    const tokensPath = join(projectRoot, 'src/tokens.ts')
    const themePath = join(fixtureRoot, 'packages/theme/index.ts')
    const uiPath = join(fixtureRoot, 'packages/ui/index.ts')
    const cacheRoot = join(fixtureRoot, 'cache')
    const appSource = `
import { View } from '@fixture/ui'
import { spacing } from '~tokens'
export const App = ({ dynamic }) => <>
  <View padding={spacing} marker={USER_PLUGIN_VALUE} data-lowered="yes" />
  <View padding={dynamic} data-runtime="preserved" />
</>
`
    await write(join(projectRoot, 'package.json'), '{"name":"e4-fixture"}\n')
    await write(appPath, appSource)
    await write(tokensPath, `export { space as spacing } from '@fixture/theme'\n`)
    await write(themePath, 'export const space = 12\n')
    await write(uiPath, 'export const View = (_props) => null\n')

    const loadedProject = loadTamaguiSync({
      platform: 'native',
      config: tamaguiConfigPath,
      components: ['@tamagui/core'],
    })
    const viewInfo = loadedProject.components?.find(
      ({ moduleName }) => moduleName === '@tamagui/core'
    )?.nameToInfo.View
    expect(viewInfo).toBeTruthy()
    const compilerProject = {
      projectInfo: {
        ...loadedProject,
        components: [
          {
            moduleName: '@fixture/ui',
            nameToInfo: { View: viewInfo! },
          },
        ],
      },
      componentModules: [{ moduleName: '@fixture/ui', id: uiPath }],
      generation: 'e4-native-fixture-v1',
    }

    const resolvedByUser: string[] = []
    let nextScanGate: Promise<void> | null = null
    let notifyScanStarted: (() => void) | null = null
    const resolveRequest = (context: any, specifier: string, platform: string) => {
      resolvedByUser.push(`${platform}:${specifier}`)
      if (specifier === '~tokens') return { type: 'sourceFile', filePath: tokensPath }
      if (specifier === '@fixture/theme') {
        return { type: 'sourceFile', filePath: themePath }
      }
      if (specifier === '@fixture/ui') return { type: 'sourceFile', filePath: uiPath }
      return context.resolveRequest(context, specifier, platform)
    }
    const frontend = new MetroCompilerFrontend({
      projectRoot,
      cacheRoot,
      watch: false,
      originalBabelTransformerPath: transformerPath,
      loadCompilerProject: async () => {
        const gate = nextScanGate
        if (gate) {
          nextScanGate = null
          notifyScanStarted?.()
          notifyScanStarted = null
          await gate
        }
        return compilerProject
      },
      resolver: {
        resolveRequest,
        sourceExts: ['js', 'jsx', 'ts', 'tsx'],
        unstable_enablePackageExports: true,
      },
    })

    try {
      const productionOptions = {
        dev: false,
        entryFiles: [appPath],
        hot: true,
        platform: 'ios',
        transform: {},
      }
      const concurrentScans = await Promise.all([
        frontend.ensureValidCache(productionOptions),
        frontend.ensureValidCache(productionOptions),
      ])
      expect(concurrentScans[0].moduleIds).toContain(appPath)
      expect(concurrentScans[1].moduleIds).toContain(appPath)

      const getTransformOptions = composeMetroGetTransformOptions(frontend, async () => ({
        transform: { experimentalImportSupport: true },
      }))
      const returnedOptions = await getTransformOptions(
        [appPath],
        { dev: true, hot: true, platform: 'ios' },
        async () => []
      )
      expect(returnedOptions.transform?.experimentalImportSupport).toBe(true)
      const generation = await frontend.ensureValidCache({
        dev: true,
        entryFiles: [appPath],
        hot: true,
        platform: 'ios',
        transform: returnedOptions.transform,
      })
      expect(frontend.metroResolverVersion).toMatch(/^0\.83\./)
      expect(generation.moduleIds).toEqual(
        expect.arrayContaining([appPath, tokensPath, themePath, uiPath])
      )
      expect(resolvedByUser).toEqual(
        expect.arrayContaining(['ios:~tokens', 'ios:@fixture/theme', 'ios:@fixture/ui'])
      )

      let releaseScan!: () => void
      nextScanGate = new Promise<void>((resolve) => {
        releaseScan = resolve
      })
      const scanStarted = new Promise<void>((resolve) => {
        notifyScanStarted = resolve
      })
      const rescan = frontend.scan({
        dev: true,
        entryFiles: [appPath],
        hot: true,
        platform: 'ios',
        transform: returnedOptions.transform,
      })
      await scanStarted
      let updateFinished = false
      const updateDuringScan = frontend.updateFile(themePath).then((result) => {
        updateFinished = true
        return result
      })
      await new Promise((resolve) => setTimeout(resolve, 20))
      expect(updateFinished).toBe(false)
      releaseScan()
      await Promise.all([rescan, updateDuringScan])

      const args = {
        filename: appPath,
        src: appSource,
        plugins: [],
        options: {
          dev: true,
          hot: true,
          platform: 'ios',
          projectRoot,
          experimentalImportSupport: true,
        },
      }
      const firstWorker = createMetroCompilerTransformer({
        cacheBaseRoot: cacheRoot,
        originalBabelTransformerPath: transformerPath,
      })
      const secondWorker = createMetroCompilerTransformer({
        cacheBaseRoot: cacheRoot,
        originalBabelTransformerPath: transformerPath,
      })
      const [first, second] = await Promise.all([
        firstWorker.transform(args),
        secondWorker.transform(args),
      ])
      expect(first.metadata?.fixtureUserPlugin).toBe('ran-before-tamagui')
      expect(first.metadata?.tamagui.cacheHit).toBe(true)
      expect(second.metadata?.tamagui.cacheHit).toBe(true)
      expect(first.metadata?.tamagui.lowering).toMatchObject({
        applied: true,
        sourceMapComposed: true,
        stats: { found: 2, lowered: 1, flattened: 1, bailed: 1 },
      })
      const firstCode = outputCode(first)
      expect(firstCode).toContain(
        "const __TamaguiNativeView = require('react-native').View"
      )
      expect(firstCode).toContain('"paddingTop": 12')
      expect(firstCode).toContain('marker: 44')
      expect(firstCode).toContain('data-lowered')
      expect(firstCode).toContain('padding: dynamic')
      expect(firstCode).toContain('data-runtime')
      expect(firstCode).not.toContain('analysis-marker')
      expect(outputCode(second)).toBe(firstCode)
      expect(findObjectProperty(first.ast, 'style')?.start).toBe(
        appSource.indexOf('padding={spacing}')
      )
      expect(findObjectProperty(first.ast, 'data-runtime')?.start).toBe(
        appSource.indexOf('data-runtime')
      )
      expect(executeNativeOutput(firstCode)).toEqual([
        expect.objectContaining({
          host: 'native',
          props: expect.objectContaining({
            style: expect.objectContaining({ paddingTop: 12 }),
            marker: 44,
          }),
        }),
        expect.objectContaining({
          host: 'runtime',
          props: expect.objectContaining({ padding: 9 }),
        }),
      ])

      const workerInputPath = join(fixtureRoot, 'worker-input.json')
      await write(workerInputPath, JSON.stringify(args))
      const readFromIsolatedWorker = async () =>
        JSON.parse(
          (
            await execFileAsync(
              process.execPath,
              [
                cacheReaderPath,
                builtTransformerPath,
                cacheRoot,
                transformerPath,
                workerInputPath,
              ],
              { encoding: 'utf8' }
            )
          ).stdout
        )
      const [isolatedWorker, secondIsolatedWorker] = await Promise.all([
        readFromIsolatedWorker(),
        readFromIsolatedWorker(),
      ])
      expect(isolatedWorker).toMatchObject({
        cacheHit: true,
        fixtureUserPlugin: 'ran-before-tamagui',
        lowering: { applied: true, sourceMapComposed: true },
      })
      expect(isolatedWorker.code).toBe(firstCode)
      expect(secondIsolatedWorker).toEqual(isolatedWorker)

      await write(themePath, 'export const space = 14\n')
      const themeUpdate = await frontend.updateFile(themePath)
      expect(themeUpdate.changed).toBe(true)
      expect(themeUpdate.affectedIds).toEqual([appPath, themePath, tokensPath].sort())
      const afterTheme = await firstWorker.transform(args)
      expect(outputCode(afterTheme)).toContain('"paddingTop": 14')

      await write(tokensPath, 'export const spacing = 5\n')
      const tokenUpdate = await frontend.updateFile(tokensPath)
      expect(tokenUpdate.affectedIds).toEqual([appPath, tokensPath].sort())
      await write(themePath, 'export const space = 18\n')
      const detachedThemeUpdate = await frontend.updateFile(themePath)
      expect(detachedThemeUpdate.affectedIds).toEqual([themePath])
      const afterDetach = await secondWorker.transform(args)
      expect(outputCode(afterDetach)).toContain('"paddingTop": 5')

      const compiled = await compileWithUserBabel(transformerPath, args)
      expect(compiled.code).toContain('jsx')
      const manifestPath = join(
        cacheRoot,
        'ios',
        `v${METRO_COMPILER_CACHE_VERSION}`,
        'manifest.json'
      )
      const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
      const appBlob = manifest.entries[appPath].blobHash
      await write(
        join(
          cacheRoot,
          'ios',
          `v${METRO_COMPILER_CACHE_VERSION}`,
          'blobs',
          `${appBlob}.json`
        ),
        '{broken'
      )
      const recovered = await frontend.ensureValidCache({
        dev: true,
        entryFiles: [appPath],
        hot: true,
        platform: 'ios',
        transform: { experimentalImportSupport: true },
      })
      expect(recovered.moduleIds).toContain(appPath)
      const afterRecovery = await firstWorker.transform(args)
      expect(afterRecovery.metadata?.tamagui.cacheHit).toBe(true)
      expect(outputCode(afterRecovery)).toContain('"paddingTop": 5')

      await frontend.ensureValidCache({
        dev: false,
        entryFiles: [appPath],
        // Expo production exports may still report hot=true. Production must not retain
        // the graph or thousands of file watchers after the prepass has published.
        hot: true,
        platform: 'ios',
        transform: { experimentalImportSupport: true },
      })
      await write(themePath, 'export const space = 20\n')
      expect(await frontend.updateFile(themePath)).toEqual({
        changed: false,
        affectedIds: [],
        generation: null,
      })
    } finally {
      await frontend.close()
    }
  })
})

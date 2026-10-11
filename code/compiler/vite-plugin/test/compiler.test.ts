import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

import {
  CompilerSession,
  resolvedModuleId,
  type HostModuleInput,
} from '@tamagui/compiler-core'
import {
  CompilerFrontend,
  createTamaguiCompilerHost,
  loadTamaguiSync,
} from '@tamagui/static'
import { afterAll, beforeAll, expect, test } from 'vitest'

const root = resolve(import.meta.dirname, 'fixtures/compiler')
const appId = resolve(root, 'App.compiled.jsx')
const tokensId = resolve(root, 'tokens.ts')
const coreId = resolve(root, 'node_modules/@tamagui/core/index.mjs')
const runtimeId = resolve(root, 'node_modules/react/jsx-runtime.js')
const configPath = resolve(
  import.meta.dirname,
  '../../static-tests/tests/lib/tamagui.config.cjs'
)

let projectInfo: ReturnType<typeof loadTamaguiSync>
const temporaryRoots: string[] = []

afterAll(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((path) => rm(path, { recursive: true, force: true }))
  )
})

beforeAll(() => {
  projectInfo = loadTamaguiSync({
    platform: 'web',
    config: configPath,
    components: ['@tamagui/core'],
  })
})

test('Vite-owned resolver graph lowers compiled JSX and invalidates linked aliases', async () => {
  const frontend = new CompilerFrontend()
  const source = `
// π🙂 Vite compiled source-map sentinel
import { jsx } from 'react/jsx-runtime'
import { View } from '@tamagui/core'
import { space } from '~/tokens'
export const App = () => jsx(View, { padding: space, 'data-compiled': 'yes' })
`
  let tokenSource = 'export const space = 12\n'
  let resolveCalls = 0
  let loadCalls = 0
  const compile = (generation = 'vite-e3-fixture-v1') =>
    frontend.compile({
      id: appId,
      source,
      root,
      target: 'web',
      project: {
        projectInfo,
        componentModules: [{ moduleName: '@tamagui/core', id: coreId }],
        generation,
      },
      async resolve(specifier) {
        resolveCalls++
        if (specifier === '@tamagui/core') return { id: coreId }
        if (specifier === 'react/jsx-runtime') return { id: runtimeId, external: true }
        if (specifier === '~/tokens') return { id: tokensId }
        return null
      },
      async load(id) {
        loadCalls++
        return id === tokensId ? tokenSource : null
      },
    })

  const first = await compile()
  expect(first.plan.diagnostics).toEqual([])
  expect(first.output.code).toMatch(/jsx\("div", \{ className: "[^"]+"/)
  expect(first.output.code).toContain("'data-compiled': 'yes'")
  expect(first.plan.css).toContain('padding:12px')
  expect(first.plan.dependencies).toContain(resolvedModuleId(tokensId))
  expect(frontend.parseCount(appId)).toBe(1)
  expect(frontend.parseCount(tokensId)).toBe(1)
  expect(frontend.has(tokensId)).toBe(true)
  expect(frontend.dependentsOf(tokensId)).toContain(resolvedModuleId(appId))

  const resolvedAfterFirstCompile = resolveCalls
  const loadedAfterFirstCompile = loadCalls
  const repeated = await compile()
  expect(repeated.output.code).toBe(first.output.code)
  expect(repeated.plan.css).toBe(first.plan.css)
  expect(resolveCalls).toBe(resolvedAfterFirstCompile)
  expect(loadCalls).toBe(loadedAfterFirstCompile)

  tokenSource = 'export const space = 16\n'
  const invalidatedIds = await frontend.update({
    id: tokensId,
    source: tokenSource,
    root,
    target: 'web',
    project: {
      projectInfo,
      componentModules: [{ moduleName: '@tamagui/core', id: coreId }],
      generation: 'vite-e3-fixture-v1',
    },
    async resolve() {
      return null
    },
    async load() {
      return null
    },
  })
  expect(invalidatedIds).toContain(resolvedModuleId(appId))
  expect(frontend.parseCount(appId)).toBe(1)
  expect(frontend.parseCount(tokensId)).toBe(2)

  const resolvedBeforeRecompile = resolveCalls
  const loadedBeforeRecompile = loadCalls

  const second = await compile()
  expect(second.plan.css).toContain('padding:16px')
  expect(second.plan.css).not.toContain('padding:12px')
  expect(second.invalidatedIds).toEqual([])
  expect(frontend.parseCount(appId)).toBe(1)
  expect(frontend.parseCount(tokensId)).toBe(2)
  expect(resolveCalls).toBe(resolvedBeforeRecompile)
  expect(loadCalls).toBe(loadedBeforeRecompile)

  const removed = await frontend.remove(tokensId)
  expect(removed.invalidatedIds).toContain(resolvedModuleId(appId))
  tokenSource = 'export const space = 20\n'
  const afterRemoval = await compile()
  expect(afterRemoval.plan.css).toContain('padding:20px')
  expect(resolveCalls).toBeGreaterThan(resolvedBeforeRecompile)
  expect(loadCalls).toBeGreaterThan(loadedBeforeRecompile)

  const resolvedBeforeGenerationChange = resolveCalls
  const loadedBeforeGenerationChange = loadCalls
  const nextGeneration = await compile('vite-e3-fixture-v2')
  expect(nextGeneration.plan.css).toContain('padding:20px')
  expect(resolveCalls).toBeGreaterThan(resolvedBeforeGenerationChange)
  expect(loadCalls).toBeGreaterThan(loadedBeforeGenerationChange)
})

test.each([
  ['client', 12, 'ssr', 24],
  ['ssr', 24, 'client', 12],
])(
  'frontend isolates %s (%spx) then %s (%spx) resolver graphs',
  async (firstEnvironment, firstSpace, secondEnvironment, secondSpace) => {
    const frontend = new CompilerFrontend()
    const appId = join(root, 'environment-app.tsx')
    const source = `
import { jsx } from 'react/jsx-runtime'
import { View } from '@tamagui/core'
import { space } from '~/tokens'
export const App = () => jsx(View, { padding: space })
`
    const tokenIds = {
      client: join(root, 'client-tokens.ts'),
      ssr: join(root, 'ssr-tokens.ts'),
    }
    const spaces = { client: 12, ssr: 24 }
    const compile = (environment: 'client' | 'ssr') =>
      frontend.compile({
        id: appId,
        source,
        root,
        target: 'web',
        environment,
        project: {
          projectInfo,
          componentModules: [{ moduleName: '@tamagui/core', id: coreId }],
          generation: 'shared-generation',
          cacheStamp: null,
        },
        async resolve(specifier) {
          if (specifier === '@tamagui/core') return { id: coreId }
          if (specifier === 'react/jsx-runtime') return { id: runtimeId, external: true }
          if (specifier === '~/tokens') return { id: tokenIds[environment] }
          return null
        },
        async load(id) {
          return id === tokenIds[environment]
            ? `export const space = ${spaces[environment]}\n`
            : null
        },
      })

    const first = await compile(firstEnvironment as 'client' | 'ssr')
    expect(first.plan.css).toContain(`padding:${firstSpace}px`)
    const second = await compile(secondEnvironment as 'client' | 'ssr')
    expect(second.plan.css).toContain(`padding:${secondSpace}px`)
    expect(second.plan.css).not.toContain(`padding:${firstSpace}px`)
  }
)

test('generic compiler session consumes only canonical host-resolved modules', async () => {
  const session = new CompilerSession()
  const appModule: HostModuleInput = {
    id: resolvedModuleId(appId),
    source: `
import { jsx } from 'react/jsx-runtime'
import { View } from '@tamagui/core'
import { space } from '~/tokens'
export const App = () => jsx(View, { padding: space })
`,
    imports: [
      {
        specifier: 'react/jsx-runtime',
        resolvedId: resolvedModuleId(runtimeId),
        external: true,
      },
      {
        specifier: '@tamagui/core',
        resolvedId: resolvedModuleId(coreId),
        external: true,
      },
      {
        specifier: '~/tokens',
        resolvedId: resolvedModuleId(tokensId),
      },
    ],
  }
  const tokenModule: HostModuleInput = {
    id: resolvedModuleId(tokensId),
    source: 'export const space = 20\n',
    imports: [],
  }
  const host = createTamaguiCompilerHost({
    target: 'web',
    tamaguiConfig: projectInfo.tamaguiConfig!,
    components: projectInfo.components!,
    componentModules: [{ moduleName: '@tamagui/core', resolvedId: coreId }],
  })
  const adapter = {
    target: 'web' as const,
    projectGeneration: 'generic-session-v1',
    host,
    async load(id: string) {
      return id === tokensId ? tokenModule : null
    },
  }

  const first = await session.compile({ module: appModule, adapter })
  expect(first.plan.css).toContain('padding:20px')
  expect(first.plan.diagnostics).toEqual([])
  expect(session.has(tokenModule.id)).toBe(true)
  expect(session.dependentsOf(tokenModule.id)).toEqual([appModule.id])
  expect(session.parseCount(appModule.id)).toBe(1)

  const invalidated = await session.update({
    ...tokenModule,
    source: 'export const space = 24\n',
  })
  expect(invalidated).toEqual([tokenModule.id, appModule.id].sort())
  expect(session.parseCount(appModule.id)).toBe(1)

  const second = await session.compile({ module: appModule, adapter })
  expect(second.plan.css).toContain('padding:24px')
  expect(second.plan.css).not.toContain('padding:20px')
  expect((await session.remove(tokenModule.id)).invalidatedIds).toContain(appModule.id)
})

test('generic compiler session serializes updates behind an active compile', async () => {
  const session = new CompilerSession()
  const tokenId = resolvedModuleId(tokensId)
  const module: HostModuleInput = {
    id: resolvedModuleId(appId),
    source: `import { space } from '~/tokens'\nexport const value = space\n`,
    imports: [{ specifier: '~/tokens', resolvedId: tokenId }],
  }
  const oldTokens: HostModuleInput = {
    id: tokenId,
    source: 'export const space = 20\n',
    imports: [],
  }
  const newTokens: HostModuleInput = {
    ...oldTokens,
    source: 'export const space = 24\n',
  }
  let releaseLoad!: () => void
  const loadGate = new Promise<void>((resolve) => {
    releaseLoad = resolve
  })
  const host = createTamaguiCompilerHost({
    target: 'web',
    tamaguiConfig: projectInfo.tamaguiConfig!,
    components: projectInfo.components!,
    componentModules: [],
  })
  const adapter = {
    target: 'web' as const,
    projectGeneration: 'concurrent-session-v1',
    host,
    async load(id: string) {
      if (id !== tokenId) return null
      await loadGate
      return oldTokens
    },
  }

  const compile = session.compile({ module, adapter })
  const update = session.update(newTokens)
  releaseLoad()
  await compile

  expect(await update).toContain(tokenId)
  expect(session.dependentsOf(tokenId)).toEqual([module.id])
  expect(await session.update(newTokens)).toEqual([])
})

test('a fresh frontend reuses plans off disk and recompiles what a dependency edit reached', async () => {
  // the plan cache is rooted at the project root, so each run gets its own
  const cacheRoot = await mkdtemp(join(tmpdir(), 'tamagui-vite-plan-cache-'))
  temporaryRoots.push(cacheRoot)
  const cachedAppId = join(cacheRoot, 'App.compiled.jsx')
  const cachedTokensId = join(cacheRoot, 'tokens.ts')
  const source = `
import { jsx } from 'react/jsx-runtime'
import { View } from '@tamagui/core'
import { space } from '~/tokens'
export const App = () => jsx(View, { padding: space })
`
  let tokenSource = 'export const space = 12\n'
  const compile = (frontend: CompilerFrontend, cacheStamp: string | null) =>
    frontend.compile({
      id: cachedAppId,
      source,
      root: cacheRoot,
      target: 'web',
      project: {
        projectInfo,
        componentModules: [{ moduleName: '@tamagui/core', id: coreId }],
        generation: 'vite-plan-cache-v1',
        cacheStamp,
      },
      async resolve(specifier) {
        if (specifier === '@tamagui/core') return { id: coreId }
        if (specifier === 'react/jsx-runtime') return { id: runtimeId, external: true }
        if (specifier === '~/tokens') return { id: cachedTokensId }
        return null
      },
      async load(id) {
        return id === cachedTokensId ? tokenSource : null
      },
    })

  const first = new CompilerFrontend()
  const cold = await compile(first, 'stamp-one')
  expect(cold.plan.css).toContain('padding:12px')
  expect(first.planCacheStats).toMatchObject({ hits: 0, writes: 1 })

  // a new frontend is a new process: the plan comes off disk and is identical
  const second = new CompilerFrontend()
  const restored = await compile(second, 'stamp-one')
  expect(second.planCacheStats).toMatchObject({ hits: 1, misses: 0, writes: 0 })
  expect(restored.plan).toEqual(cold.plan)
  expect(restored.output.code).toBe(cold.output.code)

  // the dependency changes and the consumer's own source does not, so a key
  // over its own bytes would serve the stale 12px here
  tokenSource = 'export const space = 16\n'
  const third = new CompilerFrontend()
  const afterEdit = await compile(third, 'stamp-one')
  expect(afterEdit.plan.css).toContain('padding:16px')
  expect(afterEdit.plan.css).not.toContain('padding:12px')
  expect(third.planCacheStats).toMatchObject({ hits: 0, misses: 1, writes: 1 })

  // a different compiler or config identity reuses nothing
  const fourth = new CompilerFrontend()
  await compile(fourth, 'stamp-two')
  expect(fourth.planCacheStats).toMatchObject({ hits: 0, misses: 1 })

  // and a project that cannot name its stamp sources caches nothing at all
  const fifth = new CompilerFrontend()
  await compile(fifth, null)
  expect(fifth.planCacheStats).toEqual({ hits: 0, misses: 0, writes: 0 })
})

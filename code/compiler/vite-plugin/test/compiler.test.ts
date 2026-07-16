import { resolve } from 'node:path'

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
import { beforeAll, expect, test } from 'vitest'

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
  const compile = () =>
    frontend.compile({
      id: appId,
      source,
      root,
      target: 'web',
      project: {
        projectInfo,
        componentModules: [{ moduleName: '@tamagui/core', id: coreId }],
        generation: 'vite-e3-fixture-v1',
      },
      async resolve(specifier) {
        if (specifier === '@tamagui/core') return { id: coreId }
        if (specifier === 'react/jsx-runtime') return { id: runtimeId, external: true }
        if (specifier === '~/tokens') return { id: tokensId }
        return null
      },
      async load(id) {
        return id === tokensId ? tokenSource : null
      },
    })

  const first = await compile()
  expect(first.plan.diagnostics).toEqual([])
  expect(first.output.code).toMatch(/jsx\("div", \{ className: "[^"]+"/)
  expect(first.output.code).toContain("'data-compiled': 'yes'")
  expect(first.plan.css).toContain('padding-top:12px')
  expect(first.plan.dependencies).toContain(resolvedModuleId(tokensId))
  expect(frontend.parseCount(appId)).toBe(1)
  expect(frontend.parseCount(tokensId)).toBe(1)
  expect(frontend.has(tokensId)).toBe(true)
  expect(frontend.dependentsOf(tokensId)).toContain(resolvedModuleId(appId))

  tokenSource = 'export const space = 16\n'
  const invalidatedIds = await frontend.update({
    id: tokensId,
    source: tokenSource,
    root,
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

  const second = await compile()
  expect(second.plan.css).toContain('padding-top:16px')
  expect(second.plan.css).not.toContain('padding-top:12px')
  expect(second.invalidatedIds).toEqual([])
  expect(frontend.parseCount(appId)).toBe(1)
  expect(frontend.parseCount(tokensId)).toBe(2)
})

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
  expect(first.plan.css).toContain('padding-top:20px')
  expect(first.plan.diagnostics).toEqual([])
  expect(session.has(tokenModule.id)).toBe(true)
  expect(session.dependentsOf(tokenModule.id)).toEqual([appModule.id])
  expect(session.parseCount(appModule.id)).toBe(1)

  const invalidated = session.update({
    ...tokenModule,
    source: 'export const space = 24\n',
  })
  expect(invalidated).toEqual([tokenModule.id, appModule.id].sort())
  expect(session.parseCount(appModule.id)).toBe(1)

  const second = await session.compile({ module: appModule, adapter })
  expect(second.plan.css).toContain('padding-top:24px')
  expect(second.plan.css).not.toContain('padding-top:20px')
  expect(session.remove(tokenModule.id).invalidatedIds).toContain(appModule.id)
})

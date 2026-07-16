import { resolve } from 'node:path'

import { resolvedModuleId } from '@tamagui/compiler-core'
import { CompilerFrontend, loadTamaguiSync } from '@tamagui/static'
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

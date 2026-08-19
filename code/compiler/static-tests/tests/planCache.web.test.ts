import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { tmpdir } from 'node:os'

import {
  ModulePlanCache,
  PLAN_CACHE_SCHEMA_VERSION,
  ProjectGraph,
  contentHash,
  materializeModule,
  moduleClosureDigest,
  moduleClosureNode,
  planCacheKey,
  resolvedModuleId,
  yukuFactory,
  type HostModuleInput,
  type LoweredModulePlan,
  type ModuleClosureNode,
  type ResolvedModuleId,
} from '@tamagui/compiler-core'
import { compilerProjectStamp } from '@tamagui/static'
import { afterEach, describe, expect, test } from 'vitest'

const temporaryRoots: string[] = []

afterEach(async () => {
  await Promise.all(
    temporaryRoots.splice(0).map((path) => rm(path, { recursive: true, force: true }))
  )
})

const appId = resolvedModuleId('/project/app.tsx')
const tokensId = resolvedModuleId('/project/tokens.ts')
const themeId = resolvedModuleId('/project/theme.ts')
const uiId = resolvedModuleId('/project/ui.ts')

/** app -> tokens -> theme, so an edit to theme reaches app only transitively. */
function project(themeSource: string): HostModuleInput[] {
  return [
    {
      id: appId,
      source:
        `import { View } from 'ui'\n` +
        `import { spacing } from './tokens'\n` +
        `export const App = () => <View padding={spacing} />\n`,
      imports: [
        { specifier: 'ui', resolvedId: uiId, external: true },
        { specifier: './tokens', resolvedId: tokensId },
      ],
    },
    {
      id: tokensId,
      source: `export { space as spacing } from './theme'\n`,
      imports: [{ specifier: './theme', resolvedId: themeId }],
    },
    { id: themeId, source: themeSource, imports: [] },
  ]
}

function lookupFor(modules: readonly HostModuleInput[]) {
  const byId = new Map(modules.map((module) => [module.id, moduleClosureNode(module)]))
  return (id: ResolvedModuleId): ModuleClosureNode | null => byId.get(id) ?? null
}

describe('per-module compile cache identity', () => {
  test('a transitive dependency edit changes the key even though the module did not', () => {
    const before = project('export const space = 12\n')
    const after = project('export const space = 24\n')
    const appSource = before[0]!.source
    expect(after[0]!.source).toBe(appSource)

    const beforeDigest = moduleClosureDigest(appId, lookupFor(before))
    const afterDigest = moduleClosureDigest(appId, lookupFor(after))
    expect(beforeDigest).toBeTruthy()
    expect(afterDigest).not.toBe(beforeDigest)

    // the same two projects under a key over the module's OWN bytes, which is
    // the shape that ships a stale style: it cannot tell them apart, so the
    // assertion above is discriminating rather than vacuous
    const ownSourceKey = (modules: readonly HostModuleInput[]) =>
      contentHash(modules.find(({ id }) => id === appId)!.source)
    expect(ownSourceKey(after)).toBe(ownSourceKey(before))

    // every module on the path from the edit up to app moves with it
    expect(moduleClosureDigest(themeId, lookupFor(before))).not.toBe(
      moduleClosureDigest(themeId, lookupFor(after))
    )
    expect(moduleClosureDigest(tokensId, lookupFor(before))).not.toBe(
      moduleClosureDigest(tokensId, lookupFor(after))
    )
  })

  test('an import cycle still produces one stable digest', () => {
    const left = resolvedModuleId('/project/left.ts')
    const right = resolvedModuleId('/project/right.ts')
    const cyclic: HostModuleInput[] = [
      {
        id: left,
        source: `export { b } from './right'\nexport const a = 1\n`,
        imports: [{ specifier: './right', resolvedId: right }],
      },
      {
        id: right,
        source: `export { a } from './left'\nexport const b = 2\n`,
        imports: [{ specifier: './left', resolvedId: left }],
      },
    ]
    const lookup = lookupFor(cyclic)
    expect(moduleClosureDigest(left, lookup)).toBe(moduleClosureDigest(left, lookup))
    expect(moduleClosureDigest(left, lookup)).toBe(moduleClosureDigest(right, lookup))
  })

  test('a module whose closure is not fully known has no key', () => {
    const partial = project('export const space = 12\n').slice(0, 2)
    expect(moduleClosureDigest(appId, lookupFor(partial))).toBeNull()
  })

  test('external modules are opaque, so leaving them out of the closure is safe', () => {
    const externalId = resolvedModuleId('/project/node_modules/ext/index.js')
    const build = (external: boolean) => {
      const graph = new ProjectGraph(yukuFactory, {
        modules: [
          {
            id: appId,
            source:
              `import { View } from 'ui'\n` +
              `import { pad } from 'ext'\n` +
              `export const App = () => <View padding={pad} />\n`,
            imports: [
              { specifier: 'ui', resolvedId: uiId, external: true },
              { specifier: 'ext', resolvedId: externalId, external },
            ],
          },
          { id: externalId, source: 'export const pad = 12\n', imports: [] },
        ],
      })
      const entry = materializeModule(graph, appId).elements[0]?.entries.find(
        (candidate) => candidate.kind === 'prop' && candidate.name === 'padding'
      )
      return entry && 'value' in entry ? entry.value : null
    }

    // linked, the value reaches the plan and the closure has to cover it
    expect(build(false)).toMatchObject({ kind: 'static', value: 12 })
    // external, evaluation cannot cross the edge at all, so no content of that
    // module can appear in a plan and the closure may exclude it
    expect(build(true)).toMatchObject({
      kind: 'bailout',
      bailout: { code: 'linked/unresolved-binding' },
    })
  })
})

describe('compiler project stamp', () => {
  test('follows the bytes of the files the project named, and refuses to exist without them', async () => {
    const root = await mkdtemp(join(tmpdir(), 'tamagui-stamp-'))
    temporaryRoots.push(root)
    const artifact = join(root, 'components.config.cjs')
    const base = {
      hostVersions: ['@tamagui/test-host@1.0.0'],
      target: 'web' as const,
      componentModules: [{ moduleName: 'ui', id: '/project/ui.ts' }],
      disablePartialExtraction: false,
      experimentalNativeFastPath: false,
      zeroRuntime: false,
    }

    expect(compilerProjectStamp({ ...base, stampSources: [] })).toBeNull()
    expect(
      compilerProjectStamp({ ...base, stampSources: [join(root, 'missing.cjs')] })
    ).toBeNull()

    await writeFile(artifact, 'exports.shorthands = { p: "padding" }\n', 'utf8')
    const first = compilerProjectStamp({ ...base, stampSources: [artifact] })
    expect(first).toBeTruthy()
    expect(compilerProjectStamp({ ...base, stampSources: [artifact] })).toBe(first)

    // a config change that produces identical CSS still moves the stamp,
    // because the stamp reads the bytes the compiler host was built from
    await writeFile(artifact, 'exports.shorthands = { p: "paddingTop" }\n', 'utf8')
    expect(compilerProjectStamp({ ...base, stampSources: [artifact] })).not.toBe(first)

    // and so does the platform, the mode, and the host build
    await writeFile(artifact, 'exports.shorthands = { p: "padding" }\n', 'utf8')
    expect(
      compilerProjectStamp({ ...base, stampSources: [artifact], target: 'native' })
    ).not.toBe(first)
    expect(
      compilerProjectStamp({ ...base, stampSources: [artifact], zeroRuntime: true })
    ).not.toBe(first)
    expect(
      compilerProjectStamp({
        ...base,
        stampSources: [artifact],
        hostVersions: ['@tamagui/test-host@1.0.1'],
      })
    ).not.toBe(first)
  })
})

describe('module plan cache storage', () => {
  const plan = (id: ResolvedModuleId, css: string): LoweredModulePlan =>
    ({
      version: 2,
      id,
      target: 'web',
      inputHash: 'input',
      sourceHash: contentHash('source'),
      projectGeneration: 'test',
      structuralPassHash: 'web-noop-v1',
      edits: [],
      css,
      diagnostics: [],
      dependencies: [],
      stats: { found: 0, lowered: 0, flattened: 0, styled: 0, bailed: 0 },
    }) as LoweredModulePlan

  test('returns an entry only for its exact module and closure', async () => {
    const root = await mkdtemp(join(tmpdir(), 'tamagui-plan-cache-'))
    temporaryRoots.push(root)
    const cache = new ModulePlanCache(root)
    const identity = {
      stamp: 'stamp-a',
      target: 'web',
      structuralPassHash: 'web-noop-v1',
    }
    const key = planCacheKey(identity, appId, 'digest-a')

    expect(await cache.read(key, appId, 'digest-a')).toBeNull()
    await cache.write(key, {
      schemaVersion: PLAN_CACHE_SCHEMA_VERSION,
      moduleId: appId,
      closureDigest: 'digest-a',
      plan: plan(appId, '._a{color:red}'),
    })

    expect((await cache.read(key, appId, 'digest-a'))?.plan.css).toBe('._a{color:red}')
    expect(await cache.read(key, appId, 'digest-b')).toBeNull()
    expect(await cache.read(key, tokensId, 'digest-a')).toBeNull()
    expect(cache.stats).toMatchObject({ hits: 1, writes: 1 })
  })

  test('a different stamp or platform is a different key', () => {
    const identity = {
      stamp: 'stamp-a',
      target: 'web',
      structuralPassHash: 'web-noop-v1',
    }
    const key = planCacheKey(identity, appId, 'digest-a')
    expect(planCacheKey({ ...identity, stamp: 'stamp-b' }, appId, 'digest-a')).not.toBe(
      key
    )
    expect(planCacheKey({ ...identity, target: 'native' }, appId, 'digest-a')).not.toBe(
      key
    )
    expect(
      planCacheKey({ ...identity, structuralPassHash: 'other' }, appId, 'digest-a')
    ).not.toBe(key)
    expect(planCacheKey(identity, tokensId, 'digest-a')).not.toBe(key)
    expect(planCacheKey(identity, appId, 'digest-b')).not.toBe(key)
  })
})

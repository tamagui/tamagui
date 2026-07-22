import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, describe, expect, test } from 'bun:test'

import {
  assertInstalledPackagesAreIsolated,
  assertInternalDependenciesArePacked,
  assertSafeTarInventory,
  auditExtractedPackage,
  createIsolatedCanaryManifest,
  createTemporaryPackManifest,
  DEFAULT_DELETED_PACKAGE_REFS,
  discoverPublicWorkspacePackages,
  expandInternalPackageClosure,
  exportSpecifiers,
  hasRuntimeExport,
  packagesForChangedPaths,
  publishCommand,
  publishCommandsForRequested,
  stableJson,
  topologicalPackageOrder,
  withWorkspaceVersion,
  withWorkspaceVersionOverrides,
  type PackageManifest,
  type WorkspacePackage,
} from './v3-release-dry-run-lib'

const temporaryDirectories: string[] = []

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((dir) => rm(dir, { recursive: true, force: true }))
  )
})

function workspacePackage(
  name: string,
  relativeDir: string,
  dependencies: Record<string, string> = {}
): WorkspacePackage {
  const manifest = { name, version: '3.0.0-beta.0', dependencies }
  return {
    name,
    version: manifest.version,
    dir: `/repo/${relativeDir}`,
    relativeDir,
    manifest,
  }
}

async function fixturePackage(manifest: PackageManifest, files: Record<string, string>) {
  const root = await mkdtemp(join(tmpdir(), 'g1-audit-test-'))
  temporaryDirectories.push(root)
  await writeFile(join(root, 'package.json'), stableJson(manifest))
  for (const [file, content] of Object.entries(files)) {
    await mkdir(join(root, file, '..'), { recursive: true })
    await writeFile(join(root, file), content)
  }
  return root
}

describe('G1 package selection', () => {
  const packages = [
    workspacePackage('@tamagui/style-grammar', 'code/core/style-grammar'),
    workspacePackage('@tamagui/web', 'code/core/web', {
      '@tamagui/style-grammar': 'workspace:*',
    }),
    workspacePackage('@tamagui/core', 'code/core/core', {
      '@tamagui/web': 'workspace:*',
    }),
    workspacePackage('tamagui', 'code/ui/tamagui', {
      '@tamagui/core': 'workspace:*',
    }),
  ]

  test('preserves semantic package export condition order', () => {
    const manifest = {
      exports: {
        '.': {
          import: './dist/esm/index.mjs',
          require: './dist/cjs/index.cjs',
          default: './dist/cjs/index.cjs',
        },
      },
    }

    expect(Object.keys(JSON.parse(stableJson(manifest)).exports['.'])).toEqual([
      'import',
      'require',
      'default',
    ])
  })

  test('derives changed package roots and expands their internal tarball closure', () => {
    const changed = packagesForChangedPaths(packages, [
      'code/core/core/src/index.tsx',
      'plans/v3-evolution.md',
    ])
    expect(changed.map(({ name }) => name)).toEqual(['@tamagui/core'])
    const closure = expandInternalPackageClosure(
      packages,
      changed.map(({ name }) => name)
    )
    expect(closure.map(({ name }) => name)).toEqual([
      '@tamagui/core',
      '@tamagui/style-grammar',
      '@tamagui/web',
    ])
    expect(topologicalPackageOrder(closure).map(({ name }) => name)).toEqual([
      '@tamagui/style-grammar',
      '@tamagui/web',
      '@tamagui/core',
    ])
  })

  test('adds every internal canary dependency to the staged closure', () => {
    const closure = expandInternalPackageClosure(packages, ['@tamagui/web'], {
      name: 'g0-canary',
      dependencies: { tamagui: 'workspace:*' },
    })
    expect(closure.map(({ name }) => name)).toEqual([
      '@tamagui/core',
      '@tamagui/style-grammar',
      '@tamagui/web',
      'tamagui',
    ])
  })

  test('applies a preview version without mutating workspace manifests', () => {
    const versioned = withWorkspaceVersion(packages, '3.0.0-beta.1')
    expect(versioned.every((pkg) => pkg.version === '3.0.0-beta.1')).toBe(true)
    expect(versioned.every((pkg) => pkg.manifest.version === '3.0.0-beta.1')).toBe(true)
    expect(packages.every((pkg) => pkg.version === '3.0.0-beta.0')).toBe(true)
    expect(versioned[0]).not.toBe(packages[0])
    expect(versioned[0]?.manifest).not.toBe(packages[0]?.manifest)
  })

  test('overrides skipped dependency versions without mutating workspace manifests', () => {
    const versioned = withWorkspaceVersionOverrides(
      withWorkspaceVersion(packages, '3.0.0-beta.2'),
      new Map([['@tamagui/style-grammar', '3.0.0-beta.1']])
    )
    expect(versioned.find(({ name }) => name === '@tamagui/style-grammar')?.version).toBe(
      '3.0.0-beta.1'
    )
    expect(versioned.find(({ name }) => name === '@tamagui/web')?.version).toBe(
      '3.0.0-beta.2'
    )
    expect(packages.every((pkg) => pkg.version === '3.0.0-beta.0')).toBe(true)
  })

  test('discovers a public workspace package whose directory is named types', async () => {
    const root = await mkdtemp(join(tmpdir(), 'g1-discovery-test-'))
    temporaryDirectories.push(root)
    const packageDir = join(root, 'code/core/types')
    await mkdir(packageDir, { recursive: true })
    await writeFile(
      join(packageDir, 'package.json'),
      stableJson({ name: '@tamagui/types', version: '3.0.0-beta.0' })
    )

    await expect(discoverPublicWorkspacePackages(root)).resolves.toMatchObject([
      {
        name: '@tamagui/types',
        relativeDir: 'code/core/types',
      },
    ])
  })
})

describe('G1 temporary manifests', () => {
  test('rewrites only the cloned manifest and preserves workspace range intent', () => {
    const source: PackageManifest = {
      name: '@tamagui/example',
      version: '3.0.0-beta.0',
      dependencies: { '@tamagui/core': 'workspace:^' },
      peerDependencies: { '@tamagui/web': 'workspace:*' },
    }
    const output = createTemporaryPackManifest(
      source,
      new Map([
        ['@tamagui/core', '3.0.0-beta.0'],
        ['@tamagui/web', '3.0.0-beta.0'],
      ]),
      '/repo',
      'code/example'
    )
    expect(output.dependencies).toEqual({ '@tamagui/core': '^3.0.0-beta.0' })
    expect(output.peerDependencies).toEqual({ '@tamagui/web': '3.0.0-beta.0' })
    expect(output.repository).toEqual({
      type: 'git',
      url: 'https://github.com/tamagui/tamagui.git',
      directory: 'code/example',
    })
    expect(source.dependencies).toEqual({ '@tamagui/core': 'workspace:^' })
    expect(JSON.stringify(output)).not.toContain('workspace:')
  })

  test('does not confuse a removed package with a longer live package name', () => {
    expect(() =>
      createTemporaryPackManifest(
        {
          name: '@tamagui/example',
          version: '3.0.0-beta.0',
          dependencies: { '@tamagui/animations-motion': '2.4.6' },
        },
        new Map(),
        '/repo',
        'code/example'
      )
    ).not.toThrow()
  })

  test('rejects local paths, unresolved workspaces, deleted packages, and unstaged internals', () => {
    expect(() =>
      createTemporaryPackManifest(
        { name: 'bad', version: '1.0.0', dependencies: { x: 'file:/repo/x' } },
        new Map(),
        '/repo',
        'code/example'
      )
    ).toThrow(/local path/)
    expect(() =>
      createTemporaryPackManifest(
        { name: 'bad', version: '1.0.0', dependencies: { x: 'workspace:*' } },
        new Map(),
        '/repo',
        'code/example'
      )
    ).toThrow(/unresolved workspace/)
    for (const deletedPackage of DEFAULT_DELETED_PACKAGE_REFS) {
      expect(() =>
        createTemporaryPackManifest(
          {
            name: 'bad',
            version: '1.0.0',
            dependencies: { [deletedPackage]: '1.0.0' },
          },
          new Map(),
          '/repo',
          'code/example'
        )
      ).toThrow(/deleted/)
    }
    expect(() =>
      assertInternalDependenciesArePacked(
        {
          name: '@tamagui/example',
          dependencies: { '@tamagui/core': '3.0.0-beta.0' },
        },
        new Set(['@tamagui/example'])
      )
    ).toThrow(/outside staged tarballs/)
  })

  test('rewrites copied canary dependencies exclusively to tarball paths', () => {
    const manifest = createIsolatedCanaryManifest(
      {
        name: 'g0',
        packageManager: 'bun@1.3.9',
        workspaces: ['packages/*'],
        scripts: { 'g0:web': 'playwright test', 'g0:native': 'expo export' },
        dependencies: { '@tamagui/core': 'workspace:*', react: '19.1.0' },
      },
      [{ name: '@tamagui/core', tarball: '/tmp/core.tgz' }],
      new Set(['@tamagui/core'])
    )
    expect(manifest.workspaces).toBeUndefined()
    expect(manifest.packageManager).toBeUndefined()
    expect(manifest.dependencies).toEqual({
      '@tamagui/core': 'file:/tmp/core.tgz',
      react: '19.1.0',
    })
    expect(manifest.overrides).toEqual({
      '@tamagui/core': 'file:/tmp/core.tgz',
    })
    expect(JSON.stringify(manifest)).not.toContain('workspace:')
  })
})

describe('G1 tarball audits', () => {
  test('distinguishes type-only packages from runtime packages', () => {
    expect(hasRuntimeExport({ exports: { '.': { types: './types.ts' } } })).toBe(false)
    expect(
      hasRuntimeExport({
        exports: { '.': { types: './types.d.ts', import: './index.mjs' } },
      })
    ).toBe(true)
  })

  test('declares native runtime integrations with required and optional peer intent', async () => {
    const manifest = JSON.parse(
      await readFile(new URL('../code/core/native/package.json', import.meta.url), 'utf8')
    )
    const requiredPeers = ['react', 'react-native', 'react-native-web']
    const optionalPeers = [
      'burnt',
      'expo-linear-gradient',
      'react-native-gesture-handler',
      'react-native-keyboard-controller',
      'react-native-safe-area-context',
      'react-native-teleport',
      'react-native-worklets-core',
      'zeego',
    ]

    for (const name of requiredPeers) {
      expect(manifest.peerDependencies[name]).toBe('*')
      expect(manifest.peerDependenciesMeta?.[name]).toBeUndefined()
    }
    for (const name of optionalPeers) {
      expect(manifest.peerDependencies[name]).toBe('*')
      expect(manifest.peerDependenciesMeta[name]).toEqual({ optional: true })
      expect(manifest.devDependencies[name]).toBeDefined()
    }
    expect(manifest.devDependencies['react-native']).toBe('0.83.2')
    expect(manifest.devDependencies['react-native-web']).toBe('^0.21.0')
  })

  test('accepts a minimal inventory and rejects tests, fixtures, cache, and unsafe paths', () => {
    expect(
      assertSafeTarInventory(['package/package.json', 'package/dist/index.mjs'])
    ).toEqual(['package/dist/index.mjs', 'package/package.json'])
    for (const entry of [
      'package/tests/a.test.ts',
      'package/dist/fixture.test-d.mjs',
      'package/fixtures/app.tsx',
      'package/.turbo/cache.bin',
      '/absolute/package.json',
      'package/../escape',
    ]) {
      expect(() => assertSafeTarInventory(['package/package.json', entry])).toThrow()
    }
  })

  test('accepts declared built imports and present exports', async () => {
    const manifest: PackageManifest = {
      name: '@tamagui/example',
      version: '3.0.0-beta.0',
      main: './dist/index.cjs',
      module: './dist/index.mjs',
      types: './types/index.d.ts',
      exports: {
        '.': {
          types: './types/index.d.ts',
          import: './dist/index.mjs',
          require: './dist/index.cjs',
        },
      },
      peerDependencies: { react: '>=19' },
    }
    const root = await fixturePackage(manifest, {
      'dist/index.cjs': `require('react')`,
      'dist/index.mjs': `import React from 'react'; export { React }; console.info("TamaguiProvider from 'tamagui'", 'workspace:*')`,
      'types/index.d.ts': `export declare const ok: true`,
    })
    await expect(auditExtractedPackage(root, '/repo')).resolves.toBeUndefined()
    expect(exportSpecifiers(manifest)).toEqual(['@tamagui/example'])
  })

  test('accepts a live package whose name extends a deleted package name', async () => {
    const root = await fixturePackage(
      {
        name: '@tamagui/example',
        version: '3.0.0-beta.0',
        dependencies: { '@tamagui/animations-motion': '2.4.6' },
      },
      { 'dist/index.mjs': `import '@tamagui/animations-motion'` }
    )
    await expect(auditExtractedPackage(root, '/repo')).resolves.toBeUndefined()
  })

  test('rejects recursive workspace refs, deleted refs, source-only imports, missing exports, and undeclared deps', async () => {
    const cases: Array<[PackageManifest, Record<string, string>, RegExp]> = [
      [
        { name: 'bad', version: '1.0.0', custom: { value: 'workspace:*' } },
        {},
        /workspace/,
      ],
      ...DEFAULT_DELETED_PACKAGE_REFS.map(
        (deletedPackage) =>
          [
            { name: 'bad', version: '1.0.0' },
            { 'dist/index.mjs': `import '${deletedPackage}'` },
            /deleted/,
          ] as [PackageManifest, Record<string, string>, RegExp]
      ),
      [
        { name: 'bad', version: '1.0.0' },
        { 'dist/index.mjs': `import '@tamagui/core/src/config'` },
        /source-only/,
      ],
      [
        { name: 'bad', version: '1.0.0', exports: { '.': './dist/missing.mjs' } },
        {},
        /missing/,
      ],
      [
        { name: 'bad', version: '1.0.0' },
        { 'dist/index.cjs': `require('left-pad')` },
        /undeclared/,
      ],
    ]
    for (const [manifest, files, error] of cases) {
      const root = await fixturePackage(manifest, files)
      await expect(auditExtractedPackage(root, '/repo')).rejects.toThrow(error)
    }
  })
})

describe('G1 isolation and preview', () => {
  test('rejects installed packages resolving to the workspace', () => {
    expect(() =>
      assertInstalledPackagesAreIsolated(
        '/tmp/g1/consumer',
        new Map([['@tamagui/core', '/repo/code/core/core']]),
        '/repo'
      )
    ).toThrow(/outside isolated consumer/)
    expect(() =>
      assertInstalledPackagesAreIsolated(
        '/tmp/g1/consumer',
        new Map([['@tamagui/core', '/tmp/g1/consumer/node_modules/@tamagui/core']]),
        '/repo'
      )
    ).not.toThrow()
  })

  test('prints an exact owner-gated publish command without executing it', () => {
    expect(
      publishCommand(
        { name: '@tamagui/core', tarball: "/tmp/g1 artifacts/core's.tgz" },
        'beta'
      )
    ).toBe(`npm publish '/tmp/g1 artifacts/core'\\''s.tgz' --access public --tag 'beta'`)
  })

  test('publishes requested artifacts but retains dependency-closure audit artifacts', () => {
    const artifacts = [
      { name: '@tamagui/core', tarball: '/tmp/core.tgz' },
      { name: '@tamagui/web', tarball: '/tmp/web.tgz' },
    ]
    expect(
      publishCommandsForRequested(artifacts, new Set(['@tamagui/core']), 'beta')
    ).toEqual(["npm publish '/tmp/core.tgz' --access public --tag 'beta'"])
  })
})

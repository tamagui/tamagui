import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// packages whose top-level "react-native" field is a browser-spec redirect map
const PACKAGES = [
  'code/core/animation-helpers',
  'code/core/animations-css',
  'code/core/core',
  'code/core/style-grammar',
  'code/core/themes',
  'code/core/web',
  'code/packages/local-icons',
]

const repoRoot = join(import.meta.dir, '..')

type PackageJson = {
  name: string
  main?: string
  'react-native'?: string | Record<string, string>
  exports: Record<string, string | Record<string, string>>
}

function readPackage(dir: string): PackageJson {
  return JSON.parse(readFileSync(join(repoRoot, dir, 'package.json'), 'utf8'))
}

function nativeTarget(entry: string | Record<string, string> | undefined) {
  const target = typeof entry === 'string' ? entry : entry?.['react-native']
  return typeof target === 'string' ? target : undefined
}

function subpaths(pkg: PackageJson) {
  return Object.keys(pkg.exports).filter(
    (key) =>
      key !== './package.json' &&
      !key.includes('*') &&
      /\.(c|m)?js$/.test(nativeTarget(pkg.exports[key]) ?? '')
  )
}

let metroResolver: typeof import('metro-resolver') | undefined
try {
  metroResolver = require('metro-resolver')
} catch {}

const VIRTUAL_NODE_MODULES = '/virtual/node_modules'

function resolveNative(pkg: PackageJson, specifier: string) {
  const pkgRoot = `${VIRTUAL_NODE_MODULES}/${pkg.name}`
  const builtFiles = new Set(
    Object.values(pkg.exports)
      .map(nativeTarget)
      .map((t) => `${pkgRoot}/${t?.slice(2)}`)
  )
  const warnings: string[] = []
  const context = {
    allowHaste: false,
    assetExts: new Set<string>(),
    sourceExts: ['js', 'mjs', 'cjs', 'json', 'ts', 'tsx'],
    mainFields: ['react-native', 'browser', 'main'],
    preferNativePlatform: true,
    unstable_enablePackageExports: true,
    unstable_conditionNames: ['require', 'import', 'react-native'],
    unstable_conditionsByPlatform: {},
    disableHierarchicalLookup: true,
    nodeModulesPaths: [VIRTUAL_NODE_MODULES],
    extraNodeModules: null,
    originModulePath: '/virtual/app/index.js',
    customResolverOptions: {},
    dev: true,
    redirectModulePath: (p: string) => p,
    resolveAsset: () => null,
    resolveHasteModule: () => null,
    resolveHastePackage: () => null,
    unstable_logWarning: (message: string) => warnings.push(message),
    getPackage: (packageJsonPath: string) =>
      packageJsonPath === `${pkgRoot}/package.json` ? pkg : null,
    getPackageForModule: (absolutePath: string) =>
      absolutePath === pkgRoot || absolutePath.startsWith(`${pkgRoot}/`)
        ? {
            rootPath: pkgRoot,
            packageJson: pkg,
            packageRelativePath: absolutePath.slice(pkgRoot.length + 1),
          }
        : null,
    doesFileExist: (absolutePath: string) => absolutePath === `${pkgRoot}/package.json`,
    fileSystemLookup: (absolutePath: string) => {
      if (pkgRoot === absolutePath || pkgRoot.startsWith(`${absolutePath}/`))
        return { exists: true, type: 'd' }
      if (builtFiles.has(absolutePath))
        return { exists: true, type: 'f', realPath: absolutePath }
      return { exists: false }
    },
  }
  const result = metroResolver!.resolve(context as never, specifier, 'ios')
  const filePath = result.type === 'sourceFile' ? result.filePath : String(result.type)
  return { filePath: filePath.replace(`${pkgRoot}/`, './'), warnings }
}

describe('top-level "react-native" field', () => {
  for (const dir of PACKAGES) {
    const pkg = readPackage(dir)

    // Metro applies the map before "exports", then warns for any target that is not an exports subpath
    test(`${pkg.name} has no "react-native" redirect to a subpath missing from "exports"`, () => {
      const field = pkg['react-native']
      const targets = typeof field === 'object' ? Object.values(field) : []
      expect(targets.filter((target) => !(target in pkg.exports))).toEqual([])
    })

    test.skipIf(!metroResolver)(
      `${pkg.name} resolves every subpath on ios to its "exports" target without warnings`,
      () => {
        for (const key of subpaths(pkg)) {
          const specifier = key === '.' ? pkg.name : `${pkg.name}/${key.slice(2)}`
          const { filePath, warnings } = resolveNative(pkg, specifier)
          expect({ specifier, filePath, warnings }).toEqual({
            specifier,
            filePath: nativeTarget(pkg.exports[key])!,
            warnings: [],
          })
        }
      }
    )
  }
})

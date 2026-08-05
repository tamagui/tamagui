import { existsSync, lstatSync, readFileSync, realpathSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, extname, isAbsolute, join, parse, relative, resolve } from 'node:path'

export interface MetroResolverConfig {
  projectRoot: string
  resolver?: Record<string, any>
}

export interface MetroResolvedDependency {
  specifier: string
  resolvedId: string
  external: boolean
}

export interface MetroModuleSpecifier {
  specifier: string
  isESMImport: boolean
}

type MetroResolve = (
  context: Record<string, any>,
  specifier: string,
  platform: string | null
) => { type: string; filePath?: string }

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function findClosestPackage(path: string): {
  rootPath: string
  packageJson: Record<string, any>
  packageRelativePath: string
} | null {
  let directory = existsSync(path) && statSync(path).isDirectory() ? path : dirname(path)
  const root = parse(directory).root
  while (true) {
    const packagePath = join(directory, 'package.json')
    if (existsSync(packagePath)) {
      try {
        return {
          rootPath: directory,
          packageJson: JSON.parse(readFileSync(packagePath, 'utf8')),
          packageRelativePath: relative(directory, path),
        }
      } catch {
        return null
      }
    }
    if (directory === root || directory.endsWith(`${join('node_modules')}`)) {
      return null
    }
    directory = dirname(directory)
  }
}

function lookup(projectRoot: string, path: string) {
  const absolutePath = isAbsolute(path) ? path : resolve(projectRoot, path)
  try {
    const stat = lstatSync(absolutePath)
    const realPath = realpathSync(absolutePath)
    return {
      exists: true as const,
      type: (stat.isDirectory() ? 'd' : 'f') as 'd' | 'f',
      realPath,
    }
  } catch {
    return { exists: false as const }
  }
}

export function moduleSpecifiersFromAst(ast: unknown): MetroModuleSpecifier[] {
  const specifiers = new Map<string, boolean>()
  const seen = new Set<object>()

  function add(value: unknown, isESMImport: boolean): void {
    if (typeof value !== 'string') return
    specifiers.set(value, (specifiers.get(value) ?? false) || isESMImport)
  }

  function visit(value: unknown): void {
    if (!value || typeof value !== 'object') return
    if (seen.has(value)) return
    seen.add(value)
    if (Array.isArray(value)) {
      for (const child of value) visit(child)
      return
    }
    const node = value as Record<string, any>
    if (
      node.type === 'ImportDeclaration' ||
      node.type === 'ExportAllDeclaration' ||
      node.type === 'ExportNamedDeclaration'
    ) {
      add(node.source?.value, true)
    } else if (node.type === 'CallExpression') {
      const first = node.arguments?.[0]
      if (node.callee?.type === 'Import') {
        add(first?.value, true)
      } else if (node.callee?.type === 'Identifier' && node.callee.name === 'require') {
        add(first?.value, false)
      }
    }
    for (const [key, child] of Object.entries(node)) {
      if (key === 'loc' || key === 'comments' || key === 'tokens') continue
      visit(child)
    }
  }

  visit(ast)
  return [...specifiers]
    .sort(([left], [right]) => compareCodeUnits(left, right))
    .map(([specifier, isESMImport]) => ({ specifier, isESMImport }))
}

export function createMetroCompilerResolver(config: MetroResolverConfig): {
  version: string
  resolve(
    importer: string,
    dependency: MetroModuleSpecifier,
    platform: string | null
  ): MetroResolvedDependency | null
} {
  const requireFromProject = createRequire(join(config.projectRoot, 'package.json'))
  const resolverPackage = requireFromProject('metro-resolver/package.json') as {
    version: string
  }
  if (!resolverPackage.version.startsWith('0.83.')) {
    throw new Error(
      `@tamagui/metro-plugin requires the Metro 0.83 resolver contract, found ${resolverPackage.version}`
    )
  }
  const resolverModule = requireFromProject('metro-resolver')
  const metroResolve: MetroResolve = resolverModule.resolve
  const createDefaultContextModule = requireFromProject(
    'metro-resolver/private/createDefaultContext'
  )
  const createDefaultContext =
    createDefaultContextModule.default ?? createDefaultContextModule
  const resolver = config.resolver ?? {}
  const fileSystemLookup = (path: string) => lookup(config.projectRoot, path)
  const getPackage = (packagePath: string) => {
    try {
      return JSON.parse(readFileSync(packagePath, 'utf8'))
    } catch {
      return null
    }
  }

  return {
    version: resolverPackage.version,
    resolve(importer, dependency, platform) {
      const dependencyDescriptor = {
        name: dependency.specifier,
        data: {
          asyncType: null,
          isESMImport: dependency.isESMImport,
          key: dependency.specifier,
          locs: [],
        },
      }
      const context = createDefaultContext(
        {
          allowHaste: false,
          assetExts: new Set(resolver.assetExts ?? []),
          customResolverOptions: {},
          dev: true,
          disableHierarchicalLookup: resolver.disableHierarchicalLookup ?? false,
          doesFileExist: (path: string) => fileSystemLookup(path).type === 'f',
          extraNodeModules: resolver.extraNodeModules ?? null,
          fileSystemLookup,
          getPackage,
          getPackageForModule: findClosestPackage,
          isESMImport: dependency.isESMImport,
          mainFields: resolver.resolverMainFields ?? ['react-native', 'browser', 'main'],
          nodeModulesPaths: resolver.nodeModulesPaths ?? [],
          originModulePath: importer,
          preferNativePlatform: true,
          projectRoot: config.projectRoot,
          resolveAsset: () => null,
          resolveHasteModule: () => null,
          resolveHastePackage: () => null,
          resolveRequest: resolver.resolveRequest ?? null,
          sourceExts: resolver.sourceExts ?? ['js', 'jsx', 'json', 'ts', 'tsx'],
          unstable_conditionNames: resolver.unstable_conditionNames ?? [],
          unstable_conditionsByPlatform: resolver.unstable_conditionsByPlatform ?? {},
          unstable_enablePackageExports: resolver.unstable_enablePackageExports ?? true,
          unstable_logWarning: (message: string) =>
            config.resolver?.unstable_logWarning?.(message),
        },
        dependencyDescriptor
      )
      const result = metroResolve(context, dependency.specifier, platform)
      if (result.type === 'empty') return null
      if (result.type !== 'sourceFile' || !result.filePath) return null
      const resolvedId = realpathSync(result.filePath)
      return {
        specifier: dependency.specifier,
        resolvedId,
        external: resolvedId.includes(`${join('node_modules')}`),
      }
    },
  }
}

export function isCompilerSourceFile(path: string): boolean {
  return ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx'].includes(extname(path))
}

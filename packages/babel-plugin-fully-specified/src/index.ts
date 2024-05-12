import { existsSync, readFileSync, lstatSync } from 'node:fs'
import { resolve, extname, dirname } from 'node:path'
import {
  importDeclaration,
  exportNamedDeclaration,
  exportAllDeclaration,
  stringLiteral,
} from '@babel/types'

import type { ConfigAPI, NodePath, PluginPass } from '@babel/core'
import type {
  ImportSpecifier,
  ImportDeclaration,
  ExportAllDeclaration,
  StringLiteral,
  ExportSpecifier,
  ExportDeclaration,
  ExportNamedDeclaration,
} from '@babel/types'

type ImportDeclarationFunc = (
  specifiers: Array<ImportSpecifier>,
  source: StringLiteral
) => ImportDeclaration

type ExportNamedDeclarationFunc = (
  declaration?: ExportDeclaration,
  specifiers?: Array<ExportSpecifier>,
  source?: StringLiteral
) => ExportNamedDeclaration

type ExportAllDeclarationFunc = (source: StringLiteral) => ExportAllDeclaration

type PathDeclaration = NodePath & {
  node: ImportDeclaration & ExportNamedDeclaration & ExportAllDeclaration
}

type PackageData = {
  hasPath: boolean
  packagePath: string
}

interface FullySpecifiedOptions {
  declaration:
    | ImportDeclarationFunc
    | ExportNamedDeclarationFunc
    | ExportAllDeclarationFunc
  makeNodes: (path: PathDeclaration) => Array<PathDeclaration>
  ensureFileExists: boolean
  esExtensionDefault: string
  tryExtensions: Array<string>
  esExtensions: Array<string>
  includePackages: Array<string>
}

const makeDeclaration = ({
  declaration,
  makeNodes,
  ensureFileExists = false,
  esExtensionDefault = '.js',

  // List of all extensions which we try to find
  tryExtensions = ['.js', '.mjs', '.cjs'],

  // List of extensions that can run in Node.js or in the Browser
  esExtensions = ['.js', '.mjs', '.cjs'],

  // List of packages that also should be transformed with this plugin
  includePackages = [],
}: FullySpecifiedOptions) => {
  return (
    path: PathDeclaration,
    {
      file: {
        opts: { filename },
      },
    }: PluginPass
  ) => {
    const { source } = path.node

    if (!source || !filename) {
      return // stop here
    }

    const { exportKind, importKind } = path.node
    const isTypeOnly = exportKind === 'type' || importKind === 'type'
    if (isTypeOnly) {
      return // stop here
    }

    const { value } = source
    const module = value as string

    let packageData: PackageData | null = null

    if (!isLocalFile(module)) {
      if (includePackages.some((name) => module.startsWith(name))) {
        packageData = getPackageData(module)
      }

      if (!(packageData && packageData.hasPath)) {
        return // stop here
      }
    }

    const filenameExtension = extname(filename)
    const filenameDirectory = dirname(filename)
    const isDirectory = isLocalDirectory(resolve(filenameDirectory, module))

    const currentModuleExtension = extname(module)
    const targetModule = evaluateTargetModule({
      module,
      filenameDirectory,
      filenameExtension,
      packageData,
      currentModuleExtension,
      isDirectory,
      tryExtensions,
      esExtensions,
      esExtensionDefault,
      ensureFileExists,
    })

    if (targetModule === false || currentModuleExtension === targetModule.extension) {
      return // stop here
    }

    const nodes = makeNodes(path)

    path.replaceWith(
      // @ts-ignore
      declaration.apply(null, [...nodes, stringLiteral(targetModule.module)])
    )
  }
}

export default function FullySpecified(api: ConfigAPI, options: FullySpecifiedOptions) {
  api.assertVersion(7)

  return {
    name: 'babel-plugin-fully-specified',
    visitor: {
      ImportDeclaration: makeDeclaration({
        ...options,
        declaration: importDeclaration,
        makeNodes: ({ node: { specifiers } }) => [specifiers],
      }),
      ExportNamedDeclaration: makeDeclaration({
        ...options,
        declaration: exportNamedDeclaration,
        makeNodes: ({ node: { declaration, specifiers } }) => [declaration, specifiers],
      }),
      ExportAllDeclaration: makeDeclaration({
        ...options,
        declaration: exportAllDeclaration,
        makeNodes: () => [],
      }),
    },
  }
}

function getPackageData<PackageData>(module: string) {
  try {
    const packagePath = require.resolve(module)
    const parts = packagePath.split('/')

    let packageDir = ''
    for (let i = parts.length; i >= 0; i--) {
      const dir = dirname(parts.slice(0, i).join('/'))
      if (existsSync(`${dir}/package.json`)) {
        packageDir = dir
        break
      }
    }
    if (!packageDir) {
      throw new Error(`no package dir`)
    }

    const packageJson = JSON.parse(readFileSync(`${packageDir}/package.json`).toString())

    const hasPath = !module.endsWith(packageJson.name)
    return { hasPath, packagePath }
  } catch (e) {}

  return null
}

function isLocalFile(module: string) {
  return module.startsWith('.') || module.startsWith('/')
}

function isLocalDirectory(absoluteDirectory: string) {
  return existsSync(absoluteDirectory) && lstatSync(absoluteDirectory).isDirectory()
}

function evaluateTargetModule({
  module,
  currentModuleExtension,
  packageData,
  isDirectory,
  filenameDirectory,
  filenameExtension,
  tryExtensions,
  esExtensions,
  esExtensionDefault,
  ensureFileExists,
}) {
  if (packageData) {
    if (packageData.packagePath.endsWith('index.js') && !module.endsWith('index.js')) {
      module = `${module}/index`
    }

    return {
      module: module + esExtensionDefault,
      extension: esExtensionDefault,
    }
  }

  if (currentModuleExtension && !esExtensions.includes(currentModuleExtension)) {
    return false
  }

  if (
    isDirectory &&
    !existsSync(
      resolve(
        filenameDirectory,
        currentModuleExtension ? module : module + esExtensionDefault
      )
    )
  ) {
    module = `${module}/index`
  }

  const targetFile = resolve(filenameDirectory, module)

  if (ensureFileExists) {
    // 1. try first with same extension
    if (
      esExtensions.includes(filenameExtension) &&
      existsSync(targetFile + filenameExtension)
    ) {
      return {
        module: module + filenameExtension,
        extension: filenameExtension,
      }
    }

    // 2. then try with all others
    for (const extension of tryExtensions) {
      if (existsSync(targetFile + extension)) {
        return { module: module + extension, extension }
      }
    }
  } else if (esExtensions.includes(filenameExtension)) {
    return {
      module: module + filenameExtension,
      extension: filenameExtension,
    }
  } else {
    return {
      module: module + esExtensionDefault,
      extension: esExtensionDefault,
    }
  }

  return false
}

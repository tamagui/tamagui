import { existsSync, readFileSync, lstatSync } from 'node:fs'
import { resolve, extname, dirname } from 'node:path'

import type { ConfigAPI, PluginObj } from '@babel/core'

type PackageData = {
  hasPath: boolean
  packagePath: string
}

export interface FullySpecifiedOptions {
  ensureFileExists: boolean
  esExtensionDefault: string
  /** List of all extensions which we try to find. */
  tryExtensions: Array<string>
  /** List of extensions that can run in Node.js or in the Browser. */
  esExtensions: Array<string>
  /** List of packages that also should be transformed with this plugin. */
  includePackages: Array<string>
}

const DEFAULT_OPTIONS = {
  ensureFileExists: false,
  esExtensionDefault: '.js',
  tryExtensions: ['.js', '.mjs', '.cjs'],
  esExtensions: ['.js', '.mjs', '.cjs'],
  includePackages: [],
}

export default function FullySpecified(
  api: ConfigAPI,
  rawOptions: FullySpecifiedOptions
): PluginObj {
  api.assertVersion(7)

  type PluginVisitor = PluginObj['visitor']

  const options = { ...DEFAULT_OPTIONS, ...rawOptions }

  const importDeclarationVisitor: PluginVisitor['ImportDeclaration'] = (path, state) => {
    const filePath = state.file.opts.filename
    if (!filePath) return // cannot determine file path therefore cannot proceed

    const { node } = path
    if (node.importKind === 'type') return // is a type-only import, skip

    const originalModuleSpecifier = node.source.value
    const fullySpecifiedModuleSpecifier = getFullySpecifiedModuleSpecifier(
      originalModuleSpecifier,
      {
        filePath,
        options,
      }
    )

    if (fullySpecifiedModuleSpecifier) {
      node.source.value = fullySpecifiedModuleSpecifier
    }
  }

  const exportDeclarationVisitor: PluginVisitor['ExportNamedDeclaration'] &
    PluginVisitor['ExportAllDeclaration'] = (path, state) => {
    const filePath = state.file.opts.filename
    if (!filePath) return // cannot determine file path therefore cannot proceed

    const { node } = path
    if (node.exportKind === 'type') return // is a type-only export, skip

    const source = node.source
    if (!source) return // is not a re-export, skip

    const originalModuleSpecifier = source.value
    const fullySpecifiedModuleSpecifier = getFullySpecifiedModuleSpecifier(
      originalModuleSpecifier,
      {
        filePath,
        options,
      }
    )

    if (fullySpecifiedModuleSpecifier) {
      source.value = fullySpecifiedModuleSpecifier
    }
  }

  return {
    name: 'babel-plugin-fully-specified',
    visitor: {
      ImportDeclaration: importDeclarationVisitor,
      ExportNamedDeclaration: exportDeclarationVisitor,
      ExportAllDeclaration: exportDeclarationVisitor,
    },
  }
}

/**
 * Returns a fully specified [module specifier](https://tc39.es/ecma262/multipage/ecmascript-language-scripts-and-modules.html#prod-ModuleSpecifier) (or `null` if it can't be determined or shouldn't be transformed).
 */
function getFullySpecifiedModuleSpecifier(
  /**
   * The original module specifier in the code.
   *
   * For example, `'./foo'` for `import { foo } from './foo'`.
   */
  originalModuleSpecifier: string,
  {
    filePath,
    options,
  }: {
    /**
     * The absolute file path of the file being transformed.
     *
     * Normally this can be obtained from the 2nd parameter in a visitor function (often named as `state`): `state.file.opts.filename`.
     */
    filePath: string
    /** Options that users pass to babel-plugin-fully-specified. */
    options: FullySpecifiedOptions
  }
): string | null {
  const fileExt = extname(filePath)
  const fileDir = dirname(filePath)

  const { includePackages } = options

  let packageData: PackageData | null = null
  if (!isLocalFile(originalModuleSpecifier)) {
    if (includePackages.some((name) => originalModuleSpecifier.startsWith(name))) {
      packageData = getPackageData(originalModuleSpecifier)
    }

    if (!(packageData && packageData.hasPath)) {
      return null
    }
  }

  const isDirectory = isLocalDirectory(resolve(fileDir, originalModuleSpecifier))

  const currentModuleExtension = extname(originalModuleSpecifier)

  const { tryExtensions, esExtensions, esExtensionDefault, ensureFileExists } = options

  const targetModule = evaluateTargetModule({
    module: originalModuleSpecifier,
    filenameDirectory: fileDir,
    filenameExtension: fileExt,
    packageData,
    currentModuleExtension,
    isDirectory,
    tryExtensions,
    esExtensions,
    esExtensionDefault,
    ensureFileExists,
  })

  if (targetModule === false || currentModuleExtension === targetModule.extension) {
    return null
  }

  return targetModule.module
}

function getPackageData(module: string) {
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
        return { module: module + '.mjs', extension }
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

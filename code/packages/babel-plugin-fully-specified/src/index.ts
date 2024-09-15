import { existsSync, readFileSync, lstatSync } from 'node:fs'
import { resolve, extname, dirname } from 'node:path'

import type { ConfigAPI, NodePath, PluginObj, PluginPass } from '@babel/core'
import type {
  ExportAllDeclaration,
  ExportNamedDeclaration,
  Import,
  ImportDeclaration,
} from '@babel/types'

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
  ensureFileExists: true,
  esExtensionDefault: '.mjs',
  tryExtensions: ['.js'],
  esExtensions: ['.mjs'],
}

export default function FullySpecified(
  api: ConfigAPI,
  rawOptions: FullySpecifiedOptions
): PluginObj {
  api.assertVersion(7)

  const options = { ...DEFAULT_OPTIONS, ...rawOptions }

  /** For `import ... from '...'`. */
  const importDeclarationVisitor = (
    path: NodePath<ImportDeclaration>,
    state: PluginPass
  ) => {
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

  /** For `export ... from '...'`. */
  const exportDeclarationVisitor = (
    path: NodePath<ExportNamedDeclaration> | NodePath<ExportAllDeclaration>,
    state: PluginPass
  ) => {
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

  /** For dynamic `import()`s. */
  const importVisitor = (path: NodePath<Import>, state) => {
    const filePath = state.file.opts.filename
    if (!filePath) return // cannot determine file path therefore cannot proceed

    const parent = path.parent
    if (parent.type !== 'CallExpression') {
      return // we expect the usage of `import` is a call to it, e.g.: `import('...')`, other usages are not supported
    }

    const firstArgOfImportCall = parent.arguments[0]
    if (firstArgOfImportCall.type !== 'StringLiteral') {
      return // we expect the first argument of `import` to be a string, e.g.: `import('./myModule')`, other types are not supported
    }

    const originalModuleSpecifier = firstArgOfImportCall.value
    const fullySpecifiedModuleSpecifier = getFullySpecifiedModuleSpecifier(
      originalModuleSpecifier,
      {
        filePath,
        options,
      }
    )

    if (fullySpecifiedModuleSpecifier) {
      firstArgOfImportCall.value = fullySpecifiedModuleSpecifier
    }
  }

  return {
    name: 'babel-plugin-fully-specified',
    visitor: {
      ImportDeclaration: importDeclarationVisitor,
      ExportNamedDeclaration: exportDeclarationVisitor,
      ExportAllDeclaration: exportDeclarationVisitor,
      Import: importVisitor,
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

  let packageData: PackageImportData | null = null
  if (!isLocalFile(originalModuleSpecifier)) {
    if (includePackages.some((name) => originalModuleSpecifier.startsWith(name))) {
      packageData = getPackageData(originalModuleSpecifier, filePath)
    }

    if (!(packageData && packageData.isDeepImport)) {
      return null
    }
  }

  const isDirectory = isLocalDirectory(resolve(fileDir, originalModuleSpecifier))

  const currentModuleExtension = extname(originalModuleSpecifier)

  const { tryExtensions, esExtensions, esExtensionDefault, ensureFileExists } = options

  const targetModule = evaluateTargetModule({
    moduleSpecifier: originalModuleSpecifier,
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

/**
 * Data about how a package is being imported.
 */
type PackageImportData = {
  /**
   * Indicates whether the import from the package is a deep import.
   *
   * Example:
   *
   * * `import { foo } from '@org/package'` -> `isDeepImport: false`
   * * `import { foo } from '@org/package/lib/foo'` -> `isDeepImport: true`
   */
  isDeepImport: boolean
  /**
   * The resolved absolute path of the exact file being imported. This will always be a file path (such as `<project>/node_modules/my-pkg/dist/index.js`), not just a directory path.
   */
  modulePath: string
}

/**
 * Given a module specifier and the file path of the source file which imports that module, returns the package data of that module if it can be found.
 */
function getPackageData(
  /** The module specifier, e.g.: `@org/package/lib/someTool`. */
  moduleSpecifier: string,
  /** The file path of the source file which imports that module. */
  filePath?: string
): PackageImportData | null {
  try {
    const modulePath = require.resolve(moduleSpecifier, {
      paths: filePath ? [filePath] : [],
    })
    const parts = modulePath.split('/')

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

    const isDeepImport = !moduleSpecifier.endsWith(packageJson.name)
    return { isDeepImport, modulePath }
  } catch (e) {}

  return null
}

function isLocalFile(moduleSpecifier: string) {
  return moduleSpecifier.startsWith('.') || moduleSpecifier.startsWith('/')
}

function isLocalDirectory(absoluteDirectory: string) {
  return existsSync(absoluteDirectory) && lstatSync(absoluteDirectory).isDirectory()
}

function evaluateTargetModule({
  moduleSpecifier,
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
    if (
      packageData.modulePath.endsWith('index.js') &&
      !moduleSpecifier.endsWith('index.js')
    ) {
      moduleSpecifier = `${moduleSpecifier}/index`
    }

    return {
      module: moduleSpecifier + esExtensionDefault,
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
        currentModuleExtension ? moduleSpecifier : moduleSpecifier + esExtensionDefault
      )
    )
  ) {
    moduleSpecifier = `${moduleSpecifier}/index`
  }

  const targetFile = resolve(filenameDirectory, moduleSpecifier)

  if (ensureFileExists) {
    for (const extension of tryExtensions) {
      if (existsSync(targetFile + extension)) {
        return {
          module: moduleSpecifier + (ensureFileExists.forceExtension || extension),
          extension,
        }
      }
    }
  } else if (esExtensions.includes(filenameExtension)) {
    return {
      module: moduleSpecifier + filenameExtension,
      extension: filenameExtension,
    }
  } else {
    return {
      module: moduleSpecifier + esExtensionDefault,
      extension: esExtensionDefault,
    }
  }

  return false
}

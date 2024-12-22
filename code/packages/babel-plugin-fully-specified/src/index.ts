import { existsSync, lstatSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'

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

  const isDirectory = isLocalDirectory(resolve(fileDir, originalModuleSpecifier))

  const currentModuleExtension = extname(originalModuleSpecifier)

  const { tryExtensions, esExtensions, esExtensionDefault, ensureFileExists } = options

  const targetModule = evaluateTargetModule({
    moduleSpecifier: originalModuleSpecifier,
    filenameDirectory: fileDir,
    filenameExtension: fileExt,
    currentModuleExtension,
    isDirectory,
    tryExtensions,
    esExtensions,
    esExtensionDefault,
    ensureFileExists,
  })

  if (targetModule === false) {
    return null
  }

  return targetModule
}

function isLocalDirectory(absoluteDirectory: string) {
  return existsSync(absoluteDirectory) && lstatSync(absoluteDirectory).isDirectory()
}

function evaluateTargetModule({
  moduleSpecifier,
  currentModuleExtension,
  isDirectory,
  filenameDirectory,
  filenameExtension,
  tryExtensions,
  esExtensions,
  esExtensionDefault,
  ensureFileExists,
}) {
  if (currentModuleExtension && !esExtensions.includes(currentModuleExtension)) {
    return false
  }

  const targetFile = resolve(filenameDirectory, moduleSpecifier)

  if (ensureFileExists) {
    for (const extension of tryExtensions) {
      if (existsSync(targetFile + extension)) {
        return moduleSpecifier + esExtensionDefault
      }
    }

    // fallback to directory, so we find the non-dir first
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
  } else if (esExtensions.includes(filenameExtension)) {
    return moduleSpecifier + esExtensionDefault
  } else {
    return moduleSpecifier + esExtensionDefault
  }

  return false
}

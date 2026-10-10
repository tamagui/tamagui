import { existsSync, lstatSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import * as t from '@babel/types'

const DEFAULT_OPTIONS = {
  ensureFileExists: true,
  esExtensionDefault: '.mjs',
  tryExtensions: ['.js'],
  esExtensions: ['.mjs'],
  convertProcessEnvToImportMetaEnv: false,
}
function FullySpecified(api, rawOptions = {}) {
  api.assertVersion(7)
  const options = normalizeOptions(rawOptions)
  const importDeclarationVisitor = (path, state) => {
    const filePath = state.file.opts.filename
    if (!filePath) return
    const { node } = path
    if (node.importKind === 'type') return
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
  const exportDeclarationVisitor = (path, state) => {
    const filePath = state.file.opts.filename
    if (!filePath) return
    const { node } = path
    if (node.exportKind === 'type') return
    const source = node.source
    if (!source) return
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
  const importVisitor = (path, state) => {
    const filePath = state.file.opts.filename
    if (!filePath) return
    const parent = path.parent
    if (parent.type !== 'CallExpression') {
      return
    }
    const firstArgOfImportCall = parent.arguments[0]
    if (firstArgOfImportCall.type !== 'StringLiteral') {
      return
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
  const memberExpressionVisitor = (path) => {
    if (!options.convertProcessEnvToImportMetaEnv) return
    const { node } = path
    if (
      node.object.type === 'MemberExpression' &&
      node.object.object.type === 'Identifier' &&
      node.object.object.name === 'process' &&
      node.object.property.type === 'Identifier' &&
      node.object.property.name === 'env'
    ) {
      if (node.property.type === 'Identifier' && node.property.name === 'NODE_ENV') {
        return
      }
      node.object = t.memberExpression(
        t.metaProperty(t.identifier('import'), t.identifier('meta')),
        t.identifier('env')
      )
    }
  }
  return {
    name: 'babel-plugin-fully-specified',
    visitor: {
      ImportDeclaration: importDeclarationVisitor,
      ExportNamedDeclaration: exportDeclarationVisitor,
      ExportAllDeclaration: exportDeclarationVisitor,
      Import: importVisitor,
      MemberExpression: memberExpressionVisitor,
    },
  }
}
function normalizeOptions(rawOptions) {
  const options = {
    ...DEFAULT_OPTIONS,
    ...rawOptions,
  }
  if (
    rawOptions.esExtensionDefault &&
    !rawOptions.tryExtensions &&
    rawOptions.esExtensionDefault !== DEFAULT_OPTIONS.esExtensionDefault
  ) {
    options.tryExtensions = [
      rawOptions.esExtensionDefault,
      ...DEFAULT_OPTIONS.tryExtensions.filter(
        (extension) => extension !== rawOptions.esExtensionDefault
      ),
    ]
  }
  return options
}
function getFullySpecifiedModuleSpecifier(
  originalModuleSpecifier,
  { filePath, options }
) {
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
function isLocalDirectory(absoluteDirectory) {
  return existsSync(absoluteDirectory) && lstatSync(absoluteDirectory).isDirectory()
}
function isNativeOutput(esExtensionDefault) {
  return esExtensionDefault.startsWith('.native')
}
function hasPlatformSibling(absoluteBasePath) {
  return (
    existsSync(`${absoluteBasePath}.ios.js`) ||
    existsSync(`${absoluteBasePath}.android.js`)
  )
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
  const targetFile = resolve(filenameDirectory, moduleSpecifier)
  if (ensureFileExists) {
    if (isNativeOutput(esExtensionDefault) && hasPlatformSibling(targetFile)) {
      return false
    }
    for (const extension of tryExtensions) {
      if (existsSync(targetFile + extension)) {
        return moduleSpecifier + esExtensionDefault
      }
    }
    if (currentModuleExtension && !esExtensions.includes(currentModuleExtension)) {
      return false
    }
    if (isDirectory) {
      const indexModuleSpecifier = `${moduleSpecifier.replace(/\/$/, '')}/index`
      const indexTargetFile = resolve(filenameDirectory, indexModuleSpecifier)
      if (isNativeOutput(esExtensionDefault) && hasPlatformSibling(indexTargetFile)) {
        return false
      }
      for (const extension of tryExtensions) {
        if (existsSync(indexTargetFile + extension)) {
          return indexModuleSpecifier + esExtensionDefault
        }
      }
    }
  } else if (esExtensions.includes(filenameExtension)) {
    return moduleSpecifier + esExtensionDefault
  } else {
    return moduleSpecifier + esExtensionDefault
  }
  return false
}

export { FullySpecified as default }
//# sourceMappingURL=index.mjs.map

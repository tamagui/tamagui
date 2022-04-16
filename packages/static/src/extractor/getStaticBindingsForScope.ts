import { dirname, extname, resolve } from 'path'

import { Binding, NodePath } from '@babel/traverse'
import * as t from '@babel/types'
import { existsSync } from 'fs-extra'

import { evaluateAstNode } from './evaluateAstNode'
import { getSourceModule } from './getSourceModule'

const isLocalImport = (path: string) => path.startsWith('.') || path.startsWith('/')

function resolveImportPath(sourcePath: string, path: string) {
  const sourceDir = dirname(sourcePath)
  if (isLocalImport(path)) {
    if (extname(path) === '') {
      path += '.js'
    }
    return resolve(sourceDir, path)
  }
  return path
}

function importModule(path: string) {
  const filenames = [path.replace('.js', '.tsx'), path.replace('.js', '.ts'), path]
  for (const file of filenames) {
    if (existsSync(file)) {
      // TODO we can clear this when we see updates on it later on
      return require(file)
    }
  }
  return null
}

export function getStaticBindingsForScope(
  scope: NodePath<t.JSXElement>['scope'],
  whitelist: string[] = [],
  sourcePath: string,
  bindingCache: Record<string, string | null>,
  shouldPrintDebug: boolean | 'verbose'
): Record<string, any> {
  const bindings: Record<string, Binding> = scope.getAllBindings() as any
  const ret: Record<string, any> = {}

  if (shouldPrintDebug) {
    // prettier-ignore
    console.log('  ', Object.keys(bindings).length, 'variables in scope')
    // .map(x => bindings[x].identifier?.name).join(', ')
  }

  // on react native at least it doesnt find some bindings? not sure why
  // lets add in whitelisted imports if they exist
  const program = scope.getProgramParent().block as t.Program
  for (const node of program.body) {
    if (t.isImportDeclaration(node)) {
      const importPath = node.source.value
      if (!node.specifiers.length) continue
      if (!isLocalImport(importPath)) {
        continue
      }
      const moduleName = resolveImportPath(sourcePath, importPath)
      const isOnWhitelist = whitelist.some((test) => moduleName.endsWith(test))
      if (!isOnWhitelist) continue
      const src = importModule(moduleName)
      if (!src) continue
      for (const specifier of node.specifiers) {
        if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) {
          if (typeof src[specifier.imported.name] !== 'undefined') {
            const val = src[specifier.local.name]
            ret[specifier.local.name] = val
          }
        }
      }
    }
  }

  if (!bindingCache) {
    throw new Error('bindingCache is a required param')
  }

  for (const k in bindings) {
    const binding = bindings[k]

    // check to see if the item is a module
    const sourceModule = getSourceModule(k, binding)
    if (sourceModule) {
      if (!sourceModule.sourceModule) {
        continue
      }

      const moduleName = resolveImportPath(sourcePath, sourceModule.sourceModule)
      const isOnWhitelist = whitelist.some((test) => moduleName.endsWith(test))

      // TODO we could cache this at the file level.. and check if its been touched since

      if (isOnWhitelist) {
        const src = importModule(moduleName)
        if (!src) {
          console.log(
            `⚠️ missing file ${moduleName} via ${sourcePath} import ${sourceModule.sourceModule}?`
          )
          return {}
        }
        if (sourceModule.destructured) {
          if (sourceModule.imported) {
            ret[k] = src[sourceModule.imported]
          }
        } else {
          // crude esmodule check
          // TODO: make sure this actually works
          // if (src && src.__esModule) {
          //   ret[k] = src.default
          // } else {
          ret[k] = src
          // }
        }
      }
      continue
    }

    const { parent, parentPath } = binding.path

    if (!t.isVariableDeclaration(parent) || parent.kind !== 'const') {
      continue
    }

    // pick out the right variable declarator
    const dec = parent.declarations.find((d) => t.isIdentifier(d.id) && d.id.name === k)

    // if init is not set, there's nothing to evaluate
    // TODO: handle spread syntax
    if (!dec || !dec.init) {
      continue
    }

    // missing start/end will break caching
    if (typeof dec.id.start !== 'number' || typeof dec.id.end !== 'number') {
      console.error('dec.id.start/end is not a number')
      continue
    }

    if (!t.isIdentifier(dec.id)) {
      console.error('dec is not an identifier')
      continue
    }

    const cacheKey = `${dec.id.name}_${dec.id.start}-${dec.id.end}`

    // retrieve value from cache
    if (bindingCache.hasOwnProperty(cacheKey)) {
      ret[k] = bindingCache[cacheKey]
      continue
    }
    // retrieve value from cache
    if (bindingCache.hasOwnProperty(cacheKey)) {
      ret[k] = bindingCache[cacheKey]
      continue
    }

    // evaluate
    try {
      ret[k] = evaluateAstNode(dec.init, undefined, shouldPrintDebug)
      bindingCache[cacheKey] = ret[k]
      continue
    } catch (e) {
      // skip
      // if (shouldPrintDebug) {
      //   console.error('[🐇] cant eval, skipping', cacheKey) //, e.message)
      // }
    }
  }

  return ret
}

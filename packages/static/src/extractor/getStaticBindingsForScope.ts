import type { ChildProcess } from 'node:child_process'
import { fork } from 'node:child_process'
import { dirname, extname, join, resolve } from 'node:path'

import type { Binding, NodePath } from '@babel/traverse'
import * as t from '@babel/types'

import { evaluateAstNode } from './evaluateAstNode'
import { getSourceModule } from './getSourceModule'

// import { fileURLToPath } from 'node:url'
// // @ts-ignore
// const __dirname = dirname(fileURLToPath(import.meta.url))

const isLocalImport = (path: string) => path.startsWith('.') || path.startsWith('/')

function resolveImportPath(sourcePath: string, path: string) {
  const sourceDir = dirname(sourcePath)
  if (isLocalImport(path)) {
    if (extname(path) === '') {
      path += ''
    }
    return resolve(sourceDir, path)
  }
  return path
}

const cache = new Map()
const pending = new Map<string, Promise<any>>()

const loadCmd = `${join(__dirname, 'loadFile.js')}`

let exited = false

let child: ChildProcess | null = null

function forkChild() {
  child = fork(loadCmd, [], {
    execArgv: ['-r', 'esbuild-register'],
    detached: false,
    stdio: 'ignore',
  })
}

export function cleanupBeforeExit() {
  if (exited) return
  if (!child) return
  child.removeAllListeners()
  child.unref()
  child.disconnect()
  child.kill()
  exited = true
}

process.once('SIGTERM', cleanupBeforeExit)
process.once('SIGINT', cleanupBeforeExit)
process.once('beforeExit', cleanupBeforeExit)

function importModule(path: string) {
  if (!child) {
    forkChild()
  }
  if (pending.has(path)) {
    return pending.get(path)
  }
  const promise = new Promise((res, rej) => {
    if (!child) return
    if (cache.size > 2000) {
      cache.clear()
    }
    if (cache.has(path)) {
      return cache.get(path)
    }
    const listener = (msg: any) => {
      if (!child) return
      if (!msg) return
      if (typeof msg !== 'string') return
      if (msg[0] === '-') {
        rej(new Error(msg.slice(1)))
        return
      }
      child.removeListener('message', listener)
      const val = JSON.parse(msg)
      cache.set(path, val)
      res(val)
    }
    child.once('message', listener)
    child.send(`${path.replace('.js', '')}`)
  })
  pending.set(path, promise)
  return promise
}

export async function getStaticBindingsForScope(
  scope: NodePath<t.JSXElement>['scope'],
  whitelist: string[] = [],
  sourcePath: string,
  bindingCache: Record<string, string | null>,
  shouldPrintDebug: boolean | 'verbose'
): Promise<Record<string, any>> {
  const bindings: Record<string, Binding> = scope.getAllBindings() as any
  const ret: Record<string, any> = {}

  if (shouldPrintDebug) {
    // prettier-ignore
    // console.info('  ', Object.keys(bindings).length, 'variables in scope')
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
      try {
        const src = await importModule(moduleName)
        if (!src) continue
        for (const specifier of node.specifiers) {
          if (t.isImportSpecifier(specifier) && t.isIdentifier(specifier.imported)) {
            if (typeof src[specifier.imported.name] !== 'undefined') {
              const val = src[specifier.local.name]
              ret[specifier.local.name] = val
            }
          }
        }
      } catch (err: any) {
        if (shouldPrintDebug) {
          console.warn(
            `    | Skipping partial evaluation of constant file: ${moduleName} (DEBUG=tamagui for more)`
          )
        } else if (process.env.DEBUG?.startsWith('tamagui')) {
          console.info(`Error in partial evaluation`, err.message, err.stack)
        }
      }
    }
  }

  if (!bindingCache) {
    throw new Error('BindingCache is a required param')
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
          console.info(
            `    | ⚠️ Missing file ${moduleName} via ${sourcePath} import ${sourceModule.sourceModule}?`
          )
          return {}
        }
        if (sourceModule.destructured) {
          if (sourceModule.imported) {
            ret[k] = src[sourceModule.imported]
          }
        } else {
          ret[k] = src
        }
      }
      continue
    }

    const { parent } = binding.path

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
    if (Object.hasOwnProperty.call(bindingCache, cacheKey)) {
      ret[k] = bindingCache[cacheKey]
      continue
    }
    // retrieve value from cache
    if (Object.hasOwnProperty.call(bindingCache, cacheKey)) {
      ret[k] = bindingCache[cacheKey]
      continue
    }

    // evaluate
    try {
      ret[k] = evaluateAstNode(dec.init, undefined, shouldPrintDebug)
      bindingCache[cacheKey] = ret[k]
      continue
    } catch {
      // skip
    }
  }

  return ret
}

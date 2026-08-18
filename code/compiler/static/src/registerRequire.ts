import { register } from 'esbuild-register/dist/node'
import { createRequire } from 'node:module'

import { esbuildIgnoreFilesRegex } from './extractor/bundle'
import { requireTamaguiCore } from './helpers/requireTamaguiCore'
import { isIgnoredStaticEvaluationModule } from './staticEvaluationIgnoredModules'
import type { TamaguiPlatform } from './types'

const nameToPaths = {}
const nodeRequire = createRequire(
  typeof __filename === 'string' ? __filename : import.meta.url
)

export const getNameToPaths = () => nameToPaths

const Module = nodeRequire('node:module')

let isRegistered = false
let og: any

class StaticEvaluationError extends Error {
  code = 'TAMAGUI_STATIC_EVALUATION_ERROR' as const
}

const compiled = {}
export function setRequireResult(name: string, result: any) {
  compiled[name] = result
}

function getStaticExtractionStub(path: string) {
  switch (path) {
    case 'expo-constants':
      return {
        __esModule: true,
        default: {
          executionEnvironment: null,
        },
        ExecutionEnvironment: {
          Bare: 'bare',
          Standalone: 'standalone',
          StoreClient: 'storeClient',
        },
      }
    case 'expo-updates':
      return {
        __esModule: true,
        default: {
          isEnabled: false,
          isUsingEmbeddedAssets: true,
        },
        checkForUpdateAsync: async () => ({ isAvailable: false }),
        fetchUpdateAsync: async () => ({ isNew: false }),
        reloadAsync: async () => {},
      }
    default:
      return null
  }
}

export function registerRequire(
  platform: TamaguiPlatform,
  { ignoredModules = [] }: { ignoredModules?: string[] } = {
    ignoredModules: [],
  }
) {
  // already registered
  if (isRegistered) {
    return {
      tamaguiRequire: nodeRequire,
      unregister: () => {},
    }
  }

  // capture original resolve BEFORE esbuild-register patches it
  // so we can use Node's native exports resolution for @tamagui packages
  const originalResolveFilename = Module._resolveFilename

  const { unregister } = register({
    hookIgnoreNodeModules: false,
    // don't transform @tamagui packages - they have pre-built dist files
    hookMatcher: (filename) => {
      if (
        filename.includes('@tamagui') ||
        /\/tamagui\/code\/(core|ui|packages)\//.test(filename)
      ) {
        return false
      }
      return true
    },
  })

  // esbuild-register's registerTsconfigPaths replaces Module._resolveFilename
  // but tsconfig paths resolution bypasses Node's package exports
  // we need to restore Node's native resolution for @tamagui packages
  const tsconfigPatchedResolve = Module._resolveFilename
  Module._resolveFilename = function (request: string, ...args: any[]) {
    // for @tamagui packages, use Node's native resolution (respects exports)
    if (request.startsWith('@tamagui/')) {
      return originalResolveFilename.call(this, request, ...args)
    }
    // for everything else, use tsconfig-paths resolution
    return tsconfigPatchedResolve.call(this, request, ...args)
  }

  if (!og) {
    og = Module.prototype.require // capture esbuild require
  }

  isRegistered = true

  Module.prototype.require = tamaguiRequire

  function tamaguiRequire(this: any, path: string) {
    const staticExtractionStub = getStaticExtractionStub(path)
    if (staticExtractionStub) {
      return staticExtractionStub
    }

    if (path === 'tamagui' && platform === 'native') {
      return og.apply(this, ['tamagui/native'])
    }

    if (path === '@tamagui/core') {
      return requireTamaguiCore(platform, (path) => {
        return og.apply(this, [path])
      })
    }

    if (isIgnoredStaticEvaluationModule(path, ignoredModules)) {
      return {}
    }

    if (esbuildIgnoreFilesRegex.test(path)) {
      return {}
    }

    if (path in compiled) {
      return compiled[path]
    }

    if (path === 'react-native-svg') {
      return og.apply(this, ['@tamagui/react-native-svg'])
    }

    if (path === 'react-native/package.json') {
      return og.apply(this, ['react-native-web/package.json'])
    }

    if (
      path === '@tamagui/react-native-web-lite' ||
      path === 'react-native' ||
      path.startsWith('react-native/') ||
      path === 'react-native-web' ||
      path.startsWith('react-native-web/')
    ) {
      try {
        return og.apply('react-native')
      } catch {
        return og.apply(this, ['@tamagui/react-native-web-lite'])
      }
    }

    try {
      const out = og.apply(this, arguments)
      return out
    } catch (err: any) {
      if (err?.code === 'TAMAGUI_STATIC_EVALUATION_ERROR') {
        throw err
      }
      const importer = this?.filename || this?.id || '<unknown module>'
      const reason = err instanceof Error ? err.message : String(err)
      throw new StaticEvaluationError(
        `[tamagui] Failed to evaluate module "${path}" imported from "${importer}" while loading the Tamagui config and configured components.\nReason: ${reason}\nFix the module so it can run in Node during the build. If it is runtime-only and none of its exports create your Tamagui config or components, add "${path}" to dangerouslyIgnoreStaticEvaluationModules in tamagui.build.ts.`,
        { cause: err }
      )
    }
  }

  return {
    tamaguiRequire,
    unregister: () => {
      unregister()
      isRegistered = false
      Module.prototype.require = og
    },
  }
}

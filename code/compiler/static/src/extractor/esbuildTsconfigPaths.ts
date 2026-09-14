import type { Plugin } from 'esbuild'
import {
  createPathsMatcher,
  getTsconfig,
  parseTsconfig,
  type TsConfigJsonResolved,
  type TsConfigResult,
} from 'get-tsconfig'
import fs from 'node:fs'
import path from 'node:path'

const name = 'tsconfig-paths'

type Tsconfig = Pick<TsConfigJsonResolved, 'compilerOptions'>
type TsconfigPathMatcher = (specifier: string) => string[]

function loadTsconfig(
  tsconfig?: Tsconfig | string,
  cwd = process.cwd()
): TsConfigResult | null {
  if (!tsconfig) {
    return getTsconfig(cwd) || getTsconfig(cwd, 'jsconfig.json')
  }

  if (typeof tsconfig === 'string') {
    const configPath = path.resolve(cwd, tsconfig)
    if (!fs.existsSync(configPath)) {
      throw new Error(`Specified tsconfig file not found: ${configPath}`)
    }
    return { path: configPath, config: parseTsconfig(configPath) }
  }

  return {
    path: path.join(cwd, 'tsconfig.json'),
    config: tsconfig,
  }
}

export function createTsconfigPathsMatcher(
  tsconfig?: Tsconfig | string,
  cwd = process.cwd()
): ((specifier: string) => string[]) | null {
  const loaded = loadTsconfig(tsconfig, cwd)
  return loaded ? createPathsMatcher(loaded) : null
}

export function loadTsconfigPathMatcher(
  tsconfig?: TsConfigJsonResolved | string
): TsconfigPathMatcher {
  let result: TsConfigResult | null
  if (!tsconfig) {
    result = getTsconfig(process.cwd()) || getTsconfig(process.cwd(), 'jsconfig.json')
  } else if (typeof tsconfig === 'string') {
    if (fs.existsSync(tsconfig)) {
      const configPath = path.resolve(tsconfig)
      result = { config: parseTsconfig(configPath), path: configPath }
    } else {
      throw new Error(`Specified tsconfig file not found: ${tsconfig}`)
    }
  } else {
    result = { config: tsconfig, path: path.join(process.cwd(), 'tsconfig.json') }
  }

  if (!result) return () => []
  const matchPaths = createPathsMatcher(result)
  const patterns = Object.keys(result.config.compilerOptions?.paths || {})
  if (!matchPaths || patterns.length === 0) return () => []

  return (specifier) => {
    const matchesExplicitPath = patterns.some((pattern) => {
      const wildcardIndex = pattern.indexOf('*')
      if (wildcardIndex === -1) return pattern === specifier
      return (
        specifier.startsWith(pattern.slice(0, wildcardIndex)) &&
        specifier.endsWith(pattern.slice(wildcardIndex + 1))
      )
    })
    return matchesExplicitPath ? matchPaths(specifier) : []
  }
}

export function TsconfigPathsPlugin(): Plugin {
  const matchTsconfigPath = loadTsconfigPathMatcher()

  return {
    name,
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        const pluginData = args.pluginData as
          | { tamaguiTsconfigPaths?: boolean; tamaguiTsconfigPathsResolved?: boolean }
          | undefined
        if (
          pluginData?.tamaguiTsconfigPaths ||
          pluginData?.tamaguiTsconfigPathsResolved
        ) {
          return null
        }

        // skip @tamagui packages - they should be externalized, not resolved via tsconfig
        if (args.path.startsWith('@tamagui/')) {
          return null
        }

        for (const candidate of matchTsconfigPath(args.path)) {
          const resolved = await build.resolve(candidate, {
            importer: args.importer,
            kind: args.kind,
            namespace: args.namespace,
            pluginData: {
              ...(args.pluginData && typeof args.pluginData === 'object'
                ? args.pluginData
                : {}),
              tamaguiTsconfigPaths: true,
              tamaguiTsconfigPathsResolved: true,
            },
            resolveDir: args.resolveDir,
          })
          if (
            resolved.path &&
            !resolved.path.endsWith('.d.ts') &&
            resolved.errors.length === 0
          ) {
            return resolved
          }
        }

        return null
      })
    },
  }
}

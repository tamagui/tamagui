import type { Plugin } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import {
  createPathsMatcher,
  getTsconfig,
  parseTsconfig,
  type TsConfigJsonResolved,
  type TsConfigResult,
} from 'get-tsconfig'

const name = 'tsconfig-paths'

type Tsconfig = Pick<TsConfigJsonResolved, 'compilerOptions'>

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

export function TsconfigPathsPlugin(): Plugin {
  const pathsMatcher = createTsconfigPathsMatcher()

  return {
    name,
    setup(build) {
      build.onResolve({ filter: /.*/ }, async (args) => {
        if (
          !pathsMatcher ||
          args.path.startsWith('@tamagui/') ||
          (args.pluginData as { tamaguiTsconfigPaths?: boolean } | undefined)
            ?.tamaguiTsconfigPaths
        ) {
          return null
        }

        for (const candidate of pathsMatcher(args.path)) {
          const resolved = await build.resolve(candidate, {
            importer: args.importer,
            kind: args.kind,
            namespace: args.namespace,
            resolveDir: args.resolveDir,
            pluginData: {
              ...(args.pluginData as object | undefined),
              tamaguiTsconfigPaths: true,
            },
          })
          if (
            resolved.errors.length === 0 &&
            resolved.path &&
            !resolved.path.endsWith('.d.ts')
          ) {
            return resolved
          }
        }

        return null
      })
    },
  }
}

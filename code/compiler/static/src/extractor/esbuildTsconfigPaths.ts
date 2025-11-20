import type { Plugin } from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import {
  findConfigFile,
  nodeModuleNameResolver,
  parseJsonConfigFileContent,
  readConfigFile,
  sys,
} from 'typescript'

const name = 'tsconfig-paths'

interface Tsconfig {
  compilerOptions?: {
    baseUrl?: string
    paths?: Record<string, string[]>
  }
}

export function TsconfigPathsPlugin(): Plugin {
  const compilerOptions = loadCompilerOptionsFromTsconfig()

  return {
    name,
    setup({ onResolve }) {
      onResolve({ filter: /.*/ }, (args) => {
        const paths = compilerOptions.paths || {}
        const hasMatchingPath = Object.keys(paths).some((p) =>
          new RegExp(p.replace('*', '\\w*')).test(args.path)
        )

        if (!hasMatchingPath) {
          return null
        }

        const { resolvedModule } = nodeModuleNameResolver(
          args.path,
          args.importer,
          compilerOptions,
          sys
        )

        if (!resolvedModule) {
          return null
        }

        const { resolvedFileName } = resolvedModule

        if (!resolvedFileName || resolvedFileName.endsWith('.d.ts')) {
          return null
        }

        return {
          path: resolvedFileName,
        }
      })
    },
  }
}

function loadCompilerOptionsFromTsconfig(tsconfig?: Tsconfig | string) {
  if (!tsconfig) {
    const configPath =
      findConfigFile(process.cwd(), sys.fileExists, 'tsconfig.json') ||
      findConfigFile(process.cwd(), sys.fileExists, 'jsconfig.json')

    if (configPath) {
      return parseTsconfig(configPath)
    }
    return {}
  }

  if (typeof tsconfig === 'string') {
    if (fs.existsSync(tsconfig)) {
      return parseTsconfig(tsconfig)
    } else {
      throw new Error(`Specified tsconfig file not found: ${tsconfig}`)
    }
  }

  const baseDir = process.cwd()
  const parsed = parseJsonConfigFileContent(tsconfig, sys, baseDir)
  return parsed.options
}

function parseTsconfig(configFilePath: string) {
  const configFile = readConfigFile(configFilePath, sys.readFile)
  if (configFile.error) {
    throw new Error(
      `Error reading tsconfig file '${configFilePath}': ${configFile.error.messageText}`
    )
  }

  const baseDir = path.dirname(configFilePath)
  const parsed = parseJsonConfigFileContent(configFile.config, sys, baseDir)
  return parsed.options
}

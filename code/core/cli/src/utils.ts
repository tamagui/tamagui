import type { TamaguiOptions, TamaguiProjectInfo } from '@tamagui/static'
import {
  loadTamaguiBuildConfigSync,
  loadTamagui as loadTamaguiStatic,
} from '@tamagui/static'
import type { CLIResolvedOptions, CLIUserOptions } from '@tamagui/types'
import chalk from 'chalk'
import fs, { pathExists, readJSON } from 'fs-extra'
import { join } from 'node:path'

export async function getOptions({
  root = process.cwd(),
  tsconfigPath = 'tsconfig.json',
  tamaguiOptions,
  host,
  debug,
  loadTamaguiOptions,
}: Partial<CLIUserOptions> = {}): Promise<CLIResolvedOptions> {
  const dotDir = join(root, '.tamagui')
  let pkgJson = {}
  let config = ''
  try {
    config = await getDefaultTamaguiConfigPath()
    pkgJson = await readJSON(join(root, 'package.json'))
  } catch {
    // ok
  }

  const filledOptions = {
    platform: 'native',
    components: ['tamagui'],
    config,
    ...tamaguiOptions,
  } satisfies TamaguiOptions

  const finalOptions = loadTamaguiOptions
    ? loadTamaguiBuildConfigSync(filledOptions)
    : filledOptions

  return {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    root,
    host: host || '127.0.0.1',
    pkgJson,
    debug,
    tsconfigPath,
    tamaguiOptions: finalOptions,
    paths: {
      root,
      dotDir,
      conf: join(dotDir, 'tamagui.config.json'),
      types: join(dotDir, 'types.json'),
    },
  }
}

export function ensure(condition: boolean, message: string) {
  if (!condition) {
    console.error(chalk.red.bold('Error:'), chalk.yellow(`${message}`))
    process.exit(1)
  }
}

const defaultPaths = ['tamagui.config.ts', join('src', 'tamagui.config.ts')]
let cachedPath = ''

async function getDefaultTamaguiConfigPath() {
  if (cachedPath) return cachedPath
  const existingPaths = await Promise.all(defaultPaths.map((path) => pathExists(path)))
  const existing = existingPaths.findIndex((x) => !!x)
  const found = defaultPaths[existing]
  if (!found) {
    throw new Error(`No found tamagui.config.ts`)
  }
  cachedPath = found
  return found
}

export const loadTamagui = async (
  opts: Partial<TamaguiOptions>
): Promise<TamaguiProjectInfo | null> => {
  const loaded = await loadTamaguiStatic({
    components: ['tamagui'],
    ...opts,
    config: opts.config ?? (await getDefaultTamaguiConfigPath()),
  })
  return loaded
}

const disposers = new Set<Function>()

export function registerDispose(cb: () => void) {
  disposers.add(cb)
}

export function disposeAll() {
  disposers.forEach((cb) => cb())
}

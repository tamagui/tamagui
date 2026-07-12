import { readFile, stat, writeFile } from 'node:fs/promises'
import { extname, relative, resolve, sep } from 'node:path'

type GlobOptions = {
  cwd: string
  absolute: boolean
  nodir: boolean
  ignore: string[]
}

type ToTailwindOptions = {
  patterns: string[]
  write?: boolean
  cwd?: string
  // path to the app's tamagui config; its token scales + media keys drive an app-accurate
  // conversion. when omitted, the converter uses its bundled default (v5) fallback.
  configPath?: string
}

type TokenScales = {
  space?: Record<string, any>
  size?: Record<string, any>
  radius?: Record<string, any>
  zIndex?: Record<string, any>
}
type TransformConfig = { tokens?: TokenScales; media?: Record<string, any> }

type ToTailwindResult = {
  files: number
  changed: number
  written: number
}

type Transform = (source: string, options?: TransformConfig) => string

const codeFileExtensions = new Set(['.js', '.jsx', '.ts', '.tsx'])
const defaultFileGlob = '**/*.{js,jsx,ts,tsx}'
const ignoredGlobs = ['**/node_modules/**', '**/.git/**']

const { glob } = require('glob') as {
  glob(pattern: string, options: GlobOptions): Promise<string[]>
}

const { createTwoFilesPatch } = require('diff') as {
  createTwoFilesPatch(
    oldFileName: string,
    newFileName: string,
    oldStr: string,
    newStr: string,
    oldHeader?: string,
    newHeader?: string,
    options?: { context?: number }
  ): string
}

export async function toTailwind({
  patterns,
  write = false,
  cwd = process.cwd(),
  configPath,
}: ToTailwindOptions): Promise<ToTailwindResult> {
  if (!patterns.length) {
    throw new Error('Usage: tamagui to-tailwind <paths/glob> [--write] [--config <path>]')
  }

  const files = await collectFiles(patterns, cwd)
  const tamaguiToTailwind = loadTamaguiToTailwind()
  const transformConfig = await loadTransformConfig(configPath, cwd)
  let changed = 0
  let written = 0

  for (const file of files) {
    const source = await readFile(file, 'utf8')
    const transformed = tamaguiToTailwind(source, transformConfig)

    if (transformed === source) {
      continue
    }

    changed++

    if (write) {
      await writeFile(file, transformed)
      written++
      continue
    }

    process.stdout.write(createDiff(file, source, transformed, cwd))
  }

  if (files.length === 0) {
    console.info('No files matched.')
  } else if (changed === 0) {
    console.info(`No to-tailwind changes found in ${files.length} file(s).`)
  } else if (write) {
    console.info(`Converted ${changed} of ${files.length} file(s).`)
  } else {
    console.info(
      `\n[dry-run] ${changed} of ${files.length} file(s) would change. Run with --write to apply.`
    )
  }

  return {
    files: files.length,
    changed,
    written,
  }
}

async function collectFiles(patterns: string[], cwd: string) {
  const files = new Set<string>()

  for (const pattern of patterns) {
    const resolved = resolve(cwd, pattern)
    const existing = await stat(resolved).catch(() => null)

    if (existing?.isDirectory()) {
      for (const file of await glob(defaultFileGlob, {
        cwd: resolved,
        absolute: true,
        nodir: true,
        ignore: ignoredGlobs,
      })) {
        files.add(resolve(file))
      }
      continue
    }

    if (existing?.isFile()) {
      if (isCodeFile(resolved)) {
        files.add(resolved)
      }
      continue
    }

    for (const file of await glob(pattern, {
      cwd,
      absolute: true,
      nodir: true,
      ignore: ignoredGlobs,
    })) {
      if (isCodeFile(file)) {
        files.add(resolve(file))
      }
    }
  }

  return [...files].sort()
}

function createDiff(file: string, source: string, transformed: string, cwd: string) {
  const displayPath = toPosixPath(relative(cwd, file) || file)
  return createTwoFilesPatch(
    displayPath,
    displayPath,
    source,
    transformed,
    'before',
    'after',
    {
      context: 3,
    }
  )
}

function isCodeFile(file: string) {
  return codeFileExtensions.has(extname(file))
}

function toPosixPath(path: string) {
  return path.split(sep).join('/')
}

// load the app's tamagui config (a created-config object exposing `.tokens` and `.media`) so
// the converter resolves tokens/media from the ACTUAL app scales. we take the EXPLICIT-path
// route (`--config <path>`) rather than auto-discovering + bundling `tamagui.config.ts`: a real
// tamagui config is TS with `~`/`@` aliases and needs the app's bundler to evaluate, which the
// CLI can't reliably do — an explicit path the user has already made requireable (or a small
// module re-exporting `{ tokens, media }`) is the honest, non-magical contract. when omitted,
// the converter falls back to its bundled default scales.
async function loadTransformConfig(
  configPath: string | undefined,
  cwd: string
): Promise<TransformConfig> {
  if (!configPath) return {}
  const resolved = resolve(cwd, configPath)
  let mod: any
  try {
    mod = require(resolved)
  } catch (requireErr) {
    try {
      mod = await import(resolved)
    } catch {
      console.warn(
        `[to-tailwind] could not load --config ${configPath} (${
          (requireErr as Error).message
        }); falling back to the bundled default token/media scales.`
      )
      return {}
    }
  }
  // accept a created config on `config`, `default`, `tamaguiConfig`, or the module itself
  const config = mod?.config ?? mod?.default ?? mod?.tamaguiConfig ?? mod
  const tokens = config?.tokens
  const media = config?.media
  if (!tokens && !media) {
    console.warn(
      `[to-tailwind] --config ${configPath} loaded but exposes no { tokens, media }; using the bundled default scales.`
    )
    return {}
  }
  return { tokens, media }
}

function loadTamaguiToTailwind(): Transform {
  const { tamaguiToTailwind } = require('@tamagui/to-tailwind') as {
    tamaguiToTailwind?: Transform
  }

  if (typeof tamaguiToTailwind !== 'function') {
    throw new Error('@tamagui/to-tailwind did not export tamaguiToTailwind')
  }

  return tamaguiToTailwind
}

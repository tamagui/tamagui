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
  // path to the app's tamagui config; its token scales + media keys + shorthands drive an
  // app-accurate conversion.
  configPath?: string
  // acknowledge use of the converter's bundled default scales (required for --write w/o --config)
  useDefaultConfig?: boolean
  // opt in to DOM renaming (View→div …). default false: Tamagui components are PRESERVED so the
  // cross-platform (native) app keeps working.
  renameDom?: boolean
}

type TokenScales = {
  space?: Record<string, any>
  size?: Record<string, any>
  radius?: Record<string, any>
  zIndex?: Record<string, any>
}
type TransformConfig = {
  tokens?: TokenScales
  media?: Record<string, any>
  shorthands?: Record<string, string>
  renameComponents?: boolean
}

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
  useDefaultConfig = false,
  renameDom = false,
}: ToTailwindOptions): Promise<ToTailwindResult> {
  if (!patterns.length) {
    throw new Error(
      'Usage: tamagui to-tailwind <paths/glob> [--write] [--config <path> | --use-default-config] [--rename-dom]'
    )
  }

  // SAFETY: --write is DESTRUCTIVE. token/media semantics differ per app, so a --write with no
  // config would GUESS the scales and corrupt pixels. require an explicit choice.
  if (write && !configPath && !useDefaultConfig) {
    throw new Error(
      '--write requires either --config <path> (app scales) or --use-default-config ' +
        '(acknowledge the bundled default scales). refusing to rewrite with guessed token pixels.'
    )
  }

  const { transformConfig, usedDefault } = await loadTransformConfig(
    configPath,
    useDefaultConfig,
    cwd
  )
  if (usedDefault && !useDefaultConfig) {
    // dry-run fallback: loud, explicit warning that default pixels are used
    console.warn(
      '[to-tailwind] WARNING: no --config given — using the converter BUNDLED DEFAULT token/media ' +
        'scales. token pixel values may not match this app. pass --config <path> for accuracy.'
    )
  }
  transformConfig.renameComponents = renameDom

  const files = await collectFiles(patterns, cwd)

  // TRANSACTIONAL parse check: abort BEFORE any transform/write if any file has parse errors,
  // so malformed source is never normalized/partially rewritten.
  const { findParseError } = require('@tamagui/to-tailwind') as {
    findParseError?: (source: string) => string | null
  }
  const sources = new Map<string, string>()
  for (const file of files) {
    const source = await readFile(file, 'utf8')
    sources.set(file, source)
    const err = typeof findParseError === 'function' ? findParseError(source) : null
    if (err) {
      throw new Error(`parse error in ${relative(cwd, file) || file}: ${err} — aborted, no files written`)
    }
  }

  const tamaguiToTailwind = loadTamaguiToTailwind()
  let changed = 0
  let written = 0

  for (const file of files) {
    const source = sources.get(file)!
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
// load the app config's token/media/shorthand scales. an EXPLICIT --config that fails to load or
// has an invalid shape ABORTS (throws) — never silently falls back (that would rewrite with wrong
// pixels). no --config → bundled default (usedDefault=true); the caller gates --write on this.
async function loadTransformConfig(
  configPath: string | undefined,
  useDefaultConfig: boolean,
  cwd: string
): Promise<{ transformConfig: TransformConfig; usedDefault: boolean }> {
  if (!configPath) {
    // useDefaultConfig or dry-run: converter uses its in-package bundled defaults
    return { transformConfig: {}, usedDefault: true }
  }
  const resolved = resolve(cwd, configPath)
  let mod: any
  try {
    mod = require(resolved)
  } catch (requireErr) {
    try {
      mod = await import(resolved)
    } catch {
      throw new Error(
        `--config ${configPath} could not be loaded (${(requireErr as Error).message}) — ` +
          `aborted (not falling back to default scales, which could corrupt pixels).`
      )
    }
  }
  const config = mod?.config ?? mod?.default ?? mod?.tamaguiConfig ?? mod
  const tokens = config?.tokens
  const media = config?.media
  const shorthands = config?.shorthands
  if (!tokens && !media && !shorthands) {
    throw new Error(
      `--config ${configPath} loaded but exposes no { tokens, media, shorthands } — ` +
        `aborted (invalid config shape).`
    )
  }
  return { transformConfig: { tokens, media, shorthands }, usedDefault: false }
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

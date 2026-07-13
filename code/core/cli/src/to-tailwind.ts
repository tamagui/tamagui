import { readFile, stat, writeFile } from 'node:fs/promises'
import { extname, relative, resolve, sep } from 'node:path'
import { bundledDefaultGrammarConfig } from './to-tailwind-default-config'

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
  // path to the app config; token/font/theme names, media, and shorthands drive claiming.
  configPath?: string
  // explicitly use the canonical bundled v5 token/font/theme/media/shorthand domains.
  useDefaultConfig?: boolean
  // opt in to DOM renaming (View→div …). default false: Tamagui components are PRESERVED so the
  // cross-platform (native) app keeps working.
  renameDom?: boolean
}

type TransformConfig = {
  tokens?: Record<string, Record<string, any>>
  fonts?: Record<string, any>
  themes?: Record<string, Record<string, any>>
  media?: Record<string, any>
  shorthands?: Record<string, string>
  grammarConfig?: typeof bundledDefaultGrammarConfig
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

  // SAFETY: --write is destructive. Token domains, media, and shorthands differ per app, so
  // require either an explicit app config or the explicit canonical bundled-config opt-in.
  if (write && !configPath && !useDefaultConfig) {
    throw new Error(
      '--write requires either --config <path> (app token/media grammar) or ' +
        '--use-default-config (acknowledge the bundled defaults).'
    )
  }

  const { transformConfig, usedDefault } = await loadTransformConfig(
    configPath,
    useDefaultConfig,
    cwd
  )
  if (usedDefault && !useDefaultConfig) {
    // Dry-run fallback: explicit token references emit their names; other config data defaults.
    console.warn(
      '[to-tailwind] WARNING: no --config given — explicit token references emit their names ' +
        'and bundled media/shorthands are used. pass --config <path> to enforce app domains.'
    )
  }
  transformConfig.renameComponents = renameDom

  const files = await collectFiles(patterns, cwd)

  // TRANSACTIONAL parse check: abort BEFORE any transform/write if any file has parse errors,
  // so malformed source is never normalized/partially rewritten.
  const { findParseError } = require('@tamagui/to-tailwind') as {
    findParseError?: (source: string) => string | null
  }
  if (typeof findParseError !== 'function') {
    throw new Error(
      '@tamagui/to-tailwind did not export findParseError — aborting because transactional parse safety is unavailable'
    )
  }
  const sources = new Map<string, string>()
  for (const file of files) {
    const source = await readFile(file, 'utf8')
    sources.set(file, source)
    const err = findParseError(source)
    if (err) {
      throw new Error(
        `parse error in ${relative(cwd, file) || file}: ${err} — aborted, no files written`
      )
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

// Load the app's token/font/theme NAMES plus media/shorthands. Token values are never baked into
// output; names are used only to reject missing or ambiguous candidates. We take the explicit-path
// route (`--config <path>`) rather than auto-discovering + bundling `tamagui.config.ts`: a real
// tamagui config is TS with `~`/`@` aliases and needs the app's bundler to evaluate, which the
// CLI can't reliably do — an explicit path the user has already made requireable (or a small
// module re-exporting the relevant config view) is the honest, non-magical contract. An explicit
// config that fails to load or has an invalid relevant shape aborts. The bundled-config opt-in
// loads canonical v5 domains; config-less dry-run leaves token/font/theme domains unknown.
async function loadTransformConfig(
  configPath: string | undefined,
  useDefaultConfig: boolean,
  cwd: string
): Promise<{ transformConfig: TransformConfig; usedDefault: boolean }> {
  if (!configPath) {
    if (useDefaultConfig) {
      // --use-default-config is an authoritative opt-in. The local snapshot contains names only;
      // a focused dev-only parity test checks every domain against the canonical v5 config.
      return {
        transformConfig: { grammarConfig: bundledDefaultGrammarConfig },
        usedDefault: true,
      }
    }
    // Config-less dry-run keeps domains unknown and uses converter media/shorthand defaults.
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
          `aborted (not falling back to defaults).`
      )
    }
  }
  const config = mod?.config ?? mod?.default ?? mod?.tamaguiConfig ?? mod
  const tokens = config?.tokens
  const fonts = config?.fonts
  const themes = config?.themes
  const media = config?.media
  const shorthands = config?.shorthands

  // Structure validation: malformed relevant config must abort rather than silently fall back.
  const isObj = (v: any) => v != null && typeof v === 'object' && !Array.isArray(v)
  const bad = (msg: string) => {
    throw new Error(`--config ${configPath} has a malformed shape: ${msg} — aborted.`)
  }
  if (tokens !== undefined) {
    if (!isObj(tokens)) bad('`tokens` must be an object')
    for (const category of ['space', 'size', 'radius', 'zIndex', 'color']) {
      if (tokens[category] !== undefined && !isObj(tokens[category])) {
        bad(`\`tokens.${category}\` must be an object`)
      }
    }
  }
  if (fonts !== undefined && !isObj(fonts)) bad('`fonts` must be an object')
  if (themes !== undefined && !isObj(themes)) bad('`themes` must be an object')
  if (media !== undefined && !isObj(media)) bad('`media` must be an object')
  if (shorthands !== undefined && !isObj(shorthands))
    bad('`shorthands` must be an object')
  if (!tokens && !fonts && !themes && !media && !shorthands) {
    bad('exposes no { tokens, fonts, themes, media, shorthands }')
  }
  return {
    transformConfig: { tokens, fonts, themes, media, shorthands },
    usedDefault: false,
  }
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

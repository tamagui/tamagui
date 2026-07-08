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
}

type ToTailwindResult = {
  files: number
  changed: number
  written: number
}

type Transform = (source: string) => string

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
}: ToTailwindOptions): Promise<ToTailwindResult> {
  if (!patterns.length) {
    throw new Error('Usage: tamagui to-tailwind <paths/glob> [--write]')
  }

  const files = await collectFiles(patterns, cwd)
  const tamaguiToTailwind = loadTamaguiToTailwind()
  let changed = 0
  let written = 0

  for (const file of files) {
    const source = await readFile(file, 'utf8')
    const transformed = tamaguiToTailwind(source)

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

function loadTamaguiToTailwind(): Transform {
  normalizeCallableDefaultExport('@babel/traverse')
  normalizeCallableDefaultExport('@babel/generator')

  const mod = require('@tamagui/to-tailwind')
  const transform = getTransformExport(mod)

  if (typeof transform !== 'function') {
    throw new Error('Could not load @tamagui/to-tailwind transform')
  }

  return transform
}

function getTransformExport(mod: any): Transform | undefined {
  return (
    mod?.tamaguiToTailwind ||
    mod?.default?.tamaguiToTailwind ||
    (typeof mod?.default === 'function' ? mod.default : undefined) ||
    (typeof mod === 'function' ? mod : undefined)
  )
}

function normalizeCallableDefaultExport(packageName: string) {
  const id = require.resolve(packageName)
  const mod = require(packageName)
  const callable = mod?.default

  if (typeof callable !== 'function' || mod === callable) {
    return
  }

  for (const key of Reflect.ownKeys(mod)) {
    if (key === 'default' || Reflect.has(callable, key)) {
      continue
    }

    const descriptor = Object.getOwnPropertyDescriptor(mod, key)
    if (descriptor) {
      Object.defineProperty(callable, key, descriptor)
    }
  }

  const cached = require.cache[id]
  if (cached) {
    cached.exports = callable
  }
}

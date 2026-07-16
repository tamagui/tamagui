import { CompilerFrontend, loadTamaguiSync, type CompilerProject } from '@tamagui/static'
import type { TamaguiOptions } from '@tamagui/types'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, isAbsolute, resolve } from 'node:path'

interface ExtractOptions {
  sourcePath?: string
  options?: TamaguiOptions
}

const require = createRequire(import.meta.url)
const root = process.cwd()
const frontends = new Map<string, CompilerFrontend>()
const projects = new Map<string, CompilerProject>()

function resolveFile(specifier: string, importer: string): string | null {
  if (specifier.startsWith('.') || isAbsolute(specifier)) {
    const base = isAbsolute(specifier) ? specifier : resolve(dirname(importer), specifier)
    for (const candidate of [
      base,
      `${base}.ts`,
      `${base}.tsx`,
      `${base}.js`,
      `${base}.jsx`,
      `${base}.mjs`,
      `${base}.cjs`,
      resolve(base, 'index.ts'),
      resolve(base, 'index.tsx'),
      resolve(base, 'index.js'),
    ]) {
      if (existsSync(candidate)) return candidate
    }
    return null
  }
  try {
    return require.resolve(specifier, { paths: [dirname(importer), root] })
  } catch {
    return null
  }
}

function projectFor(target: 'web' | 'native', options: TamaguiOptions): CompilerProject {
  const components = options.components ?? [
    'tamagui',
    '@tamagui/core',
    '@tamagui/test-design-system',
  ]
  const config = options.config ?? './tests/lib/tamagui.config.cjs'
  const key = JSON.stringify({ target, config, components })
  const cached = projects.get(key)
  if (cached) return cached
  const projectInfo = loadTamaguiSync({
    ...options,
    platform: target,
    config,
    components,
  })
  const componentModules = [...new Set(['@tamagui/core', ...components])].map(
    (moduleName) => {
      const id = resolveFile(moduleName, resolve(root, '__compiler-entry__.tsx'))
      if (!id) throw new Error(`Unable to resolve compiler component ${moduleName}`)
      return { moduleName, id }
    }
  )
  const project = { projectInfo, componentModules, generation: key }
  projects.set(key, project)
  return project
}

async function compile(
  source: string,
  target: 'web' | 'native',
  opts: ExtractOptions = {}
) {
  const options = opts.options ?? {}
  const sourcePath = opts.sourcePath ?? resolve(root, 'tests/__compiler-test__.tsx')
  const project = projectFor(target, options)
  let frontend = frontends.get(project.generation)
  if (!frontend) {
    frontend = new CompilerFrontend()
    frontends.set(project.generation, frontend)
  }
  return frontend.compile({
    id: sourcePath,
    source,
    root,
    target,
    project,
    resolve: async (specifier, importer) => {
      const id = resolveFile(specifier, importer)
      return id ? { id, external: id.includes('/node_modules/') } : null
    },
    load: async (id) => {
      try {
        return await readFile(id.split(/[?#]/, 1)[0]!, 'utf8')
      } catch {
        return null
      }
    },
  })
}

function normalizeSnapshotCode(code: string) {
  return code.replace(/[ \t]+$/gm, '')
}

export async function extractForNative(source: string) {
  const result = await compile(source, 'native')
  return { code: normalizeSnapshotCode(result.output.code), map: result.output.map }
}

export async function extractForWeb(source: string, opts: ExtractOptions = {}) {
  const result = await compile(source, 'web', opts)
  return {
    js: normalizeSnapshotCode(result.output.code),
    styles: result.plan.css,
    map: result.output.map,
    stats: result.plan.stats,
  }
}

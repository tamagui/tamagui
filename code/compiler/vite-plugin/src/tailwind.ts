import { compile } from '@tailwindcss/node'
import { Scanner } from '@tailwindcss/oxide'
import {
  classifyCandidate,
  createGrammarConfigView,
  type GrammarSourceConfig,
} from '@tamagui/style-grammar'
import { readFile, realpath } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

export const TAILWIND_VERSION = '4.3.0'
export const TAILWIND_VIRTUAL_ID = 'virtual:tamagui-tailwind.css'
export const TAILWIND_RESOLVED_ID = `\0${TAILWIND_VIRTUAL_ID}`

export function wrapWithTamaguiLayer(css: string): string {
  return `@layer tamagui {\n${css}\n}`
}

export function isTamaguiCoreResetCSS(id: string): boolean {
  const normalizedId = id.split('?', 1)[0].replace(/\\/g, '/')
  return (
    normalizedId.endsWith('/@tamagui/core/reset.css') ||
    normalizedId.endsWith('/code/core/core/reset.css')
  )
}

export function layerTamaguiCoreResetCSS(
  id: string,
  css: string,
  hybridEnabled: boolean
): string | null {
  if (!hybridEnabled || !isTamaguiCoreResetCSS(id)) return null
  return wrapWithTamaguiLayer(css)
}

const TAILWIND_INPUT = `@layer tamagui, theme, utilities;
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/utilities.css" layer(utilities);`

type TailwindCompiler = Awaited<ReturnType<typeof compile>>

type HybridConfig = GrammarSourceConfig & {
  settings?: {
    styleMode?: string
  }
}

export type TailwindHybridState = ReturnType<typeof createTailwindHybridState>

export type TailwindWatchEvent = 'create' | 'update' | 'delete'

function extensionForFile(id: string): string {
  return path.extname(id.split('?', 1)[0]).slice(1) || 'html'
}

async function assertHostTailwind(root: string): Promise<void> {
  const requireFromRoot = createRequire(path.join(root, 'package.json'))
  let packagePath: string
  try {
    packagePath = requireFromRoot.resolve('tailwindcss/package.json')
  } catch {
    throw new Error(
      `[tamagui] Hybrid Tailwind mode requires tailwindcss@${TAILWIND_VERSION} in the app. Install it with \`bun add -D tailwindcss@${TAILWIND_VERSION}\` (resolved from ${root}).`
    )
  }

  const packageJSON = JSON.parse(await readFile(packagePath, 'utf8')) as {
    version?: string
  }
  if (packageJSON.version !== TAILWIND_VERSION) {
    throw new Error(
      `[tamagui] Hybrid Tailwind mode requires tailwindcss@${TAILWIND_VERSION}, but ${packageJSON.version || 'an unknown version'} was resolved from ${packagePath}. Align the app dependency before starting Vite.`
    )
  }
}

export function createTailwindHybridState() {
  let root = ''
  let generation = -1
  let enabled = false
  let layerTamagui = false
  let scanner: Scanner | null = null
  let compiler: TailwindCompiler | null = null
  let grammarConfig = createGrammarConfigView({})
  let candidatesByFile = new Map<string, Set<string>>()
  let compiledCandidates = new Set<string>()
  let addDependency: (file: string) => void = () => {}
  let css = ''

  function clear() {
    root = ''
    generation = -1
    enabled = false
    layerTamagui = false
    scanner = null
    compiler = null
    grammarConfig = createGrammarConfigView({})
    candidatesByFile = new Map()
    compiledCandidates = new Set()
    addDependency = () => {}
    css = ''
  }

  async function configure(
    nextRoot: string,
    nextGeneration: number,
    config: HybridConfig | null | undefined,
    onDependency: (file: string) => void,
    onSourceGlob: (glob: string) => void = () => {}
  ): Promise<boolean> {
    const nextEnabled =
      config?.settings?.styleMode === 'tailwind' ||
      config?.settings?.styleMode === 'tamagui-and-tailwind'
    if (!nextEnabled) {
      clear()
      generation = nextGeneration
      return false
    }
    if (
      compiler &&
      scanner &&
      enabled &&
      generation === nextGeneration &&
      root === nextRoot
    ) {
      return true
    }

    await assertHostTailwind(nextRoot)
    root = nextRoot
    generation = nextGeneration
    enabled = true
    layerTamagui = nextEnabled
    grammarConfig = createGrammarConfigView(config)
    addDependency = onDependency
    scanner = new Scanner({
      sources: [
        { base: root, pattern: '**/*', negated: false },
        { base: root, pattern: 'node_modules/**', negated: true },
        { base: root, pattern: '.git/**', negated: true },
        { base: root, pattern: '.vite/**', negated: true },
        { base: root, pattern: 'dist/**', negated: true },
        { base: root, pattern: 'build/**', negated: true },
        { base: root, pattern: 'coverage/**', negated: true },
      ],
    })
    compiler = await createCompiler()
    scanner.scan()
    registerScannerSources(scanner, onDependency, onSourceGlob)
    candidatesByFile = new Map()
    await Promise.all(
      scanner.files.map(async (file) => {
        try {
          const source = await readFile(file, 'utf8')
          candidatesByFile.set(
            await normalizeSourcePath(file),
            candidatesForSource(scanner!, file, source)
          )
        } catch {
          // A source may disappear between oxide's inventory and this read.
        }
      })
    )
    await rebuild()
    return true
  }

  async function createCompiler() {
    return compile(TAILWIND_INPUT, {
      base: root,
      onDependency: addDependency,
    })
  }

  async function rebuild(): Promise<boolean> {
    if (!compiler) return false
    const allCandidates = new Set<string>()
    for (const candidates of candidatesByFile.values()) {
      for (const candidate of candidates) allCandidates.add(candidate)
    }
    const passthrough = [...allCandidates]
      .filter(
        (candidate) => classifyCandidate(candidate, grammarConfig).kind === 'passthrough'
      )
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
    const nextCandidates = new Set(passthrough)
    const removedCandidate = [...compiledCandidates].some(
      (candidate) => !nextCandidates.has(candidate)
    )
    if (removedCandidate) {
      compiler = await createCompiler()
    }
    const nextCSS = compiler.build(passthrough)
    compiledCandidates = nextCandidates
    if (nextCSS === css) return false
    css = nextCSS
    return true
  }

  async function scanSource(id: string, source: string): Promise<boolean> {
    if (!enabled || !scanner) return false
    candidatesByFile.set(
      await normalizeSourcePath(id),
      candidatesForSource(scanner, id, source)
    )
    return rebuild()
  }

  async function removeSource(id: string): Promise<boolean> {
    if (!candidatesByFile.delete(await normalizeSourcePath(id))) return false
    return rebuild()
  }

  return {
    clear,
    configure,
    removeSource,
    scanSource,
    get enabled() {
      return enabled
    },
    get layerTamagui() {
      return layerTamagui
    },
    get css() {
      return css
    },
    get candidateCount() {
      return compiledCandidates.size
    },
  }
}

export async function updateTailwindForWatchChange(
  state: TailwindHybridState,
  id: string,
  event: TailwindWatchEvent,
  configure: () => Promise<boolean>
): Promise<boolean> {
  if (!(await configure())) return false
  if (event === 'delete') {
    return state.removeSource(id)
  }
  try {
    return state.scanSource(id, await readFile(id, 'utf8'))
  } catch {
    return state.removeSource(id)
  }
}

function registerScannerSources(
  scanner: Scanner,
  onDependency: (file: string) => void,
  onSourceGlob: (glob: string) => void
) {
  for (const file of scanner.files) {
    onDependency(file)
  }
  for (const { base, pattern } of scanner.globs) {
    onSourceGlob(path.join(base, pattern))
  }
}

async function normalizeSourcePath(id: string): Promise<string> {
  const cleanId = path.resolve(id.split('?', 1)[0])
  try {
    return await realpath(cleanId)
  } catch {
    try {
      return path.join(await realpath(path.dirname(cleanId)), path.basename(cleanId))
    } catch {
      return cleanId
    }
  }
}

function candidatesForSource(scanner: Scanner, id: string, source: string): Set<string> {
  return new Set(
    scanner
      .getCandidatesWithPositions({
        content: source,
        extension: extensionForFile(id),
      })
      .map(({ candidate }) => candidate)
  )
}

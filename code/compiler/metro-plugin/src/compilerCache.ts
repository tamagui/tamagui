import { createHash, randomBytes } from 'node:crypto'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { LoweredModulePlan } from '@tamagui/compiler-core'

import { metroDiagnostic, type MetroCompilerDiagnostic } from './diagnostics'

export const METRO_COMPILER_CACHE_VERSION = 2

export interface MetroCompilerCacheEntry {
  schemaVersion: typeof METRO_COMPILER_CACHE_VERSION
  moduleId: string
  compiledHash: string
  plan: LoweredModulePlan
  diagnostics: MetroCompilerDiagnostic[]
}

interface MetroCompilerCacheDescriptor {
  blobHash: string
  compiledHash: string
}

interface MetroCompilerCacheManifest {
  schemaVersion: typeof METRO_COMPILER_CACHE_VERSION
  generation: string
  optionsHash: string
  platform: string | null
  entries: Record<string, MetroCompilerCacheDescriptor>
}

export interface MetroCompilerCacheValidation {
  valid: boolean
  diagnostics: MetroCompilerDiagnostic[]
  generation: string | null
  moduleIds: string[]
  optionsHash: string | null
}

export class MetroCompilerCacheError extends Error {
  constructor(readonly diagnostic: MetroCompilerDiagnostic) {
    super(diagnostic.message)
    this.name = 'MetroCompilerCacheError'
  }
}

function compareCodeUnits(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0
}

function stableEntries<T>(record: Record<string, T>): [string, T][] {
  return Object.entries(record).sort(([left], [right]) => compareCodeUnits(left, right))
}

function stableStringify(value: unknown): string | undefined {
  if (Array.isArray(value)) {
    return `[${value.map((child) => stableStringify(child) ?? 'null').join(',')}]`
  }
  if (value && typeof value === 'object') {
    const entries = stableEntries(value as Record<string, unknown>)
      .map(([key, child]) => [key, stableStringify(child)] as const)
      .filter((entry): entry is readonly [string, string] => entry[1] !== undefined)
    return `{${entries
      .map(([key, child]) => `${JSON.stringify(key)}:${child}`)
      .join(',')}}`
  }
  return JSON.stringify(value)
}

function requiredStableStringify(value: unknown): string {
  const serialized = stableStringify(value)
  if (serialized === undefined) throw new Error('Cannot serialize undefined cache root')
  return serialized
}

export function metroCompilerContentHash(value: string | Uint8Array): string {
  return createHash('sha256').update(value).digest('hex')
}

function cacheCorrupt(message: string, moduleId?: string): MetroCompilerCacheError {
  return new MetroCompilerCacheError(
    metroDiagnostic('metro/cache-corrupt', message, { moduleId })
  )
}

function parseJson<T>(source: string, description: string, moduleId?: string): T {
  try {
    return JSON.parse(source) as T
  } catch (error) {
    throw cacheCorrupt(
      `${description} is not valid JSON: ${error instanceof Error ? error.message : String(error)}`,
      moduleId
    )
  }
}

export function defaultMetroCompilerCacheRoot(projectRoot: string): string {
  return join(projectRoot, 'node_modules', '.cache', 'tamagui', 'metro-compiler')
}

/**
 * Filesystem handoff shared by the Metro main process and isolated transform workers.
 * Immutable blobs are content addressed; a single manifest rename publishes a generation.
 */
export class MetroCompilerCache {
  readonly #blobsDirectory: string
  readonly #manifestPath: string

  constructor(readonly root: string) {
    this.#blobsDirectory = join(root, `v${METRO_COMPILER_CACHE_VERSION}`, 'blobs')
    this.#manifestPath = join(root, `v${METRO_COMPILER_CACHE_VERSION}`, 'manifest.json')
  }

  async publish(
    platform: string | null,
    entries: readonly MetroCompilerCacheEntry[],
    optionsHash: string
  ): Promise<string> {
    await mkdir(this.#blobsDirectory, { recursive: true })
    const descriptors: Record<string, MetroCompilerCacheDescriptor> = {}

    for (const entry of [...entries].sort((left, right) =>
      compareCodeUnits(left.moduleId, right.moduleId)
    )) {
      if (entry.schemaVersion !== METRO_COMPILER_CACHE_VERSION) {
        throw new Error(`Cannot publish cache schema ${entry.schemaVersion}`)
      }
      const serialized = `${requiredStableStringify(entry)}\n`
      const blobHash = metroCompilerContentHash(serialized)
      const blobPath = join(this.#blobsDirectory, `${blobHash}.json`)
      try {
        await writeFile(blobPath, serialized, { encoding: 'utf8', flag: 'wx' })
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
        const existing = await readFile(blobPath, 'utf8')
        if (metroCompilerContentHash(existing) !== blobHash) {
          const temporaryBlobPath = `${blobPath}.${process.pid}-${randomBytes(6).toString('hex')}.tmp`
          await writeFile(temporaryBlobPath, serialized, 'utf8')
          await rename(temporaryBlobPath, blobPath)
        }
      }
      descriptors[entry.moduleId] = {
        blobHash,
        compiledHash: entry.compiledHash,
      }
    }

    const generation = metroCompilerContentHash(requiredStableStringify(descriptors))
    const manifest: MetroCompilerCacheManifest = {
      schemaVersion: METRO_COMPILER_CACHE_VERSION,
      generation,
      optionsHash,
      platform,
      entries: descriptors,
    }
    const manifestDirectory = join(this.root, `v${METRO_COMPILER_CACHE_VERSION}`)
    const temporaryPath = join(
      manifestDirectory,
      `.manifest-${process.pid}-${randomBytes(6).toString('hex')}.json`
    )
    await writeFile(temporaryPath, `${requiredStableStringify(manifest)}\n`, 'utf8')
    await rename(temporaryPath, this.#manifestPath)
    return generation
  }

  async read(
    moduleId: string,
    compiledSource: string
  ): Promise<MetroCompilerCacheEntry | null> {
    const manifest = await this.#readManifest()
    if (!manifest) return null
    const descriptor = manifest.entries[moduleId]
    if (!descriptor) return null
    const compiledHash = metroCompilerContentHash(compiledSource)
    if (compiledHash !== descriptor.compiledHash) return null
    return await this.#readBlob(moduleId, descriptor)
  }

  async validate(): Promise<MetroCompilerCacheValidation> {
    const diagnostics: MetroCompilerDiagnostic[] = []
    try {
      const manifest = await this.#readManifest()
      if (!manifest) {
        return {
          valid: false,
          diagnostics,
          generation: null,
          moduleIds: [],
          optionsHash: null,
        }
      }
      for (const [moduleId, descriptor] of stableEntries(manifest.entries)) {
        await this.#readBlob(moduleId, descriptor)
      }
      return {
        valid: true,
        diagnostics,
        generation: manifest.generation,
        moduleIds: Object.keys(manifest.entries).sort(compareCodeUnits),
        optionsHash: manifest.optionsHash,
      }
    } catch (error) {
      if (error instanceof MetroCompilerCacheError) {
        diagnostics.push(error.diagnostic)
        return {
          valid: false,
          diagnostics,
          generation: null,
          moduleIds: [],
          optionsHash: null,
        }
      }
      throw error
    }
  }

  async discardManifest(): Promise<void> {
    await rm(this.#manifestPath, { force: true })
  }

  async #readManifest(): Promise<MetroCompilerCacheManifest | null> {
    let source: string
    try {
      source = await readFile(this.#manifestPath, 'utf8')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw error
    }
    const manifest = parseJson<MetroCompilerCacheManifest>(source, 'Cache manifest')
    if (
      manifest.schemaVersion !== METRO_COMPILER_CACHE_VERSION ||
      typeof manifest.generation !== 'string' ||
      typeof manifest.optionsHash !== 'string' ||
      !manifest.entries ||
      typeof manifest.entries !== 'object'
    ) {
      throw cacheCorrupt('Cache manifest has an unsupported schema')
    }
    return manifest
  }

  async #readBlob(
    moduleId: string,
    descriptor: MetroCompilerCacheDescriptor
  ): Promise<MetroCompilerCacheEntry> {
    const blobPath = join(this.#blobsDirectory, `${descriptor.blobHash}.json`)
    let source: string
    try {
      source = await readFile(blobPath, 'utf8')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw cacheCorrupt(`Cache blob ${descriptor.blobHash} is missing`, moduleId)
      }
      throw error
    }
    if (metroCompilerContentHash(source) !== descriptor.blobHash) {
      throw cacheCorrupt(`Cache blob ${descriptor.blobHash} failed its hash`, moduleId)
    }
    const entry = parseJson<MetroCompilerCacheEntry>(
      source,
      `Cache blob ${descriptor.blobHash}`,
      moduleId
    )
    if (
      entry.schemaVersion !== METRO_COMPILER_CACHE_VERSION ||
      entry.moduleId !== moduleId ||
      entry.compiledHash !== descriptor.compiledHash ||
      !entry.plan ||
      entry.plan.version !== 1 ||
      entry.plan.id !== moduleId ||
      entry.plan.sourceHash !== entry.compiledHash ||
      !Array.isArray(entry.plan.edits) ||
      !Array.isArray(entry.plan.diagnostics) ||
      !Array.isArray(entry.diagnostics)
    ) {
      throw cacheCorrupt(
        `Cache blob ${descriptor.blobHash} has invalid contents`,
        moduleId
      )
    }
    return entry
  }
}

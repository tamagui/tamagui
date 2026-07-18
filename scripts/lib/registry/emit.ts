import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import {
  outDir,
  repoRoot,
  registryName,
  registryHomepage,
  driftConsumers,
  type DriftConsumer,
} from './config'
import { discoverSkins, loadSkin, buildItem, renderConsumerCopy, type Skin } from './core'
import { validateRegistry } from './validate'
import type { StateTables } from './states-derive'
import type { Registry, RegistryItem } from './types'
import { stateToPseudoProp, stateNames, stateToSelector } from '@tamagui/style-grammar'

const JSON_INDENT = 2

// the real A1 vocabulary tables from @tamagui/style-grammar (states.ts). wired
// at reassembly: buildRegistry now defaults to these so build/check/drift/
// consumers all emit a uniform `meta.states` derived from the skin source.
const a1StateTables: StateTables = {
  pseudoProps: stateToPseudoProp,
  allStates: stateNames,
  selectors: stateToSelector,
}

// `stateTables` (A1 vocabulary) is threaded to buildItem so items carry a
// uniform `meta.states`; defaults to the real style-grammar tables.
export async function buildRegistry(
  stateTables: StateTables = a1StateTables
): Promise<{ registry: Registry; skins: Skin[] }> {
  const bases = discoverSkins()
  if (!bases.length) throw new Error(`no skins found in skin source root`)
  const skinBases = new Set(bases)
  const skins: Skin[] = []
  const items: RegistryItem[] = []
  for (const base of bases) {
    const skin = await loadSkin(base)
    skins.push(skin)
    items.push(buildItem(skin, skinBases, stateTables))
  }
  const registry: Registry = {
    $schema: 'https://ui.shadcn.com/schema/registry.json',
    name: registryName,
    homepage: registryHomepage,
    items,
  }
  const errs = validateRegistry(registry)
  if (errs.length) {
    throw new Error(`generated registry is not shadcn-valid:\n  ${errs.join('\n  ')}`)
  }
  return { registry, skins }
}

function itemJson(item: RegistryItem): string {
  return JSON.stringify(item, null, JSON_INDENT) + '\n'
}

// the registry index lists items WITHOUT the (large) files payload — each item's
// full payload lives in r/<name>.json, matching how shadcn serves registries.
function indexJson(registry: Registry): string {
  const slim: Registry = {
    ...registry,
    items: registry.items.map(({ files, ...rest }) => rest),
  }
  return JSON.stringify(slim, null, JSON_INDENT) + '\n'
}

// write registry.json + r/<name>.json into `dir`.
export function writeRegistryTo(dir: string, registry: Registry): void {
  const rDir = join(dir, 'r')
  // regenerate cleanly so deleted skins don't leave stale item json behind
  if (existsSync(rDir)) rmSync(rDir, { recursive: true })
  mkdirSync(rDir, { recursive: true })
  writeFileSync(join(dir, 'registry.json'), indexJson(registry))
  for (const item of registry.items) {
    writeFileSync(join(rDir, `${item.name}.json`), itemJson(item))
  }
}

export async function writeRegistry(): Promise<Registry> {
  const { registry } = await buildRegistry()
  mkdirSync(outDir, { recursive: true })
  writeRegistryTo(outDir, registry)
  return registry
}

export type DriftEntry = {
  consumer: string
  skin: string
  path: string // repo-relative
  status: 'ok' | 'drift' | 'missing'
}

// compare every consumer's checked-in copy against what the skin source would generate.
// read-only: never mutates consumer files.
export async function checkDrift(): Promise<DriftEntry[]> {
  const { skins } = await buildRegistry()
  const entries: DriftEntry[] = []
  for (const consumer of driftConsumers) {
    for (const skin of skins) {
      const abs = join(repoRoot, consumer.dir, consumer.filename(skin.base))
      const rel = relative(repoRoot, abs)
      if (!existsSync(abs)) {
        entries.push({
          consumer: consumer.key,
          skin: skin.base,
          path: rel,
          status: 'missing',
        })
        continue
      }
      const expected = renderConsumerCopy(skin, consumer.namePrefix)
      const actual = readFileSync(abs, 'utf8')
      entries.push({
        consumer: consumer.key,
        skin: skin.base,
        path: rel,
        status: actual === expected ? 'ok' : 'drift',
      })
    }
  }
  return entries
}

// unified-ish first-divergence diff for reporting (kept tiny; the CI log just
// needs to point a human at the drifted file + first differing line).
export function firstDivergence(expected: string, actual: string): string {
  const e = expected.split('\n')
  const a = actual.split('\n')
  const n = Math.max(e.length, a.length)
  for (let i = 0; i < n; i++) {
    if (e[i] !== a[i]) {
      return [
        `  first diff at line ${i + 1}:`,
        `    source:   ${e[i] ?? '<none>'}`,
        `    consumer: ${a[i] ?? '<none>'}`,
      ].join('\n')
    }
  }
  return ''
}

// write generated copies into a consumer's REAL files. only runs for consumers
// flagged writeAuthorized (held until the skin source lands + campaign sign-off).
export async function writeConsumers(): Promise<string[]> {
  const { skins } = await buildRegistry()
  const written: string[] = []
  for (const consumer of driftConsumers.filter((c) => c.writeAuthorized)) {
    mkdirSync(join(repoRoot, consumer.dir), { recursive: true })
    for (const skin of skins) {
      const abs = join(repoRoot, consumer.dir, consumer.filename(skin.base))
      writeFileSync(abs, renderConsumerCopy(skin, consumer.namePrefix))
      written.push(relative(repoRoot, abs))
    }
  }
  return written
}

// render consumer copies into a sandbox dir instead of real files — used to
// validate the write path end to end without clobbering live consumer code.
export async function writeConsumersToSandbox(sandboxDir: string): Promise<string[]> {
  const { skins } = await buildRegistry()
  const written: string[] = []
  for (const consumer of driftConsumers) {
    const dir = join(sandboxDir, consumer.key)
    mkdirSync(dir, { recursive: true })
    for (const skin of skins) {
      const abs = join(dir, consumer.filename(skin.base))
      writeFileSync(abs, renderConsumerCopy(skin, consumer.namePrefix))
      written.push(abs)
    }
  }
  return written
}

export function loadExpectedConsumer(consumer: DriftConsumer, skin: Skin): string {
  return renderConsumerCopy(skin, consumer.namePrefix)
}

export { driftConsumers }

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import {
  skinSourceRoot,
  installTargetDir,
  registryBaseUrl,
  canonicalNamePrefix,
} from './config'
import { classifyDependencies } from './deps'
import type { SkinManifest, RegistryItem, RegistryFile } from './types'

export type Skin = {
  base: string // 'Button'
  name: string // 'button' (registry item name)
  file: string // absolute path to the .tsx skin
  source: string // raw skin source
  manifest: SkinManifest
}

// discover every skin: a `<Component>.tsx` in skinSourceRoot, paired with a
// co-located `<Component>.manifest.ts`. excludes the barrel (`index.tsx`), any
// manifest file (`*.manifest.*`), and the shared type file (`registry-manifest.ts`).
export function discoverSkins(): string[] {
  return readdirSync(skinSourceRoot)
    .filter(
      (f) =>
        f.endsWith('.tsx') &&
        f !== 'index.tsx' &&
        !f.includes('.manifest.') &&
        !f.startsWith('registry-manifest.')
    )
    .map((f) => basename(f, '.tsx'))
    .sort()
}

export async function loadManifest(base: string): Promise<SkinManifest> {
  const path = join(skinSourceRoot, `${base}.manifest.ts`)
  if (!existsSync(path)) {
    throw new Error(
      `missing manifest for skin "${base}": expected ${base}.manifest.ts next to the skin`
    )
  }
  const mod = await import(path)
  const manifest: SkinManifest = mod.manifest ?? mod.default
  if (!manifest || typeof manifest.description !== 'string') {
    throw new Error(
      `manifest for "${base}" must export \`manifest\` (or default) with a string \`description\``
    )
  }
  return manifest
}

export async function loadSkin(base: string): Promise<Skin> {
  const file = join(skinSourceRoot, `${base}.tsx`)
  const source = readFileSync(file, 'utf8')
  const manifest = await loadManifest(base)
  return { base, name: base.toLowerCase(), file, source, manifest }
}

// rewrite styled() `name:` identity strings from one prefix to another. this is
// the ONLY transform applied to skin source — it is what legitimately varies
// between the canonical skin, the shipped registry copy, and each downstream
// consumer copy. everything else is byte-identical.
export function reprefixNames(source: string, from: string, to: string): string {
  if (from === to) return source
  if (from) {
    // replace `name: 'From<X>'` -> `name: 'To<X>'`
    const re = new RegExp(`(name:\\s*['"])${from}([A-Za-z0-9_]*)(['"])`, 'g')
    return source.replace(re, (_all, pre, rest, post) => `${pre}${to}${rest}${post}`)
  }
  // from === '' : prepend `to` to component-identity names (start uppercase)
  const re = /(name:\s*['"])([A-Z][A-Za-z0-9_]*)(['"])/g
  return source.replace(re, (_all, pre, ident, post) => `${pre}${to}${ident}${post}`)
}

// the shipped registry copy uses neutral (unprefixed) identity names.
export function renderRegistryCopy(skin: Skin): string {
  return reprefixNames(skin.source, canonicalNamePrefix, '')
}

// a downstream consumer copy uses that consumer's own name prefix.
export function renderConsumerCopy(skin: Skin, consumerPrefix: string): string {
  return reprefixNames(skin.source, canonicalNamePrefix, consumerPrefix)
}

// map a relative import in a skin to a sibling skin base, if it is one.
function siblingSkinBase(spec: string, skinBases: Set<string>): string | null {
  const b = basename(spec).replace(/\.(tsx?|jsx?)$/, '')
  return skinBases.has(b) ? b : null
}

export function buildItem(skin: Skin, skinBases: Set<string>): RegistryItem {
  const { dependencies, relatives } = classifyDependencies(skin.source)
  const type = skin.manifest.type ?? 'registry:ui'
  const target = `${installTargetDir}/${skin.base}.tsx`

  // cross-skin relative imports become registryDependencies; any other relative
  // import is a hard error here (it would need bundling — add support when a
  // real skin needs it rather than silently dropping a file).
  const registryDeps = new Set<string>(skin.manifest.extraRegistryDependencies ?? [])
  for (const rel of relatives) {
    const sib = siblingSkinBase(rel, skinBases)
    if (!sib) {
      throw new Error(
        `skin "${skin.base}" imports non-skin relative "${rel}"; bundling of extra local files is not supported yet`
      )
    }
    const depName = sib.toLowerCase()
    registryDeps.add(registryBaseUrl ? `${registryBaseUrl}/r/${depName}.json` : depName)
  }

  const deps = new Set<string>([...dependencies, ...(skin.manifest.extraDependencies ?? [])])

  const files: RegistryFile[] = [
    {
      path: target,
      content: renderRegistryCopy(skin),
      type: type as RegistryFile['type'],
      target,
    },
  ]

  // non-derivable skin metadata rides along in `meta` (schema allows arbitrary
  // keys) so registry consumers and docs can surface native/token/theme needs.
  const meta: Record<string, unknown> = {}
  if (skin.manifest.native) meta.native = skin.manifest.native
  if (skin.manifest.peerDependencies) meta.peerDependencies = skin.manifest.peerDependencies
  if (skin.manifest.tokens) meta.tokens = skin.manifest.tokens
  if (skin.manifest.themes) meta.themes = skin.manifest.themes

  const item: RegistryItem = {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: skin.name,
    type,
    title: skin.manifest.title ?? skin.base,
    description: skin.manifest.description,
    files,
  }
  if (deps.size) item.dependencies = [...deps].sort()
  if (registryDeps.size) item.registryDependencies = [...registryDeps].sort()
  if (skin.manifest.categories?.length) item.categories = skin.manifest.categories
  if (Object.keys(meta).length) item.meta = meta

  return item
}

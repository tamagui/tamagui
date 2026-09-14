import type { Registry, RegistryItem } from './types'

// targeted validation against registry/schema/registry-item.schema.json.
// we assert the constraints that actually matter for installability rather than
// pulling in a full draft-07 validator: required fields, the type enum, the
// files array shape, and the "target required for registry:file/page" rule.

const ITEM_TYPES = new Set([
  'registry:lib',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:theme',
  'registry:page',
  'registry:file',
  'registry:style',
  'registry:base',
  'registry:font',
  'registry:item',
])

const FILE_TYPES = new Set([
  'registry:lib',
  'registry:block',
  'registry:component',
  'registry:ui',
  'registry:hook',
  'registry:theme',
  'registry:page',
  'registry:file',
  'registry:style',
  'registry:base',
  'registry:item',
])

const TARGET_REQUIRED = new Set(['registry:file', 'registry:page'])

export function validateItem(item: RegistryItem, where: string): string[] {
  const errs: string[] = []
  const at = (msg: string) => errs.push(`${where}: ${msg}`)

  if (!item.name || typeof item.name !== 'string') at('missing string `name`')
  if (!item.type) at('missing `type`')
  else if (!ITEM_TYPES.has(item.type)) at(`invalid type "${item.type}"`)

  const arrays = [
    'dependencies',
    'devDependencies',
    'registryDependencies',
    'categories',
  ] as const
  for (const key of arrays) {
    const v = item[key]
    if (v != null && (!Array.isArray(v) || v.some((x) => typeof x !== 'string')))
      at(`\`${key}\` must be an array of strings`)
  }

  if (item.files != null) {
    if (!Array.isArray(item.files)) at('`files` must be an array')
    else
      item.files.forEach((f, i) => {
        const fat = (msg: string) => at(`files[${i}] ${msg}`)
        if (typeof f.path !== 'string' || !f.path) fat('missing string `path`')
        if (typeof f.content !== 'string') fat('missing string `content`')
        if (!f.type || !FILE_TYPES.has(f.type)) fat(`invalid file type "${f.type}"`)
        if (f.type && TARGET_REQUIRED.has(f.type) && !f.target)
          fat(`type "${f.type}" requires a \`target\``)
      })
  }

  return errs
}

export function validateRegistry(registry: Registry): string[] {
  const errs: string[] = []
  if (!registry.name) errs.push('registry: missing `name`')
  if (!registry.homepage) errs.push('registry: missing `homepage`')
  if (!Array.isArray(registry.items)) {
    errs.push('registry: `items` must be an array')
    return errs
  }
  const seen = new Set<string>()
  for (const item of registry.items) {
    if (seen.has(item.name)) errs.push(`registry: duplicate item name "${item.name}"`)
    seen.add(item.name)
    errs.push(...validateItem(item, `item "${item.name}"`))
  }
  return errs
}

import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import type { RegistryItem } from './types'

// minimal shadcn-compatible installer. consumes registry-item JSON exactly per
// the shadcn schema (resolve registryDependencies, collect npm dependencies,
// write each file to its target) without the tailwind/components.json coupling
// of the real shadcn CLI — so a blank web OR expo app can install a tamagui item
// deterministically in CI.

export type InstallResult = {
  items: string[] // item names installed, in dependency order
  files: string[] // absolute paths written
  dependencies: string[] // union of npm deps across installed items
  devDependencies: string[]
}

// shadcn target placeholders → app-relative dirs. plain targets pass through.
function resolveTarget(target: string): string {
  return target
    .replace(/^@components\//, 'components/')
    .replace(/^@ui\//, 'components/ui/')
    .replace(/^@lib\//, 'lib/')
    .replace(/^@hooks\//, 'hooks/')
}

function loadItem(registryDir: string, name: string): RegistryItem {
  const path = join(registryDir, 'r', `${name}.json`)
  if (!existsSync(path)) {
    throw new Error(`registry item "${name}" not found at ${path}`)
  }
  return JSON.parse(readFileSync(path, 'utf8'))
}

// resolve an item + all its registryDependencies (local names only) into a
// dependency-ordered, deduped list.
function resolveItems(
  registryDir: string,
  name: string,
  seen: Set<string>,
  out: RegistryItem[]
) {
  if (seen.has(name)) return
  seen.add(name)
  const item = loadItem(registryDir, name)
  for (const dep of item.registryDependencies ?? []) {
    if (/^https?:\/\//.test(dep)) {
      throw new Error(
        `item "${name}" depends on remote registry item "${dep}"; the CI installer resolves local names only`
      )
    }
    resolveItems(registryDir, dep, seen, out)
  }
  out.push(item)
}

export function installItem(opts: {
  registryDir: string
  name: string
  appDir: string
}): InstallResult {
  const { registryDir, name, appDir } = opts
  const items: RegistryItem[] = []
  resolveItems(registryDir, name, new Set(), items)

  const files: string[] = []
  const deps = new Set<string>()
  const devDeps = new Set<string>()
  for (const item of items) {
    for (const d of item.dependencies ?? []) deps.add(d)
    for (const d of item.devDependencies ?? []) devDeps.add(d)
    for (const f of item.files ?? []) {
      const target = resolveTarget(f.target ?? f.path)
      const abs = join(appDir, target)
      mkdirSync(dirname(abs), { recursive: true })
      writeFileSync(abs, f.content)
      files.push(abs)
    }
  }

  return {
    items: items.map((i) => i.name),
    files,
    dependencies: [...deps].sort(),
    devDependencies: [...devDeps].sort(),
  }
}

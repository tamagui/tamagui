import { providedPeers } from './config'

// extract every module specifier imported/exported by a source file.
// handles multi-line imports, `import x from '...'`, `import '...'`,
// `export ... from '...'`, and dynamic `import('...')`. we only need the
// specifier string, so a specifier-anchored scan is robust across line breaks.
export function extractImportSpecifiers(source: string): string[] {
  const specs = new Set<string>()
  const fromRe = /\bfrom\s*['"]([^'"]+)['"]/g
  const bareRe = /\bimport\s*['"]([^'"]+)['"]/g
  const dynRe = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g
  for (const re of [fromRe, bareRe, dynRe]) {
    let m: RegExpExecArray | null
    while ((m = re.exec(source))) specs.add(m[1])
  }
  return [...specs]
}

// npm package name for a bare/scoped specifier:
//   'tamagui'                 -> 'tamagui'
//   '@tamagui/ui'             -> '@tamagui/ui'
//   '@tamagui/ui/reset.css'   -> '@tamagui/ui'
//   'react-native/Libraries'  -> 'react-native'
export function packageNameOf(spec: string): string {
  if (spec.startsWith('@')) {
    const [scope, name] = spec.split('/')
    return name ? `${scope}/${name}` : scope
  }
  return spec.split('/')[0]
}

export function isRelative(spec: string): boolean {
  return spec.startsWith('.') || spec.startsWith('/')
}

export type ClassifiedDeps = {
  // external npm packages this skin needs installed (sorted, deduped)
  dependencies: string[]
  // relative specifiers (resolved elsewhere: sibling skins -> registry deps,
  // other local files -> bundled into the item)
  relatives: string[]
}

// classify a skin's imports into npm dependencies vs relative imports.
// `react`/`react-native` and friends are peer responsibilities of the app and
// are excluded from per-item dependencies.
export function classifyDependencies(source: string): ClassifiedDeps {
  const specs = extractImportSpecifiers(source)
  const deps = new Set<string>()
  const relatives = new Set<string>()
  for (const spec of specs) {
    if (isRelative(spec)) {
      relatives.add(spec)
      continue
    }
    if (providedPeers.has(spec)) continue
    const pkg = packageNameOf(spec)
    if (providedPeers.has(pkg)) continue
    deps.add(pkg)
  }
  return {
    dependencies: [...deps].sort(),
    relatives: [...relatives].sort(),
  }
}

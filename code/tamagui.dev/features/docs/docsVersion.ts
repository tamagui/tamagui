import type { CodeMode } from './syntaxCookie'

export type DocsSyntax = CodeMode
export type DocsProductVersion = 'v3' | 'v2' | 'v1'

export const docsProductVersions: DocsProductVersion[] = ['v3', 'v2', 'v1']
export const docsSyntaxes: DocsSyntax[] = ['styled', 'unstyled', 'tailwind']

export const docsSyntaxLabels: Record<DocsSyntax, string> = {
  styled: 'Styled',
  unstyled: 'Unstyled',
  tailwind: 'Tailwind',
}

export type DocsVersionFrontmatter = {
  component?: string
  name?: string
  slug?: string
  version?: string
  versions?: string[]
}

export type DocsVersionState = {
  canonicalPath: string
  syntax: DocsSyntax
  productVersion: DocsProductVersion
  isComponentDoc: boolean
  componentName?: string
  sourceVersion?: string
  versions: string[]
  hasArchivedContent: boolean
}

export function getCanonicalDocsPath(pathname: string) {
  if (pathname.startsWith('/tailwind-ui/')) {
    return pathname.replace(/^\/tailwind-ui/, '/ui')
  }

  if (pathname.startsWith('/tailwind/intro/')) {
    return pathname.replace(/^\/tailwind\/intro\//, '/docs/intro/')
  }

  if (pathname.startsWith('/tailwind/core/')) {
    return pathname.replace(/^\/tailwind\/core\//, '/docs/core/')
  }

  if (pathname.startsWith('/tailwind/guides/')) {
    return pathname.replace(/^\/tailwind\/guides\//, '/docs/guides/')
  }

  return pathname
}

export function getDocsSyntax(pathname: string, search: URLSearchParams): DocsSyntax {
  const param = search.get('syntax')
  if (param === 'tailwind') return 'tailwind'
  if (param === 'unstyled') return 'unstyled'
  if (param === 'styled' || param === 'tamagui') return 'styled'
  if (pathname.startsWith('/tailwind')) return 'tailwind'
  return 'styled'
}

export function getDocsVersionState({
  pathname,
  search,
  frontmatter,
}: {
  pathname: string
  search: URLSearchParams
  frontmatter?: DocsVersionFrontmatter
}): DocsVersionState {
  const canonicalPath = getCanonicalDocsPath(pathname)
  const syntax = getDocsSyntax(pathname, search)
  const parts = canonicalPath.split('/').filter(Boolean)
  const isComponentDoc = parts[0] === 'ui'
  const versions = frontmatter?.versions ?? []

  if (isComponentDoc) {
    const componentName = parts[1] || frontmatter?.name || frontmatter?.component
    const explicitSourceVersion = parts[2]
    const sourceVersion = explicitSourceVersion || frontmatter?.version || versions[0]
    const productVersion = explicitSourceVersion
      ? getProductVersionFromSource(explicitSourceVersion)
      : 'v3'

    return {
      canonicalPath,
      syntax,
      productVersion,
      isComponentDoc,
      componentName,
      sourceVersion,
      versions,
      hasArchivedContent: true,
    }
  }

  const versionParam = search.get('version')
  const productVersion = isDocsProductVersion(versionParam) ? versionParam : 'v3'

  return {
    canonicalPath,
    syntax,
    productVersion,
    isComponentDoc,
    versions,
    hasArchivedContent: productVersion === 'v3',
  }
}

export function getDocsVersionHref({
  state,
  productVersion,
  syntax,
}: {
  state: DocsVersionState
  productVersion?: DocsProductVersion
  syntax?: DocsSyntax
}) {
  const nextProductVersion = productVersion ?? state.productVersion
  const nextSyntax = syntax ?? state.syntax
  let pathname = state.canonicalPath
  const search = new URLSearchParams()

  if (state.isComponentDoc && state.componentName) {
    const sourceVersion = getSourceVersionForProductVersion(
      nextProductVersion,
      state.versions
    )
    pathname =
      nextProductVersion === 'v3' || !sourceVersion
        ? `/ui/${state.componentName}`
        : `/ui/${state.componentName}/${sourceVersion}`
  } else if (nextProductVersion !== 'v3') {
    search.set('version', nextProductVersion)
  }

  // styled is the default (no param); unstyled and tailwind are explicit
  if (nextSyntax !== 'styled') {
    search.set('syntax', nextSyntax)
  }

  const query = search.toString()
  return query ? `${pathname}?${query}` : pathname
}

function isDocsProductVersion(value: string | null): value is DocsProductVersion {
  return value === 'v3' || value === 'v2' || value === 'v1'
}

function getProductVersionFromSource(version: string): DocsProductVersion {
  if (version.startsWith('1.')) return 'v1'
  if (version.startsWith('2.')) return 'v2'
  return 'v3'
}

function getSourceVersionForProductVersion(
  productVersion: DocsProductVersion,
  versions: string[]
) {
  if (productVersion === 'v3') {
    return versions.find((version) => version.startsWith('3.'))
  }

  if (productVersion === 'v2') {
    return versions.find((version) => version.startsWith('2.'))
  }

  return versions.find((version) => version.startsWith('1.'))
}

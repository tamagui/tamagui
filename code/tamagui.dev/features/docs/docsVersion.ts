export type DocsSyntax = 'styled' | 'unstyled' | 'tailwind'
export type DocsProductVersion = 'v3' | 'v2' | 'v1'

// picker order. each page offers only the modes that change it: tailwind where
// the transform rewrites its code, copy-paste on v3 component pages with a
// registry skin. copy-paste leads because it is a component page's default.
export const docsSyntaxes: DocsSyntax[] = ['unstyled', 'styled', 'tailwind']

// beside Tailwind the styled mode is plain Tamagui; beside copy-paste it is the
// packaged, styled component
export const docsSyntaxLabels: Record<DocsSyntax, string> = {
  styled: 'Tamagui',
  unstyled: 'Copy-paste',
  tailwind: 'Tailwind',
}
export const docsStyledLabelBesideCopyPaste = 'Styled'

export const docsSyntaxDescriptions: Record<DocsSyntax, string> = {
  styled: 'Show examples with Tamagui style props',
  unstyled: 'Copy the default skin into your app and import it from there',
  tailwind: 'Show examples with Tailwind classes on @tamagui/tailwind',
}

export function getDocsSyntaxParam(value: string | null): DocsSyntax | undefined {
  if (value === 'tailwind') return 'tailwind'
  if (value === 'unstyled' || value === 'source') return 'unstyled'
  if (value === 'styled' || value === 'tamagui') return 'styled'
}

export type DocsVersionFrontmatter = {
  // set by getMDXBySlug when the tailwind transform changes this page's code
  hasTailwindVariant?: boolean
  // set by the component page loader when the registry ships this skin
  hasSourceVariant?: boolean
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

// component pages default to copy-paste at /ui/<name>; the packaged styled
// examples live at /styled-ui/<name>. /unstyled-ui/<name> was the copy-paste
// path before it became the default, and redirects to /ui/<name>.
export function getCanonicalDocsPath(pathname: string) {
  if (/^\/(?:tailwind|styled|unstyled)-ui\//.test(pathname)) {
    return pathname.replace(/^\/(?:tailwind|styled|unstyled)-ui/, '/ui')
  }

  if (/^\/(?:tailwind|unstyled)\/(?:intro|core|guides)\//.test(pathname)) {
    return pathname.replace(/^\/(?:tailwind|unstyled)\//, '/docs/')
  }

  return pathname
}

export function getDocsSyntaxPath(pathname: string, syntax: DocsSyntax) {
  const canonicalPath = getCanonicalDocsPath(pathname)
  if (canonicalPath.startsWith('/ui/')) {
    if (syntax === 'unstyled') return canonicalPath
    return `/${syntax}-ui/${canonicalPath.slice('/ui/'.length)}`
  }
  if (syntax === 'styled') return canonicalPath
  if (canonicalPath.startsWith('/docs/')) {
    return `/${syntax}/${canonicalPath.slice('/docs/'.length)}`
  }
  return canonicalPath
}

export function getDocsSyntax(pathname: string, search?: URLSearchParams): DocsSyntax {
  const param = getDocsSyntaxParam(search?.get('syntax') ?? null)
  if (param) return param
  if (pathname.startsWith('/tailwind')) return 'tailwind'
  if (pathname.startsWith('/styled-ui/')) return 'styled'
  if (pathname.startsWith('/unstyled') || pathname.startsWith('/ui/')) return 'unstyled'
  return 'styled'
}

// copy-paste and styled only mean something on component pages, so a link
// carries that choice between component pages and nowhere else: arriving at
// a component page from a guide lands on its copy-paste default, and leaving
// one for a guide lands on the guide's styled default. tailwind, and an
// explicit copy-paste guide route, carry within their own kind of page.
function getLinkSyntax(currentPathname: string, targetIsComponent: boolean) {
  const current = getDocsSyntax(currentPathname)
  if (current === 'tailwind') return current
  const currentIsComponent = getCanonicalDocsPath(currentPathname).startsWith('/ui/')
  if (targetIsComponent) return currentIsComponent ? current : 'unstyled'
  return currentIsComponent ? 'styled' : current
}

// resolve before navigation so copied links and new tabs load the same document.
export function getDocsLinkHref(href: string, currentPathname: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const url = new URL(href, 'https://tamagui.dev')
  if (url.pathname.endsWith('.md')) return href
  const canonical = getCanonicalDocsPath(url.pathname)
  if (!canonical.startsWith('/docs/') && !canonical.startsWith('/ui/')) return href
  const syntaxParam = getDocsSyntaxParam(url.searchParams.get('syntax'))
  const hasDocsSyntaxParam = syntaxParam !== undefined
  const explicitSyntax = hasDocsSyntaxParam || canonical !== url.pathname
  url.pathname = getDocsSyntaxPath(
    url.pathname,
    explicitSyntax
      ? (syntaxParam ?? getDocsSyntax(url.pathname))
      : getLinkSyntax(currentPathname, canonical.startsWith('/ui/'))
  )
  if (hasDocsSyntaxParam) {
    url.searchParams.delete('syntax')
  }
  return `${url.pathname}${url.search}${url.hash}`
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

  pathname = getDocsSyntaxPath(pathname, nextSyntax)

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

import { getDocsSyntax, type DocsSyntax } from './docsVersion'

export function getDocsMode(props: {
  path?: string
  search?: string
  request?: Request
}): DocsSyntax {
  const url = props.request ? new URL(props.request.url) : undefined
  const search = new URLSearchParams(props.search ?? url?.search)
  const pathname = url?.pathname ?? props.path ?? ''
  if (
    !search.has('syntax') &&
    props.request?.headers.get('host')?.startsWith('tailwind.')
  ) {
    return 'tailwind'
  }
  return getDocsSyntax(pathname, search)
}

export function isTailwindMode(props: {
  path?: string
  search?: string
  request?: Request
}): boolean {
  return getDocsMode(props) === 'tailwind'
}

import { cookieCodeMode, normalizeCodeMode, type CodeMode } from './syntaxCookie'

function paramMode(search?: string): CodeMode | null {
  if (!search) return null
  const param = new URLSearchParams(search).get('syntax')
  return param == null ? null : normalizeCodeMode(param)
}

/**
 * resolves the docs code mode (styled | unstyled | tailwind) from loader props.
 *
 * - explicit `?syntax=` param wins in both directions so links can override.
 * - tailwind additionally has route/subdomain aliases for SEO
 *   (tailwind.tamagui.dev, /tailwind*); unstyled is param/cookie only.
 * - otherwise the sticky `tamaguiSyntax` cookie set by the header toggle decides.
 */
export function getDocsMode(props: { search?: string; request?: Request }): CodeMode {
  const fromParam = paramMode(props.search)
  if (fromParam) return fromParam

  const host = props.request?.headers.get('host') || ''
  if (host.startsWith('tailwind.')) return 'tailwind'

  const pathname = props.request ? new URL(props.request.url).pathname : ''
  if (pathname.startsWith('/tailwind')) return 'tailwind'

  return cookieCodeMode(props.request?.headers.get('cookie'))
}

/** back-compat boolean used by non-docs routes that only care about tailwind */
export function isTailwindMode(props: { search?: string; request?: Request }): boolean {
  return getDocsMode(props) === 'tailwind'
}

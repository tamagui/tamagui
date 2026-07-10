export const SYNTAX_COOKIE = 'tamaguiSyntax'

const cookiePattern = new RegExp(`(?:^|;\\s*)${SYNTAX_COOKIE}=tailwind(?:;|\\s|$)`)

export function cookieHasTailwind(cookieHeader: string | null | undefined): boolean {
  return !!cookieHeader && cookiePattern.test(cookieHeader)
}

export function writeSyntaxCookie(mode: 'tamagui' | 'tailwind') {
  if (typeof document === 'undefined') return
  document.cookie =
    mode === 'tailwind'
      ? `${SYNTAX_COOKIE}=tailwind; path=/; max-age=31536000`
      : `${SYNTAX_COOKIE}=; path=/; max-age=0`
}

/**
 * client-side syntax resolution: an explicit ?syntax= param wins in both
 * directions, otherwise the sticky cookie decides
 */
export function clientSyntaxIsTailwind(search: string): boolean {
  const param = new URLSearchParams(search).get('syntax')
  if (param === 'tailwind') return true
  if (param === 'tamagui') return false
  return typeof document !== 'undefined' && cookieHasTailwind(document.cookie)
}

export const SYNTAX_COOKIE = 'tamaguiSyntax'

/**
 * the docs code toggle has three modes:
 * - `styled`   the default. styled `tamagui` components (v2-compatible look).
 * - `unstyled` the unstyled behavior primitives from `@tamagui/ui`
 *              (`tamagui/unstyled` subpath).
 * - `tailwind` the unstyled primitive styled with Tailwind utilities.
 *
 * styled is the default, so it is represented by the ABSENCE of a cookie. only
 * `unstyled` and `tailwind` are stored. the legacy `tamagui` value (the old
 * default) normalizes to `styled`.
 */
export type CodeMode = 'styled' | 'unstyled' | 'tailwind'

export const DEFAULT_CODE_MODE: CodeMode = 'styled'

const cookieValueRe = new RegExp(`(?:^|;\\s*)${SYNTAX_COOKIE}=([^;\\s]+)`)

// normalize any raw cookie / ?syntax= value to a CodeMode.
// unknown, empty, and the legacy `tamagui` default all fall back to `styled`.
export function normalizeCodeMode(value: string | null | undefined): CodeMode {
  if (value === 'tailwind') return 'tailwind'
  if (value === 'unstyled') return 'unstyled'
  return 'styled'
}

// read the sticky mode from a raw Cookie header (server side)
export function cookieCodeMode(cookieHeader: string | null | undefined): CodeMode {
  if (!cookieHeader) return 'styled'
  return normalizeCodeMode(cookieHeader.match(cookieValueRe)?.[1])
}

/**
 * write the sticky mode cookie set by the header toggle so the mode survives
 * every navigation. styled is the default, so it clears the cookie.
 */
export function writeSyntaxCookie(mode: CodeMode) {
  if (typeof document === 'undefined') return
  document.cookie =
    mode === 'styled'
      ? `${SYNTAX_COOKIE}=; path=/; max-age=0`
      : `${SYNTAX_COOKIE}=${mode}; path=/; max-age=31536000`
}

/**
 * client-side mode resolution: an explicit ?syntax= param wins in both
 * directions, otherwise the sticky cookie decides.
 */
export function clientCodeMode(search: string): CodeMode {
  const param = new URLSearchParams(search).get('syntax')
  if (param != null) return normalizeCodeMode(param)
  return typeof document !== 'undefined' ? cookieCodeMode(document.cookie) : 'styled'
}

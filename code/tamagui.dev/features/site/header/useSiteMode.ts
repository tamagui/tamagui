import { useEffect, useState, useCallback, useMemo } from 'react'
import { usePathname, useRouter } from 'one'
import {
  getCanonicalDocsPath,
  getDocsSyntax,
  getDocsSyntaxPath,
  getDocsVersionHref,
  getDocsVersionState,
  type DocsProductVersion,
  type DocsSyntax,
} from '~/features/docs/docsVersion'
import { codeSyntaxChangeEvent } from '~/features/docs/MDXTabs'
import { freeThemes, type FreeTheme } from '~/features/docs/freeThemes'
import {
  themeBuilderStore,
  useThemeBuilderStore,
} from '~/features/studio/theme/store/ThemeBuilderStore'

const SYNTAX_COOKIE_NAME = 'tamagui_syntax'

function cookieHasTailwind(cookie: string): boolean {
  return cookie.includes(`${SYNTAX_COOKIE_NAME}=tailwind`)
}

function writeSyntaxCookie(syntax: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${SYNTAX_COOKIE_NAME}=${encodeURIComponent(syntax)};path=/;max-age=31536000`
}

export type SiteVersion = 'v3' | 'v2'
export type SiteStyling = 'tamagui' | 'tailwind'
export type SiteSyntax = 'string' | 'object'

const SYNTAX_PREF_KEY = 'tamagui_syntax_preference'
const THEME_PREF_KEY = 'tamagui_site_theme'
const VERSION_PREF_KEY = 'tamagui_version'

export function useSiteMode() {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const { currentThemeId } = useThemeBuilderStore()

  useEffect(() => {
    setMounted(true)
    setSearch(window.location.search)

    const syncSearch = () => {
      setSearch(window.location.search)
    }

    window.addEventListener('popstate', syncSearch)
    window.addEventListener(codeSyntaxChangeEvent, syncSearch)
    return () => {
      window.removeEventListener('popstate', syncSearch)
      window.removeEventListener(codeSyntaxChangeEvent, syncSearch)
    }
  }, [])

  // Restore saved theme on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedTheme = localStorage.getItem(THEME_PREF_KEY)
    if (savedTheme && savedTheme !== 'default' && !themeBuilderStore.currentThemeId) {
      const found = freeThemes.find((t) => String(t.id) === savedTheme)
      if (found) {
        themeBuilderStore.updateGenerate(found.themeData, found.searchQuery, found.id)
      }
    }
  }, [])

  const searchParams = useMemo(() => new URLSearchParams(search), [search])

  const [overrideVersion, setOverrideVersion] = useState<SiteVersion | null>(null)
  const [overrideStyling, setOverrideStyling] = useState<SiteStyling | null>(null)
  const [overrideSyntax, setOverrideSyntax] = useState<SiteSyntax | null>(null)

  // 1. Version
  const version: SiteVersion = useMemo(() => {
    if (overrideVersion) return overrideVersion
    const versionParam = searchParams.get('version')
    if (versionParam === 'v2') return 'v2'
    if (versionParam === 'v3') return 'v3'
    if (pathname.includes('/1.') || pathname.includes('/2.')) return 'v2'
    if (mounted && typeof window !== 'undefined') {
      const saved = localStorage.getItem(VERSION_PREF_KEY)
      if (saved === 'v2') return 'v2'
    }
    return 'v3'
  }, [overrideVersion, searchParams, pathname, mounted])

  // 2. Styling (Tamagui or Tailwind)
  const styling: SiteStyling = useMemo(() => {
    if (version === 'v2') return 'tamagui' // No v2 Tailwind
    if (overrideStyling) return overrideStyling
    if (pathname.startsWith('/tailwind')) return 'tailwind'
    if (searchParams.get('syntax') === 'tailwind') return 'tailwind'
    if (
      searchParams.get('syntax') === 'tamagui' ||
      searchParams.get('syntax') === 'styled'
    )
      return 'tamagui'
    if (mounted && typeof document !== 'undefined' && cookieHasTailwind(document.cookie))
      return 'tailwind'
    return 'tamagui'
  }, [version, overrideStyling, pathname, searchParams, mounted])

  // 3. Syntax (String or Object)
  const syntax: SiteSyntax = useMemo(() => {
    if (overrideSyntax) return overrideSyntax
    const param = searchParams.get('syntax')
    if (param === 'typed' || param === 'object') return 'object'
    if (param === 'string') return 'string'
    if (mounted && typeof window !== 'undefined') {
      const saved = localStorage.getItem(SYNTAX_PREF_KEY)
      if (saved === 'object' || saved === 'typed') return 'object'
    }
    return 'string'
  }, [overrideSyntax, searchParams, mounted])

  // 4. Theme
  const themeId = currentThemeId || 'default'

  // Setters
  const setVersion = useCallback(
    (nextVersion: SiteVersion) => {
      setOverrideVersion(nextVersion)
      if (typeof window !== 'undefined') {
        localStorage.setItem(VERSION_PREF_KEY, nextVersion)
      }

      const isDocs =
        pathname.startsWith('/docs') ||
        pathname.startsWith('/ui') ||
        pathname.startsWith('/tailwind')
      if (isDocs) {
        const state = getDocsVersionState({
          pathname,
          search: new URLSearchParams(window.location.search),
        })
        const nextStyling =
          nextVersion !== 'v2' && styling === 'tailwind'
            ? 'tailwind'
            : state.isComponentDoc
              ? 'unstyled'
              : 'styled'
        const href = getDocsVersionHref({
          state,
          productVersion: nextVersion,
          syntax: nextStyling as DocsSyntax,
        })
        router.push(href as any)
      }
    },
    [pathname, router, styling]
  )

  const setStyling = useCallback(
    (nextStyling: SiteStyling) => {
      setOverrideStyling(nextStyling)
      writeSyntaxCookie(nextStyling)

      const isDocs =
        pathname.startsWith('/docs') ||
        pathname.startsWith('/ui') ||
        pathname.startsWith('/tailwind')
      if (isDocs) {
        const targetSyntax: DocsSyntax =
          nextStyling === 'tailwind'
            ? 'tailwind'
            : getCanonicalDocsPath(pathname).startsWith('/ui/')
              ? 'unstyled'
              : 'styled'
        const nextPath = getDocsSyntaxPath(pathname, targetSyntax)
        const currentSearch = window.location.search
        router.push((currentSearch ? `${nextPath}${currentSearch}` : nextPath) as any)
      } else {
        // If not in docs, trigger reload or state update
        setSearch(window.location.search)
      }
    },
    [pathname, router]
  )

  const setSyntax = useCallback((nextSyntax: SiteSyntax) => {
    setOverrideSyntax(nextSyntax)
    if (typeof window !== 'undefined') {
      localStorage.setItem(SYNTAX_PREF_KEY, nextSyntax)
      const url = new URL(window.location.href)
      if (nextSyntax === 'object') {
        url.searchParams.set('syntax', 'typed')
      } else {
        url.searchParams.delete('syntax')
      }
      window.history.replaceState(
        window.history.state,
        '',
        `${url.pathname}${url.search}${url.hash}`
      )
      window.dispatchEvent(new Event(codeSyntaxChangeEvent))
    }
  }, [])

  const setTheme = useCallback((nextThemeId: string | number) => {
    const idStr = String(nextThemeId)
    if (idStr === 'default') {
      themeBuilderStore.clearTheme()
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_PREF_KEY, 'default')
      }
      return
    }

    const found = freeThemes.find((t) => String(t.id) === idStr)
    if (found) {
      themeBuilderStore.updateGenerate(found.themeData, found.searchQuery, found.id)
      if (typeof window !== 'undefined') {
        localStorage.setItem(THEME_PREF_KEY, idStr)
      }
    }
  }, [])

  // Short form text for the header badge
  // 'v3.tamagui.string', 'v3.tamagui.object', 'v3.tailwind'
  const shortForm = useMemo(() => {
    if (styling === 'tailwind') {
      return `${version}.tailwind`
    }
    return `${version}.tamagui.${syntax}`
  }, [version, styling, syntax])

  return {
    version,
    styling,
    syntax,
    themeId,
    shortForm,
    setVersion,
    setStyling,
    setSyntax,
    setTheme,
    freeThemes,
  }
}

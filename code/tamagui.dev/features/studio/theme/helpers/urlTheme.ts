import { bentoStore } from '~/features/bento/BentoStore'
import { toastController } from '~/features/studio/ToastProvider'
import { themeBuilderStore } from '~/features/studio/theme/store/ThemeBuilderStore'
import { getStudioInternalThemeName } from '~/features/studio/theme/updatePreviewTheme'
import { mutateThemes } from 'tamagui'

export function decodeThemePayload(payload: string): any {
  try {
    const clean = decodeURIComponent(payload).trim()
    if (clean.startsWith('{') || clean.startsWith('[')) {
      return JSON.parse(clean)
    }
    // Base64 decode (supporting url-safe base64: - and _)
    const base64 = clean.replace(/-/g, '+').replace(/_/g, '/')
    const decodedStr = atob(base64)
    return JSON.parse(decodedStr)
  } catch (err) {
    console.warn('Failed to parse theme payload:', err)
    return null
  }
}

export function parseThemeFromUrl(): { themeData: any; source: 'hash' | 'query' } | null {
  if (typeof window === 'undefined') return null

  // 1. Check hash (#theme=... or #config=... or raw base64)
  const rawHash = window.location.hash.slice(1)
  if (rawHash) {
    const params = new URLSearchParams(rawHash)
    const encoded =
      params.get('theme') ||
      params.get('config') ||
      params.get('data') ||
      (rawHash.includes('=') ? rawHash.replace(/^(theme|config|data)=/, '') : rawHash)
    if (encoded) {
      const decoded = decodeThemePayload(encoded)
      if (decoded) return { themeData: decoded, source: 'hash' }
    }
  }

  // 2. Check search params (?theme=... or ?config=...)
  const searchParams = new URLSearchParams(window.location.search)
  const queryEncoded = searchParams.get('theme') || searchParams.get('config')
  if (queryEncoded) {
    const decoded = decodeThemePayload(queryEncoded)
    if (decoded) return { themeData: decoded, source: 'query' }
  }

  return null
}

function makeAnchors(hue: number, sat: number, isAccent = false) {
  return [
    {
      index: 0,
      hue: { sync: true, light: hue, dark: hue },
      sat: { sync: true, light: sat, dark: Math.min(1, sat * 1.05) },
      lum: { light: isAccent ? 0.45 : 0.99, dark: isAccent ? 0.35 : 0.02 },
      alpha: { light: 1, dark: 1 },
    },
    {
      index: 8,
      hue: { syncLeft: true, sync: true, light: hue, dark: hue },
      sat: { syncLeft: true, sync: true, light: sat, dark: Math.min(1, sat * 1.05) },
      lum: { light: isAccent ? 0.7 : 0.5, dark: isAccent ? 0.65 : 0.5 },
      alpha: { light: 1, dark: 1 },
    },
    {
      index: 9,
      hue: { sync: true, light: hue, dark: hue },
      sat: { sync: true, light: sat, dark: Math.min(1, sat * 1.05) },
      lum: { light: isAccent ? 0.92 : 0.15, dark: isAccent ? 0.9 : 0.925 },
      alpha: { light: 1, dark: 1 },
    },
    {
      index: 10,
      hue: { syncLeft: true, sync: true, light: hue, dark: hue },
      sat: { syncLeft: true, sync: true, light: sat, dark: Math.min(1, sat * 1.05) },
      lum: { light: isAccent ? 0.98 : 0.01, dark: isAccent ? 0.95 : 0.99 },
      alpha: { light: 1, dark: 1 },
    },
  ]
}

export function applyThemeFromUrl(themeData: any) {
  try {
    const name = themeData.name || 'Custom Theme'

    // Case 1: Full palettes object { base: { anchors: [...] }, accent: { ... } }
    if (themeData.palettes) {
      themeBuilderStore.updateGenerate(
        {
          name,
          schemes: themeData.schemes || { light: true, dark: true },
          palettes: themeData.palettes,
        },
        name,
        'url-preview'
      )
      toastController.show(`Previewing custom theme: ${name}`)
      return true
    }

    // Case 2: Hues given (e.g. { baseHue: 35, accentHue: 40 })
    if (themeData.baseHue !== undefined || themeData.accentHue !== undefined) {
      const bHue = Number(themeData.baseHue ?? 210)
      const bSat = Number(themeData.baseSat ?? 0.08)
      const aHue = Number(themeData.accentHue ?? bHue)
      const aSat = Number(themeData.accentSat ?? 0.9)
      const generated = {
        name,
        schemes: { light: true, dark: true },
        palettes: {
          base: { name: 'base', anchors: makeAnchors(bHue, bSat, false) },
          accent: { name: 'accent', anchors: makeAnchors(aHue, aSat, true) },
        },
      }
      themeBuilderStore.updateGenerate(generated, name, 'url-preview')
      toastController.show(`Previewing generated theme: ${name}`)
      return true
    }

    // Case 3: Simple palette array { palette: [...] }
    if (Array.isArray(themeData.palette) || Array.isArray(themeData.palettes)) {
      const colors = (themeData.palette || themeData.palettes) as string[]
      // Direct color scale applied as light and dark themes
      const id = bentoStore.themeSuiteUID || '1'
      const lightTheme: Record<string, string> = {}
      const darkTheme: Record<string, string> = {}

      colors.forEach((col, idx) => {
        const tokenKey = `color${idx + 1}`
        lightTheme[tokenKey] = col
        darkTheme[tokenKey] = colors[colors.length - 1 - idx]
      })
      lightTheme['background'] = colors[0]
      lightTheme['color'] = colors[colors.length - 1]
      darkTheme['background'] = colors[colors.length - 1]
      darkTheme['color'] = colors[0]

      const internalId = getStudioInternalThemeName(id)
      mutateThemes({
        themes: [
          { name: `light_${internalId}`, theme: lightTheme },
          { name: `dark_${internalId}`, theme: darkTheme },
        ],
        batch: 'themes',
      })
      toastController.show(`Previewing palette: ${name}`)
      return true
    }

    // Case 4: Direct themes map { light: {...}, dark: {...} } or { themes: { ... } }
    if (themeData.themes || themeData.light || themeData.dark) {
      const themes = themeData.themes || themeData
      const id = bentoStore.themeSuiteUID || '1'
      const insertThemes: any[] = []
      for (const tName in themes) {
        if (tName === 'name' || tName === 'schemes') continue
        const theme = themes[tName]
        const [scheme, ...rest] = tName.split('_')
        const finalName = [scheme, getStudioInternalThemeName(id), ...rest].join('_')
        insertThemes.push({
          name: finalName,
          theme,
        })
      }
      mutateThemes({
        themes: insertThemes,
        batch: 'themes',
      })
      toastController.show(`Previewing custom themes from URL!`)
      return true
    }
  } catch (err: any) {
    console.error('Failed to apply theme from URL:', err)
  }
  return false
}

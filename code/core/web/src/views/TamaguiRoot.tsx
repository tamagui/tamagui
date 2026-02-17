import React from 'react'
import { getConfig } from '../config'
import { ThemeName } from '../types'
import { Theme } from './Theme'

let defaultFontClass = ''

/**
 * Applies default font class and CSS variable inheritance via display:contents.
 * Used by TamaguiProvider at the root and by portals to re-establish font scope.
 * Pass trackMount to also handle the t_unmounted class for CSS animation gating.
 */
export function TamaguiRoot({
  children,
  theme,
  isRootRoot,
  passThrough,
  style,
}: {
  children: React.ReactNode
  theme: ThemeName
  isRootRoot?: boolean
  passThrough?: boolean
  style?: React.CSSProperties
}) {
  const [mounted, setMounted] = React.useState(!isRootRoot)

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true)
    }
  }, [])

  // cache the font class name
  if (!defaultFontClass) {
    const config = getConfig()
    const defaultFont = config.defaultFont
    if (defaultFont) {
      defaultFontClass = `font_${defaultFont}`
    }
  }

  return (
    // we re-thread the theme so each root gets the right className setup
    <Theme passThrough={passThrough} contain forceClassName name={theme}>
      <span
        style={style}
        // font_body (or default font) sets all font properties via shared CSS rule
        className={`_dsp_contents ${mounted ? '' : 't_unmounted'} ${defaultFontClass}`}
      >
        {children}
      </span>
    </Theme>
  )
}

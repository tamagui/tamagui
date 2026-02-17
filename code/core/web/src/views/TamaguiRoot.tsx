import React, { CSSProperties } from 'react'
import { getConfig } from '../config'
import { getVariableVariable } from '../createVariable'
import { ThemeName, Variable } from '../types'
import { Theme } from './Theme'

let defaultFontStyles: CSSProperties | undefined
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

  // we setup the base text cascade here
  if (!defaultFontStyles) {
    const config = getConfig()
    const defaultFont = config.defaultFont
    if (defaultFont) {
      const fontDefinition = config.fontsParsed[defaultFont]
      const defaultFontKey = config.defaultFontToken || '$true'
      if (fontDefinition) {
        defaultFontClass = `font_${defaultFont}`
        defaultFontStyles = {
          fontFamily: 'var(--f-family)',
          color: getVariableVariable(fontDefinition.color?.[defaultFontKey]),
          letterSpacing: getVariableVariable(
            fontDefinition.letterSpacing?.[defaultFontKey] as Variable
          ),
          lineHeight: getVariableVariable(
            fontDefinition.lineHeight?.[defaultFontKey] as Variable
          ),
          fontStyle: getVariableVariable(
            fontDefinition.style?.[defaultFontKey] as Variable
          ),
          fontWeight: getVariableVariable(
            fontDefinition.weight?.[defaultFontKey] as Variable
          ),
        }
      }
    }
  }

  const finalStyle =
    !passThrough && style ? { ...defaultFontStyles, ...style } : defaultFontStyles

  return (
    <Theme passThrough={passThrough} contain forceClassName name={theme}>
      <span
        style={finalStyle}
        className={`_dsp_contents ${mounted ? '' : 't_unmounted'} ${defaultFontClass}`}
      >
        {children}
      </span>
    </Theme>
  )
}

import React from 'react'
import { getConfig } from '../config'

/**
 * Applies default font class and CSS variable inheritance via display:contents.
 * Used by TamaguiProvider at the root and by portals to re-establish font scope.
 * Pass trackMount to also handle the t_unmounted class for CSS animation gating.
 */
export function TamaguiRoot(props: {
  children: React.ReactNode
  trackMount?: boolean
  style?: React.CSSProperties
}) {
  const [mounted, setMounted] = React.useState(!props.trackMount)

  React.useEffect(() => {
    if (!mounted) {
      setMounted(true)
    }
  }, [])

  const config = getConfig()
  const defaultFont = config.defaultFont
  const fontClass = defaultFont ? `font_${defaultFont}` : ''
  const className = [mounted ? '' : 't_unmounted', fontClass].filter(Boolean).join(' ')
  const baseStyle = {
    display: 'contents' as const,
    fontFamily: defaultFont ? 'var(--f-family)' : undefined,
  }

  const style = props.style ? { ...baseStyle, ...props.style } : baseStyle

  return (
    <span style={style} className={className || undefined}>
      {props.children}
    </span>
  )
}

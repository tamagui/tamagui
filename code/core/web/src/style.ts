import React from 'react'

import type { StaticShapeStyle, StylePiece, TextStyle, ThemeParsed } from './types'
import { stylePieceSymbol } from './types'
import { warnOnce } from './helpers/warnOnce'
import { useThemeWithState } from './hooks/useTheme'

type StylePieceLayer = 'base' | 'style'
type StylePieceCompiler = (piece: StylePiece, layer: StylePieceLayer) => void
type StylePieceResolver = (
  piece: StylePiece,
  theme: ThemeParsed,
  themeName: string
) => TextStyle

let compileStylePiece: StylePieceCompiler | undefined
let resolveStylePiece: StylePieceResolver | undefined
const uncacheablePieces = new WeakSet<StylePiece>()
const flatClausePattern = /(?:^|\s)@?[A-Za-z][A-Za-z0-9-]*(?:\/[A-Za-z0-9_-]+)?:/

export function setStylePieceCompiler(compiler: StylePieceCompiler) {
  compileStylePiece = compiler
}

export function setStylePieceResolver(resolver: StylePieceResolver) {
  resolveStylePiece = resolver
}

export function isStylePiece(value: unknown): value is StylePiece {
  return (
    !!value &&
    typeof value === 'object' &&
    stylePieceSymbol in (value as Record<PropertyKey, unknown>)
  )
}

export function isStylePieceCacheable(piece: StylePiece) {
  return !uncacheablePieces.has(piece)
}

function canCacheByTheme(definition: StaticShapeStyle) {
  for (const key in definition) {
    const value = definition[key]
    if (
      (typeof value === 'string' && flatClausePattern.test(value)) ||
      (value && typeof value === 'object')
    ) {
      return false
    }
  }
  return true
}

export function createStylePiece(
  definition: StaticShapeStyle,
  layer: StylePieceLayer = 'style'
): StylePiece {
  const piece: StylePiece = {
    className: '',
    [stylePieceSymbol]: {
      byKey: {},
      styleObject: definition,
    },
  }
  if (!canCacheByTheme(definition)) {
    uncacheablePieces.add(piece)
  }
  compileStylePiece?.(piece, layer)
  return piece
}

/**
 * Creates a statically-shaped style fragment. The fragment is accepted only by
 * Tamagui's `style` prop; array order uses the style prop's normal last-wins
 * precedence.
 */
export function style(definition: StaticShapeStyle): StylePiece {
  if (process.env.NODE_ENV === 'development') {
    const internals = (React as any)
      .__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE
    if (internals?.H) {
      warnOnce(
        '[tamagui] style() was called during render. Define style pieces at module scope so their rules compile once.'
      )
    }
  }
  return createStylePiece(definition)
}

/** Resolves a style piece to a native/inline style object for compatibility props. */
export function useStyle(piece?: StylePiece | null): TextStyle | undefined {
  const [, themeState] = useThemeWithState({})
  if (!piece) return
  return resolveStylePiece
    ? resolveStylePiece(piece, themeState.theme, themeState.name)
    : piece[stylePieceSymbol].styleObject
}

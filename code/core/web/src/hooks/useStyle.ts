import type { StylePiece, TextStyle } from '../types'
import { resolveStylePieceForTheme } from '../style'
import { useThemeWithState } from './useTheme'

/** Resolves a style piece to a native/inline style object for compatibility props. */
export function useStyle(piece?: StylePiece | null): TextStyle | undefined {
  const [, themeState] = useThemeWithState({})
  if (!piece) return
  return resolveStylePieceForTheme(piece, themeState.theme, themeState.name)
}

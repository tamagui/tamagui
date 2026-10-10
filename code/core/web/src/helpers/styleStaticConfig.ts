import type { StaticConfig, StylePiece, TamaguiInternalConfig } from '../types'
import { getConfigRevisionState } from './grammarConfig'

export type StyleStaticConfig = {
  baseStyle: Record<string, any> | undefined
  baseVariantProps: Record<string, any> | undefined
  baseStylePiece: StylePiece | undefined
  baseStylePieces: Record<string, StylePiece> | undefined
  defaultProps: Record<string, any> | undefined
  styledContextKeys: Set<string> | null
  variants: StaticConfig['variants']
  variantStyleResolver: any
  passthroughClassName: string | undefined
}

export function getStyleStaticConfig(
  staticConfig: StaticConfig,
  conf: TamaguiInternalConfig
): StyleStaticConfig {
  return getConfigRevisionState(conf).styleStaticConfig(staticConfig, conf)
}

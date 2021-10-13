import { getSplitStyles } from '../helpers/getSplitStyles'
import { StaticConfigParsed, TamaguiInternalConfig, ThemeObject } from '../types'

// used only by static extractor

export const postProcessStyles = (
  inStyles: any,
  staticConfig: StaticConfigParsed,
  theme: ThemeObject
) => {
  const { style, viewProps, pseudos, classNames } = getSplitStyles(inStyles, staticConfig, theme)
  // flattening
  const next = {}
  for (const s of style) {
    if (!s) continue
    Object.assign(next, s)
  }
  Object.assign(next, pseudos)
  return { style: next, viewProps, classNames }
}

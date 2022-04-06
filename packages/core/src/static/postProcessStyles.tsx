import { getSplitStyles } from '../helpers/getSplitStyles'
import { StaticConfigParsed, TamaguiInternalConfig, ThemeObject } from '../types'

// used only by static extractor

export const postProcessStyles = (
  inStyles: any,
  staticConfig: StaticConfigParsed,
  theme: ThemeObject
) => {
  const { style, viewProps, pseudos, classNames } = getSplitStyles(inStyles, staticConfig, theme)
  return {
    style: {
      ...style,
      ...pseudos,
    },
    viewProps,
    classNames,
  }
}

import type { StaticConfig } from '../types'

/**
 * The options styled() was authored with, styles included. The runtime splits
 * these into a base style layer and real props (see `splitStyledOptions`); this
 * is the un-split view, which the compiler and themeable() want.
 */
export const getDefaultProps = (staticConfig: StaticConfig) => staticConfig.defaultProps

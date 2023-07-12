import type { StaticConfig, StaticConfigParsed } from '../types'
import { createPropMapper } from './createPropMapper'

export const parseStaticConfig = (config: Partial<StaticConfig>): StaticConfigParsed => {
  const parsed = {
    defaultProps: {},
    ...config,
    parsed: true,
  } as const
  return {
    ...parsed,
    propMapper: createPropMapper(parsed as StaticConfigParsed),
  }
}

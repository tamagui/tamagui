import { workspaceScale } from '@fixture/theme'
import { aliasedToken as baseSpace } from '#tokens'

const baseConfig = {
  padding: baseSpace,
}

export const config = {
  ...baseConfig,
  gap: baseSpace * workspaceScale.multiplier,
}

export const configUse = config.gap

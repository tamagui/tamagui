import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from '@tamagui/core'
import { resolution as conditionalResolution } from '@fixture/conditional'
import evaluationPluginNames from '#evaluation-pipeline'
import {
  resolution as commandResolution,
  space as commandSpace,
} from '#command-resolution'
import { space as configSpace } from '#config-space'
import { fixtureSpace, resolution as workspaceResolution } from '#workspace-resolution'
import { resolution as pluginResolution } from '#plugin-resolution'

globalThis.__tamaguiFixtureEvaluationOrder ??= []
globalThis.__tamaguiFixtureEvaluationOrder.push('config')
globalThis.__tamaguiFixtureOwnedEvaluation?.push('import:config')
globalThis.__tamaguiFixtureOwnedPluginNames = evaluationPluginNames

export const compilerResolution = `${conditionalResolution}:${workspaceResolution}:${pluginResolution}:${commandResolution}`
export { evaluationPluginNames }

export default createTamagui({
  ...defaultConfig,
  media: {
    ...defaultConfig.media,
    sm: {
      ...defaultConfig.media.sm,
      minWidth: fixtureSpace + commandSpace + configSpace,
    },
  },
  tokens: {
    ...defaultConfig.tokens,
    space: {
      ...defaultConfig.tokens.space,
      fixture: fixtureSpace + commandSpace + configSpace,
    },
  },
})

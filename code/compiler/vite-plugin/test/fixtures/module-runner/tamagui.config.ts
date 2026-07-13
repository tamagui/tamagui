import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from '@tamagui/core'
import {
  modulePath as packageExportPath,
  resolution as packageExportResolution,
} from '@tamagui/evaluation-fixture/value'
import { Slider } from '@tamagui/slider'
import { resolution as conditionalResolution } from '@fixture/conditional'
import { Slider as TamaguiBarrelSlider } from 'tamagui'
import evaluationPluginNames, {
  oneTsconfigPathsOrder,
  sliderResolution,
  tamaguiExternalConfigured,
  tamaguiResolution,
} from '#evaluation-pipeline'
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
globalThis.__tamaguiFixtureSliderIntervalDisabled =
  process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL
globalThis.__tamaguiFixtureSliderModuleLoaded = Boolean(Slider)
globalThis.__tamaguiFixtureSliderResolution = sliderResolution
globalThis.__tamaguiFixtureTamaguiBarrelLoaded = Boolean(TamaguiBarrelSlider)
globalThis.__tamaguiFixtureTamaguiExternalConfigured = tamaguiExternalConfigured
globalThis.__tamaguiFixtureTamaguiResolution = tamaguiResolution

export const compilerResolution = `${conditionalResolution}:${workspaceResolution}:${pluginResolution}:${commandResolution}`
export const sliderIntervalDisabled = process.env.TAMAGUI_DISABLE_SLIDER_INTERVAL
export const sliderModuleLoaded = Boolean(Slider)
export const tamaguiBarrelLoaded = Boolean(TamaguiBarrelSlider)
export {
  evaluationPluginNames,
  oneTsconfigPathsOrder,
  packageExportPath,
  packageExportResolution,
  sliderResolution,
  tamaguiExternalConfigured,
  tamaguiResolution,
}

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

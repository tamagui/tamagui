import { join } from 'path'

import { getVariableValue } from '@tamagui/core-node'
import { TamaguiOptions } from '@tamagui/types'
import fs from 'fs-extra'

import { BundledConfig, getBundledConfig } from './bundleConfig'

const confFile = join(process.cwd(), '.tamagui', 'tamagui.config.json')

/**
 * Sort of a super-set of bundleConfig(), this code needs some refactoring ideally
 */

export async function generateTamaguiStudioConfig(
  tamaguiOptions: TamaguiOptions,
  configIn?: BundledConfig | null,
  rebuild = false
) {
  try {
    const config = configIn ?? (await getBundledConfig(tamaguiOptions, rebuild))

    if (!config) return

    await fs.writeJSON(
      confFile,
      {
        ...config,
        tamaguiConfig: transformConfig(config),
      },
      {
        spaces: 2,
      }
    )
  } catch (err) {
    if (process.env.DEBUG?.includes('tamagui')) {
      console.warn('generateTamaguiStudioConfig error', err)
    }
    // ignore for now
  }
}

export function generateTamaguiStudioConfigSync(
  _tamaguiOptions: TamaguiOptions,
  config: BundledConfig
) {
  try {
    fs.writeJSONSync(
      confFile,
      {
        ...config,
        tamaguiConfig: transformConfig(config),
      },
      {
        spaces: 2,
      }
    )
  } catch (err) {
    if (process.env.DEBUG?.includes('tamagui')) {
      console.warn('generateTamaguiStudioConfig error', err)
    }
    // ignore for now
  }
}

function transformConfig(config: BundledConfig) {
  // ensure we don't mangle anything in the original
  const next = JSON.parse(JSON.stringify(config))

  const { components, nameToPaths } = next
  const { themes, tokens } = next.tamaguiConfig

  // reduce down to usable, smaller json

  // slim themes, add name
  for (const key in themes) {
    const theme = themes[key]
    // @ts-ignore
    theme.id = key
    for (const tkey in theme) {
      theme[tkey] = getVariableValue(theme[tkey])
    }
  }

  // flatten variables
  for (const key in tokens) {
    const token = { ...tokens[key] }
    for (const tkey in token) {
      token[tkey] = getVariableValue(token[tkey])
    }
  }

  // remove bulky stuff in components
  for (const component of components) {
    for (const _ in component.nameToInfo) {
      // avoid mutating
      const compDefinition = { ...component.nameToInfo[_] }
      component.nameToInfo[_] = compDefinition

      const { parentStaticConfig, ...rest } = compDefinition.staticConfig
      compDefinition.staticConfig = rest
    }
  }

  // set to array
  for (const key in nameToPaths) {
    // @ts-ignore
    nameToPaths[key] = [...nameToPaths[key]]
  }

  // remove stuff we dont need to send
  const { fontsParsed, getCSS, tokensParsed, themeConfig, ...cleanedConfig } =
    next.tamaguiConfig

  return cleanedConfig
}

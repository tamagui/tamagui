import { join } from 'path'

import { getVariableValue } from '@tamagui/core-node'
import { generateThemes } from '@tamagui/generate-themes'
import { TamaguiOptions } from '@tamagui/types'
import fs from 'fs-extra'

import { BundledConfig, getBundledConfig } from './bundleConfig'

const tamaguiDir = join(process.cwd(), '.tamagui')
const confFile = join(tamaguiDir, 'tamagui.config.json')

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
    const out = transformConfig(config)

    fs.writeJSON(confFile, out, {
      spaces: 2,
    })
  } catch (err) {
    if (process.env.DEBUG?.includes('tamagui') || process.env.IS_TAMAGUI_DEV) {
      console.warn('generateTamaguiStudioConfig error', err)
    }
    // ignore for now
  }
}

export async function generateTamaguiThemes(tamaguiOptions: TamaguiOptions) {
  if (!tamaguiOptions.themes) {
    return
  }

  const inPath = tamaguiOptions.themes.startsWith('.')
    ? join(process.cwd(), tamaguiOptions.themes)
    : require.resolve(tamaguiOptions.themes)

  await generateThemes({
    inPath,
    outPath: join(tamaguiDir, `tamagui.themes.json`),
  })
}

export function generateTamaguiStudioConfigSync(
  _tamaguiOptions: TamaguiOptions,
  config: BundledConfig
) {
  try {
    fs.writeJSONSync(confFile, transformConfig(config), {
      spaces: 2,
    })
  } catch (err) {
    if (process.env.DEBUG?.includes('tamagui') || process.env.IS_TAMAGUI_DEV) {
      console.warn('generateTamaguiStudioConfig error', err)
    }
    // ignore for now
  }
}

function cloneDeepSafe(x: any, excludeKeys = {}) {
  if (!x) return x
  if (Array.isArray(x)) return x.map((_) => cloneDeepSafe(_))
  if (typeof x === 'function') return `Function`
  if (typeof x !== 'object') return x
  if ('$$typeof' in x) return 'Component'
  return Object.fromEntries(
    Object.entries(x).flatMap(([k, v]) => (excludeKeys[k] ? [] : [[k, cloneDeepSafe(v)]]))
  )
}

function transformConfig(config: BundledConfig) {
  if (!config) {
    return null
  }

  // ensure we don't mangle anything in the original
  const next = cloneDeepSafe(config, {
    validStyles: true,
  }) as BundledConfig

  const { components, nameToPaths, tamaguiConfig } = next
  const { themes, tokens } = tamaguiConfig

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
  next.nameToPaths = {}
  for (const key in nameToPaths) {
    next.nameToPaths[key] = [...nameToPaths[key]]
  }

  // remove stuff we dont need to send
  const { fontsParsed, getCSS, tokensParsed, themeConfig, ...cleanedConfig } =
    next.tamaguiConfig

  return {
    components,
    nameToPaths,
    tamaguiConfig: cleanedConfig,
  }
}

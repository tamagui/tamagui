import { dirname, join } from 'node:path'

import { generateThemes, writeGeneratedThemes } from '@tamagui/generate-themes'
import type { TamaguiOptions } from '@tamagui/types'
import * as FS from 'fs-extra'

import { requireTamaguiCore } from '../helpers/requireTamaguiCore'
import type { TamaguiPlatform } from '../types'
import type { BundledConfig } from './bundleConfig'
import { getBundledConfig } from './bundleConfig'

const tamaguiDir = join(process.cwd(), '.tamagui')
const confFile = join(tamaguiDir, 'tamagui.config.json')

/**
 * Sort of a super-set of bundleConfig(), this code needs some refactoring ideally
 */

export async function regenerateConfig(
  tamaguiOptions: TamaguiOptions,
  configIn?: BundledConfig | null,
  rebuild = false
) {
  try {
    // this has a side effect of rebuilding config and css!
    // need to improve code here:
    const config = configIn ?? (await getBundledConfig(tamaguiOptions, rebuild))
    if (!config) return
    const out = transformConfig(config, tamaguiOptions.platform || 'web')

    await FS.ensureDir(dirname(confFile))
    await FS.writeJSON(confFile, out, {
      spaces: 2,
    })
  } catch (err) {
    if (process.env.DEBUG?.includes('tamagui') || process.env.IS_TAMAGUI_DEV) {
      console.warn('regenerateConfig error', err)
    }
    // ignore for now
  }
}

export function regenerateConfigSync(
  _tamaguiOptions: TamaguiOptions,
  config: BundledConfig
) {
  try {
    FS.ensureDirSync(dirname(confFile))
    FS.writeJSONSync(
      confFile,
      transformConfig(config, _tamaguiOptions.platform || 'web'),
      {
        spaces: 2,
      }
    )
  } catch (err) {
    if (process.env.DEBUG?.includes('tamagui') || process.env.IS_TAMAGUI_DEV) {
      console.warn('regenerateConfig error', err)
    }
    // ignore for now
  }
}

export async function generateTamaguiThemes(
  tamaguiOptions: TamaguiOptions,
  force = false
) {
  if (!tamaguiOptions.themeBuilder) {
    return
  }

  const { input, output } = tamaguiOptions.themeBuilder
  const inPath = resolveRelativePath(input)
  const outPath = resolveRelativePath(output)
  const generatedOutput = await generateThemes(inPath)

  // because this runs in parallel (its cheap) lets avoid logging a bunch, so check to see if changed:
  const hasChanged =
    force ||
    (await (async () => {
      try {
        if (!generatedOutput) return false
        const next = generatedOutput.generated
        const current = await FS.readFile(outPath, 'utf-8')
        return next !== current
      } catch (err) {
        // ok
      }
      return true
    })())

  if (hasChanged) {
    await writeGeneratedThemes(tamaguiDir, outPath, generatedOutput)
  }

  return hasChanged
}

const resolveRelativePath = (inputPath: string) =>
  inputPath.startsWith('.') ? join(process.cwd(), inputPath) : require.resolve(inputPath)

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

function transformConfig(config: BundledConfig, platform: TamaguiPlatform) {
  if (!config) {
    return null
  }

  const { getVariableValue } = requireTamaguiCore(platform)

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

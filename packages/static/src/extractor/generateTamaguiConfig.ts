import { getVariableValue } from '@tamagui/core-node'
import { CLIResolvedOptions } from '@tamagui/types'
import fs, { ensureDir } from 'fs-extra'

import { bundleConfig } from './bundleConfig.js'

async function getTamaguiConfig(options: CLIResolvedOptions) {
  return bundleConfig(options.tamaguiOptions)
}

export async function generateTamaguiConfig(options: CLIResolvedOptions) {
  await ensureDir(options.paths.dotDir)
  const config = await getTamaguiConfig(options)
  const { components, nameToPaths } = config
  const { themes, tokens } = config.tamaguiConfig
  console.log(config.tamaguiConfig.media)

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
    const token = tokens[key]
    for (const tkey in token) {
      token[tkey] = getVariableValue(token[tkey])
    }
  }

  // remove bulky stuff in components
  for (const component of components) {
    for (const _ in component.nameToInfo) {
      delete component.nameToInfo[_].staticConfig['validStyles']
      delete component.nameToInfo[_].staticConfig['parentStaticConfig']
    }
  }

  // set to array
  for (const key in nameToPaths) {
    // @ts-ignore
    nameToPaths[key] = [...nameToPaths[key]]
  }

  // remove stuff we dont need to send
  const { fontsParsed, getCSS, tokensParsed, themeConfig, ...cleanedConfig } =
    config.tamaguiConfig

  await fs.writeJSON(
    options.paths.conf,
    {
      ...config,
      tamaguiConfig: cleanedConfig,
    },
    {
      spaces: 2,
    }
  )
}
